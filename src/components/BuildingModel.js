// ============================================================
// BUILDING 3D MODEL
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
        haloRef.current.rotation.z = time * 3;
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
      <sphereGeometry args={[0.8, 8, 8]} />
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
   BUILDING FLOOR
========================= */
const Floor = ({ position, width = 6, depth = 6 }) => {
  return (
    <mesh position={position}>
      <boxGeometry args={[width, 0.3, depth]} />
      <meshStandardMaterial color="#64748b" metalness={0.3} roughness={0.7} />
    </mesh>
  );
};

/* =========================
   BUILDING WINDOW
========================= */
const Window = ({ position, isCracked = false }) => {
  return (
    <mesh position={position}>
      <planeGeometry args={[0.8, 1.2]} />
      <meshStandardMaterial 
        color={isCracked ? "#1e293b" : "#7dd3fc"} 
        transparent 
        opacity={isCracked ? 0.3 : 0.7}
        emissive={isCracked ? "#0f172a" : "#38bdf8"}
        emissiveIntensity={isCracked ? 0.1 : 0.3}
      />
    </mesh>
  );
};

/* =========================
   BUILDING STRUCTURE
========================= */
const BuildingStructure = ({ 
  riskScore = 0, 
  tilt, 
  displacement, 
  crack, 
  vibration, 
  onSensorClick 
}) => {
  const buildingRef = useRef();
  const floors = 6;
  const floorHeight = 1.5;

  // Determine building color based on risk
  const buildingColor =
    riskScore > 75
      ? "#ff3b30"
      : riskScore > 50
      ? "#ff9500"
      : "#64748b";

  // Calculate tilt rotation (max 5 degrees)
  const tiltAngle = (tilt / 5) * (Math.PI / 36); // Max 5 degrees

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    if (buildingRef.current) {
      // Apply tilt and subtle vibration
      buildingRef.current.rotation.z = tiltAngle + Math.sin(time * 2) * (vibration / 1000);
      buildingRef.current.position.y = Math.sin(time * 3) * (riskScore / 500);
    }
  });

  const hasCracks = crack > 5;
  const crackIntensity = Math.min(crack / 12, 1);

  return (
    <group ref={buildingRef}>
      {/* Foundation */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[7, 1, 7]} />
        <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Floors */}
      {Array.from({ length: floors }).map((_, i) => (
        <group key={i}>
          {/* Floor plate */}
          <Floor 
            position={[0, i * floorHeight, 0]} 
            width={6 - i * 0.2}
            depth={6 - i * 0.2}
          />
          
          {/* Walls */}
          <mesh position={[0, i * floorHeight + floorHeight / 2, 0]}>
            <boxGeometry args={[6 - i * 0.2, floorHeight, 0.2]} />
            <meshStandardMaterial color={buildingColor} metalness={0.5} roughness={0.4} />
          </mesh>

          {/* Windows - Front */}
          <Window position={[-2, i * floorHeight + 0.75, 3.1 - i * 0.1]} isCracked={hasCracks && i > 2} />
          <Window position={[0, i * floorHeight + 0.75, 3.1 - i * 0.1]} isCracked={hasCracks && i > 3} />
          <Window position={[2, i * floorHeight + 0.75, 3.1 - i * 0.1]} isCracked={hasCracks && i > 2} />

          {/* Windows - Back */}
          <Window position={[-2, i * floorHeight + 0.75, -3.1 + i * 0.1]} isCracked={hasCracks && i > 2} />
          <Window position={[0, i * floorHeight + 0.75, -3.1 + i * 0.1]} isCracked={hasCracks && i > 3} />
          <Window position={[2, i * floorHeight + 0.75, -3.1 + i * 0.1]} isCracked={hasCracks && i > 2} />

          {/* Crack Lines (if damaged) */}
          {hasCracks && (
            <mesh position={[2.5, i * floorHeight + 1, 0]}>
              <boxGeometry args={[0.05, floorHeight * crackIntensity, 0.05]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          )}
        </group>
      ))}

      {/* Roof */}
      <mesh position={[0, floors * floorHeight + 0.3, 0]}>
        <boxGeometry args={[5, 0.6, 5]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* SENSOR POINTS */}
      {/* Tilt Sensors */}
      <SensorPoint
        position={[4, 1, 4]}
        sensorData={{ value: tilt, threshold: 3, unit: "°" }}
        sensorType="Building Tilt"
        onSensorClick={onSensorClick}
      />

      {/* Displacement Sensors */}
      <SensorPoint
        position={[-4, 3, 4]}
        sensorData={{ value: displacement, threshold: 35, unit: "mm" }}
        sensorType="Displacement"
        onSensorClick={onSensorClick}
      />

      {/* Crack Sensors */}
      <SensorPoint
        position={[0, 5, 3.2]}
        sensorData={{ value: crack, threshold: 12, unit: "mm" }}
        sensorType="Crack Width"
        onSensorClick={onSensorClick}
      />

      {/* Vibration Sensors */}
      <SensorPoint
        position={[0, 8, 0]}
        sensorData={{ value: vibration, threshold: 20, unit: "m/s²" }}
        sensorType="Vibration"
        onSensorClick={onSensorClick}
      />
    </group>
  );
};

/* =========================
   FINAL MODEL EXPORT
========================= */
const BuildingModel = ({ riskScore, tilt, displacement, crack, vibration, isRisk }) => {
  const [selectedSensor, setSelectedSensor] = useState(null);

  const handleSensorClick = (sensor) => {
    setSelectedSensor(sensor);
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [15, 12, 15], fov: 50 }}
        style={{ background: "#0b1120" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[15, 20, 10]} intensity={1.2} />

        <gridHelper args={[100, 100, "#1e293b", "#1e293b"]} />

        <BuildingStructure
          riskScore={riskScore}
          tilt={tilt}
          displacement={displacement}
          crack={crack}
          vibration={vibration}
          onSensorClick={handleSensorClick}
        />

        <OrbitControls
          enablePan={false}
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
        <p className="text-xs text-gray-400 mb-2"><strong>🏢 Interactive Building Model</strong></p>
        <ul className="text-xs text-gray-500 space-y-1">
          <li>🖱️ <strong>Click sensors</strong> to view details</li>
          <li>🔴 Red = Critical | 🟡 Orange = Warning | 🟢 Green = Normal</li>
          <li>🔍 <strong>Drag to rotate</strong> | <strong>Scroll to zoom</strong></li>
          <li>📐 Building tilts based on sensor data</li>
        </ul>
      </div>
    </div>
  );
};

export default BuildingModel;
