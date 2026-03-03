// ============================================================
// PARAMETRIC MODEL COMPONENT
// Procedural 3D model generation based on AI parameters
// No geometry modification - generates from scratch using primitives
// ============================================================

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

// ============================================================
// COLOR UTILITIES
// ============================================================
const getRiskColor = (riskScore) => {
  if (!riskScore || riskScore < 25) return '#34c759'; // Green
  if (riskScore < 50) return '#fbbf24'; // Yellow
  if (riskScore < 75) return '#f97316'; // Orange
  return '#ff3b30'; // Red
};

// ============================================================
// PROCEDURAL BUILDING GENERATOR
// ============================================================
const ParametricBuilding = ({ params = {}, riskScore = 0, showHighlights = true }) => {
  const groupRef = useRef();
  
  const {
    estimatedFloors = 8,
    estimatedHeight = 32,
    structuralStyle = 'rectangular',
    columnDensity = 0.15,
    windowPattern = 'grid',
    baseWidth = 20,
    baseDepth = 20,
  } = params;
;

  const floorHeight = estimatedHeight / estimatedFloors;
  const riskColor = getRiskColor(riskScore);
  const emissiveIntensity = riskScore > 50 ? (riskScore - 50) / 100 : 0;

  useFrame(({ clock }) => {
    if (groupRef.current && riskScore > 75) {
      // Subtle vibration for critical risk
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 4) * 0.05;
    }
  });

  // Generate window positions
  const windows = useMemo(() => {
    const result = [];
    const windowsPerRow = Math.floor(baseWidth / 3);
    const windowRows = Math.floor(estimatedFloors / 2);
    
    for (let floor = 0; floor < windowRows; floor++) {
      for (let w = 0; w < windowsPerRow; w++) {
        // Front
        result.push({
          position: [
            -baseWidth / 2 + 2 + w * 3,
            floor * floorHeight * 2 + floorHeight,
            baseDepth / 2 + 0.05,
          ],
        });
        // Back
        result.push({
          position: [
            -baseWidth / 2 + 2 + w * 3,
            floor * floorHeight * 2 + floorHeight,
            -baseDepth / 2 - 0.05,
          ],
        });
      }
    }
    return result;
  }, [baseWidth, baseDepth, estimatedFloors, floorHeight]);

  // Generate columns
  const columns = useMemo(() => {
    if (structuralStyle === 'industrial') return [];
    const result = [];
    const colSpacingX = baseWidth * (1 - columnDensity * 2) / 3;
    const colSpacingZ = baseDepth * (1 - columnDensity * 2) / 2;
    
    for (let x = 0; x < 4; x++) {
      for (let z = 0; z < 3; z++) {
        result.push({
          position: [
            -baseWidth / 2 + colSpacingX + x * colSpacingX,
            estimatedHeight / 2,
            -baseDepth / 2 + colSpacingZ + z * colSpacingZ,
          ],
        });
      }
    }
    return result;
  }, [baseWidth, baseDepth, columnDensity, estimatedHeight, structuralStyle]);

  return (
    <group ref={groupRef}>
      {/* Foundation */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[baseWidth + 2, 1, baseDepth + 2]} />
        <meshStandardMaterial color="#374151" />
      </mesh>

      {/* Main structure */}
      <mesh position={[0, estimatedHeight / 2, 0]}>
        <boxGeometry args={[baseWidth, estimatedHeight, baseDepth]} />
        <meshStandardMaterial
          color={showHighlights && riskScore > 50 ? riskColor : '#6b7280'}
          emissive={showHighlights && riskScore > 50 ? riskColor : '#000000'}
          emissiveIntensity={emissiveIntensity}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>

      {/* Windows */}
      {windows.map((win, i) => (
        <mesh key={i} position={win.position}>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial
            color="#1e3a5f"
            emissive="#60a5fa"
            emissiveIntensity={0.3}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      {/* Columns (for non-industrial) */}
      {columns.map((col, i) => (
        <mesh key={`col-${i}`} position={col.position}>
          <boxGeometry args={[0.5, estimatedHeight, 0.5]} />
          <meshStandardMaterial color="#4b5563" metalness={0.5} />
        </mesh>
      ))}

      {/* Roof */}
      <mesh position={[0, estimatedHeight + 0.3, 0]}>
        <boxGeometry args={[baseWidth + 1, 0.6, baseDepth + 1]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
    </group>
  );
};

// ============================================================
// PROCEDURAL BRIDGE GENERATOR
// ============================================================
const ParametricBridge = ({ params = {}, riskScore = 0, showHighlights = true }) => {
  const groupRef = useRef();
  
  const {
    bridgeType = 'beam',
    spanCount = 2,
    estimatedLength = 100,
    deckWidth = 12,
  } = params;

  const pillarSpacing = estimatedLength / (spanCount + 1);
  const riskColor = getRiskColor(riskScore);
  const emissiveIntensity = riskScore > 50 ? (riskScore - 50) / 100 : 0;

  useFrame(({ clock }) => {
    if (groupRef.current && riskScore > 75) {
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 4) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Deck */}
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[estimatedLength, 0.5, deckWidth]} />
        <meshStandardMaterial
          color={showHighlights && riskScore > 50 ? riskColor : '#4b5563'}
          emissive={showHighlights && riskScore > 50 ? riskColor : '#000000'}
          emissiveIntensity={emissiveIntensity}
          metalness={0.5}
        />
      </mesh>

      {/* Road surface */}
      <mesh position={[0, 2.3, 0]}>
        <boxGeometry args={[estimatedLength - 2, 0.1, deckWidth - 1]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>

      {/* Railings */}
      <mesh position={[0, 3, deckWidth / 2 + 0.2]}>
        <boxGeometry args={[estimatedLength, 0.3, 0.2]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>
      <mesh position={[0, 3, -deckWidth / 2 - 0.2]}>
        <boxGeometry args={[estimatedLength, 0.3, 0.2]} />
        <meshStandardMaterial color="#f97316" />
      </mesh>

      {/* Support pillars */}
      {Array.from({ length: spanCount }).map((_, i) => (
        <group key={i}>
          {/* Main pillar */}
          <mesh position={[-estimatedLength / 2 + pillarSpacing * (i + 1), 0, 0]}>
            <boxGeometry args={[1.5, 4, deckWidth * 0.6]} />
            <meshStandardMaterial
              color={showHighlights && riskScore > 75 ? riskColor : '#6b7280'}
              emissive={showHighlights && riskScore > 75 ? riskColor : '#000000'}
              emissiveIntensity={emissiveIntensity * 1.5}
            />
          </mesh>
          
          {/* Pillar base */}
          <mesh position={[-estimatedLength / 2 + pillarSpacing * (i + 1), -1, 0]}>
            <boxGeometry args={[3, 2, deckWidth]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
      ))}

      {/* Bridge type specific - arches for arch bridges */}
      {bridgeType === 'arch' && (
        <mesh position={[0, 5, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[estimatedLength / 3, 0.8, 8, 50, Math.PI]} />
          <meshStandardMaterial
            color={showHighlights && riskScore > 50 ? riskColor : '#6b7280'}
            emissive={showHighlights && riskScore > 50 ? riskColor : '#000000'}
            emissiveIntensity={emissiveIntensity}
          />
        </mesh>
      )}

      {/* Suspension cables for suspension bridges */}
      {bridgeType === 'suspension' && (
        <>
          {/* Main towers */}
          {[-estimatedLength / 3, estimatedLength / 3].map((x, i) => (
            <mesh key={i} position={[x, 6, 0]}>
              <boxGeometry args={[1, 12, 1]} />
              <meshStandardMaterial color="#4b5563" />
            </mesh>
          ))}
          
          {/* Cable */}
          <mesh position={[0, 8, 0]}>
            <cylinderGeometry args={[0.3, 0.3, estimatedLength * 0.8, 8]} />
            <meshStandardMaterial color="#374151" rotation={[0, 0, Math.PI / 2]} />
          </mesh>
        </>
      )}
    </group>
  );
};

// ============================================================
// PROCEDURAL TUNNEL GENERATOR
// ============================================================
const ParametricTunnel = ({ params = {}, riskScore = 0, showHighlights = true }) => {
  const groupRef = useRef();
  
  const {
    diameter = 8,
    segmentCount = 20,
    length = 500,
    lanes = 2,
  } = params;

  const segmentLength = length / segmentCount;
  const riskColor = getRiskColor(riskScore);
  const emissiveIntensity = riskScore > 50 ? (riskScore - 50) / 100 : 0;

  useFrame(({ clock }) => {
    if (groupRef.current && riskScore > 75) {
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 2) * 0.01;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 2]}>
      {/* Main tunnel cylinder */}
      <mesh>
        <cylinderGeometry args={[diameter, diameter, length, 32, segmentCount, true]} />
        <meshStandardMaterial
          color={showHighlights && riskScore > 50 ? riskColor : '#4b5563'}
          emissive={showHighlights && riskScore > 50 ? riskColor : '#000000'}
          emissiveIntensity={emissiveIntensity}
          side={2} // DoubleSide
        />
      </mesh>

      {/* Inner lining rings */}
      {Array.from({ length: Math.min(segmentCount, 15) }).map((_, i) => (
        <mesh key={i} position={[0, -length / 2 + segmentLength * (i + 1), 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[diameter - 0.2, 0.3, 8, 32]} />
          <meshStandardMaterial
            color={showHighlights && riskScore > 75 ? riskColor : '#6b7280'}
          />
        </mesh>
      ))}

      {/* Road surface inside */}
      <mesh>
        <cylinderGeometry args={[diameter - 1, diameter - 1, length, 16, segmentCount]} />
        <meshStandardMaterial color="#1f2937" side={1} />
      </mesh>

      {/* Lane markings */}
      {Array.from({ length: Math.floor(lanes) }).map((_, i) => (
        <mesh key={i} position={[0, 0, (i - (lanes - 1) / 2) * 3]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, length, 4]} />
          <meshStandardMaterial color="#fbbf24" />
        </mesh>
      ))}
    </group>
  );
};

// ============================================================
// MAIN PARAMETRIC MODEL COMPONENT
// ============================================================
const ParametricModel = ({ 
  assetType, 
  params = {}, 
  riskScore = 0,
  showHighlights = true,
  style = {} 
}) => {
  const renderModel = () => {
    switch (assetType) {
      case 'building':
        return (
          <ParametricBuilding 
            params={params} 
            riskScore={riskScore} 
            showHighlights={showHighlights}
          />
        );
      case 'bridge':
        return (
          <ParametricBridge 
            params={params} 
            riskScore={riskScore} 
            showHighlights={showHighlights}
          />
        );
      case 'tunnel':
        return (
          <ParametricTunnel 
            params={params} 
            riskScore={riskScore} 
            showHighlights={showHighlights}
          />
        );
      default:
        return (
          <mesh>
            <boxGeometry args={[5, 5, 5]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
        );
    }
  };

  return (
    <div style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [30, 20, 30], fov: 50 }}
        style={{ background: '#0b1120' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[15, 20, 10]} intensity={1.2} />
        
        <gridHelper args={[100, 50, '#1e293b', '#1e293b']} />
        
        {renderModel()}
        
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          minDistance={10}
          maxDistance={100}
          minPolarAngle={0}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ParametricModel;

