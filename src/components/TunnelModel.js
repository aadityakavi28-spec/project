// ============================================================
// TUNNEL 3D MODEL
// Multi-Asset Structural Monitoring Platform
// ============================================================

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/* =========================
   WARNING HALO EFFECT
========================= */
const WarningHalo = ({ position, isWarning, isCritical }) => {
  const haloRef = useRef();

  useFrame(({ clock }) => {
    if (haloRef.current) {
      const time = clock.getElapsedTime();
      if (isCritical) {
        haloRef.current.scale.set(
          1 + Math.sin(time * 8) * 0.3,
          1 + Math.sin(time * 8) * 0.3,
          1 + Math.sin(time * 8) * 0.3
        );
      } else if (isWarning) {
        haloRef.current.scale.set(
          1 + Math.sin(time * 4) * 0.2,
          1 + Math.sin(time * 4) * 0.2,
          1 + Math.sin(time * 4) * 0.2
        );
      }
    }
  });

  return (
    <mesh ref={haloRef} position={position}>
      <sphereGeometry args={[0.6, 8, 8]} />
      <meshBasicMaterial
        color={isCritical ? "#ff3b30" : "#ff9500"}
        opacity={0.2}
        transparent={true}
        wireframe={false}
      />
    </mesh>
  );
};

/* =========================
   SENSOR POINT COMPONENT
========================= */
const SensorPoint = ({ position, sensorData, sensorType, onSensorClick }) => {
  const meshRef = useRef();
  
  const getStatus = () => {
    const { value, threshold } = sensorData;
    if (value > threshold) return { color: "#ff3b30", status: "critical", label: "🔴" };
    if (value > threshold * 0.7) return { color: "#ff9500", status: "warning", label: "🟡" };
    return { color: "#34c759", status: "normal", label: "🟢" };
  };

  const { color, status, label } = getStatus();
  const isCritical = status === "critical";
  const isWarning = status === "warning";

  useFrame(({ clock }) => {
    if (meshRef.current && (isCritical || isWarning)) {
      const time = clock.getElapsedTime();
      const pulseFactor = isCritical ? 6 : 3;
      const pulseAmount = isCritical ? 0.15 : 0.1;
      
      meshRef.current.scale.set(
        1 + Math.sin(time * pulseFactor) * pulseAmount,
        1 + Math.sin(time * pulseFactor) * pulseAmount,
        1 + Math.sin(time * pulseFactor) * pulseAmount
      );
    }
  });

  const handleClick = () => {
    onSensorClick({ ...sensorData, sensorType, position, status });
  };

  return (
    <group>
      {(isCritical || isWarning) && (
        <WarningHalo position={position} isWarning={isWarning} isCritical={isCritical} />
      )}

      <mesh
        ref={meshRef}
        position={position}
        onClick={handleClick}
      >
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isCritical ? 1 : isWarning ? 0.8 : 0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  );
};

/* =========================
   TUNNEL RING SEGMENT
========================= */
const TunnelRing = ({ position, index, isHighlighted, crackIntensity }) => {
  const ringRef = useRef();
  
  // Color changes based on condition
  const ringColor = isHighlighted 
    ? "#ff3b30" 
    : crackIntensity > 0.5 
    ? "#64748b" 
    : "#475569";

  return (
    <group position={position}>
      {/* Main ring - outer */}
      <mesh>
        <torusGeometry args={[4, 0.5, 8, 24]} />
        <meshStandardMaterial 
          color={ringColor} 
          metalness={0.6} 
          roughness={0.4}
        />
      </mesh>
      
      {/* Inner ring */}
      <mesh>
        <torusGeometry args={[3.5, 0.3, 8, 24]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.3} 
          roughness={0.8}
        />
      </mesh>

      {/* Segment lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={i} rotation={[0, (i * Math.PI) / 4, 0]}>
          <boxGeometry args={[0.1, 0.5, 0.3]} />
          <meshStandardMaterial color="#64748b" metalness={0.5} />
        </mesh>
      ))}

      {/* Crack visualization */}
      {crackIntensity > 0 && (
        <mesh position={[0, 0.3, 3.8]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.1, crackIntensity * 0.5, 0.05]} />
          <meshStandardMaterial color="#0f172a" />
        </mesh>
      )}
    </group>
  );
};

/* =========================
   TUNNEL STRUCTURE
========================= */
const TunnelStructure = ({ 
  riskScore = 0, 
  waterPressure, 
  humidity, 
  crack, 
  structuralStrain, 
  onSensorClick 
}) => {
  const tunnelRef = useRef();
  const segments = 8;
  const spacing = 3;

  // Determine tunnel color based on water pressure
  const waterPressureRatio = waterPressure / 100;
  const tunnelColor = waterPressureRatio > 0.7 
    ? "#1e3a5f"  // Dark blue when high pressure
    : waterPressureRatio > 0.4 
    ? "#334155"  // Slightly darker
    : "#475569"; // Normal

  // Calculate crack intensity
  const crackIntensity = Math.min(crack / 10, 1);
  
  // Calculate strain highlight
  const strainRatio = structuralStrain / 1000;
  const highlightedSegments = Math.floor(strainRatio * segments);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (tunnelRef.current) {
      // Subtle breathing effect based on strain
      tunnelRef.current.scale.x = 1 + Math.sin(time * 2) * (strainRatio * 0.02);
      tunnelRef.current.scale.y = 1 + Math.sin(time * 2) * (strainRatio * 0.02);
    }
  });

  // Fog effect based on humidity
  const fogOpacity = (humidity - 30) / 70 * 0.3;

  return (
    <group ref={tunnelRef}>
      {/* Tunnel rings */}
      {Array.from({ length: segments }).map((_, i) => (
        <TunnelRing
          key={i}
          position={[0, 0, -((segments - 1) * spacing) / 2 + i * spacing]}
          index={i}
          isHighlighted={i < highlightedSegments && strainRatio > 0.5}
          crackIntensity={crackIntensity}
        />
      ))}

      {/* Ground/Track */}
      <mesh position={[0, -3.5, 0]}>
        <boxGeometry args={[3, 0.3, segments * spacing]} />
        <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Rails */}
      <mesh position={[-1.2, -3.2, 0]}>
        <boxGeometry args={[0.1, 0.2, segments * spacing]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[1.2, -3.2, 0]}>
        <boxGeometry args={[0.1, 0.2, segments * spacing]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Internal lighting */}
      {Array.from({ length: segments }).map((_, i) => (
        <pointLight
          key={i}
          position={[0, 2, -((segments - 1) * spacing) / 2 + i * spacing]}
          intensity={0.5}
          distance={5}
          color="#fef3c7"
        />
      ))}

      {/* Fog plane (humidity visualization) */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
        <planeGeometry args={[8, 6]} />
        <meshBasicMaterial 
          color="#64748b" 
          transparent 
          opacity={fogOpacity}
          side={2}
        />
      </mesh>

      {/* SENSOR POINTS */}
      {/* Water Pressure Sensors */}
      <SensorPoint
        position={[4.5, 0, -8]}
        sensorData={{ value: waterPressure, threshold: 70, unit: "kPa" }}
        sensorType="Water Pressure"
        onSensorClick={onSensorClick}
      />
      <SensorPoint
        position={[4.5, 0, 8]}
        sensorData={{ value: waterPressure, threshold: 70, unit: "kPa" }}
        sensorType="Water Pressure"
        onSensorClick={onSensorClick}
      />

      {/* Humidity Sensors */}
      <SensorPoint
        position={[-4.5, 2, 0]}
        sensorData={{ value: humidity, threshold: 85, unit: "%" }}
        sensorType="Humidity"
        onSensorClick={onSensorClick}
      />

      {/* Crack Sensors */}
      <SensorPoint
        position={[0, 4, -5]}
        sensorData={{ value: crack, threshold: 10, unit: "mm" }}
        sensorType="Crack Width"
        onSensorClick={onSensorClick}
      />
      <SensorPoint
        position={[0, 4, 5]}
        sensorData={{ value: crack, threshold: 10, unit: "mm" }}
        sensorType="Crack Width"
        onSensorClick={onSensorClick}
      />

      {/* Structural Strain Sensors */}
      <SensorPoint
        position={[0, -2, 0]}
        sensorData={{ value: structuralStrain, threshold: 700, unit: "με" }}
        sensorType="Structural Strain"
        onSensorClick={onSensorClick}
      />
    </group>
  );
};

/* =========================
   FINAL MODEL EXPORT
========================= */
const TunnelModel = ({ riskScore, waterPressure, humidity, crack, structuralStrain, isRisk }) => {
  const [selectedSensor, setSelectedSensor] = useState(null);

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [18, 8, 18], fov: 50 }}
        style={{ background: "#0b1120" }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[15, 20, 10]} intensity={1} />
        <pointLight position={[0, 5, 0]} intensity={0.5} color="#fef3c7" />

        <gridHelper args={[100, 100, "#1e293b", "#1e293b"]} />

        <TunnelStructure
          riskScore={riskScore}
          waterPressure={waterPressure}
          humidity={humidity}
          crack={crack}
          structuralStrain={structuralStrain}
          onSensorClick={handleSensorClick}
        />

        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={40}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* Sensor Detail Panel */}
      {selectedSensor && (
        <div className={`absolute bottom-4 left-4 rounded-lg p-4 shadow-2xl max-w-xs border ${
          selectedSensor.status === 'critical' 
            ? 'bg-gradient-to-br from-red-950 to-red-900 border-red-500'
            : selectedSensor.status === 'warning'
            ? 'bg-gradient-to-br from-yellow-950 to-yellow-900 border-yellow-500'
            : 'bg-gradient-to-br from-slate-900 to-slate-800 border-blue-500'
        }`}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className={`text-xs font-semibold uppercase ${
                selectedSensor.status === 'critical' ? 'text-red-300' : 
                selectedSensor.status === 'warning' ? 'text-yellow-300' :
                'text-gray-400'
              }`}>
                {selectedSensor.status === 'critical' ? '⚠️ CRITICAL ALERT' : 
                 selectedSensor.status === 'warning' ? '⚡ WARNING STATUS' :
                 '✅ Sensor Data'}
              </p>
              <p className={`text-xl font-bold ${
                selectedSensor.status === 'critical' ? 'text-red-400' : 
                selectedSensor.status === 'warning' ? 'text-yellow-400' :
                'text-blue-400'
              }`}>{selectedSensor.sensorType}</p>
            </div>
            <button
              onClick={() => setSelectedSensor(null)}
              className={`text-lg font-bold ${
                selectedSensor.status === 'critical' ? 'text-red-300' : 
                selectedSensor.status === 'warning' ? 'text-yellow-300' :
                'text-gray-400'
              }`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div className={`rounded-lg p-3 border ${
              selectedSensor.status === 'critical' ? 'bg-red-900 border-red-400' :
              selectedSensor.status === 'warning' ? 'bg-yellow-900 border-yellow-400' :
              'bg-blue-900 border-blue-400'
            }`}>
              <p className="text-2xl font-bold">
                {selectedSensor.value.toFixed(1)}{selectedSensor.unit}
              </p>
              <div className="w-full bg-black bg-opacity-50 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    selectedSensor.status === 'critical' ? 'bg-red-500' : 
                    selectedSensor.status === 'warning' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((selectedSensor.value / selectedSensor.threshold) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-3 text-center">Click ✕ to close</p>
        </div>
      )}

      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-slate-900 bg-opacity-80 border border-blue-500 border-opacity-30 rounded-lg p-3 shadow-lg max-w-xs">
        <p className="text-xs text-gray-400 mb-2"><strong>🚇 Interactive Tunnel Model</strong></p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>🖱️ <strong>Click sensors</strong> to view details</li>
          <li>🔴 Red = Critical | 🟡 Orange = Warning | 🟢 Green = Normal</li>
          <li>🔍 <strong>Drag to rotate</strong> | <strong>Scroll to zoom</strong></li>
          <li>💧 Blue tint = High water pressure</li>
          <li>🌫️ Fog = High humidity level</li>
        </ul>
      </div>
    </div>
  );
};

export default TunnelModel;
