import { useMemo } from "react";

export default function Room() {
  // Generate building positions for city blocks
  const buildingPositions = useMemo(() => {
    const positions = [];
    for (let x = -25; x <= 25; x += 12) {
      for (let z = -25; z <= 25; z += 12) {
        // Skip center area for player spawn
        if (Math.abs(x) > 6 || Math.abs(z) > 6) {
          positions.push([
            x + (Math.random() - 0.5) * 2,
            0,
            z + (Math.random() - 0.5) * 2
          ]);
        }
      }
    }
    return positions;
  }, []);

  // Generate street lamp positions
  const lampPositions = useMemo(() => {
    const positions = [];
    for (let x = -20; x <= 20; x += 8) {
      for (let z = -20; z <= 20; z += 8) {
        positions.push([x, 0, z]);
      }
    }
    return positions;
  }, []);

  return (
    <group>
      {/* Ground - City Streets */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshBasicMaterial color="#444444" />
      </mesh>
      
      {/* Grass areas/parks */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[20, 0.01, 20]}>
        <planeGeometry args={[15, 15]} />
        <meshBasicMaterial color="#228b22" />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-20, 0.01, -20]}>
        <planeGeometry args={[15, 15]} />
        <meshBasicMaterial color="#228b22" />
      </mesh>
      
      {/* City Buildings - Simplified */}
      {buildingPositions.slice(0, 12).map((pos, index) => {
        const height = 6 + (index % 3) * 2;
        const width = 3 + (index % 2);
        const depth = 3 + (index % 2);
        const buildingColors = ['#666666', '#777777', '#555555'];
        const buildingColor = buildingColors[index % 3];
        
        return (
          <group key={`building-${index}`} position={pos}>
            {/* Main building */}
            <mesh position={[0, height / 2, 0]}>
              <boxGeometry args={[width, height, depth]} />
              <meshBasicMaterial color={buildingColor} />
            </mesh>
            
            {/* Simple windows */}
            <mesh
              position={[0, height / 2, depth / 2 + 0.01]}
            >
              <planeGeometry args={[width * 0.6, height * 0.6]} />
              <meshBasicMaterial color="#4169e1" />
            </mesh>
          </group>
        );
      })}
      
      {/* Street Lamps - Simplified */}
      {lampPositions.slice(0, 8).map((pos, index) => (
        <group key={`lamp-${index}`} position={pos}>
          {/* Lamp post */}
          <mesh position={[0, 3, 0]}>
            <cylinderGeometry args={[0.08, 0.12, 6]} />
            <meshBasicMaterial color="#333333" />
          </mesh>
          
          {/* Lamp head */}
          <mesh position={[0, 5.5, 0]}>
            <sphereGeometry args={[0.6]} />
            <meshBasicMaterial color="#ffd89b" />
          </mesh>
        </group>
      ))}
      
      {/* City road markings */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[1, 100]} />
        <meshBasicMaterial color="#ffeb3b" />
      </mesh>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[100, 1]} />
        <meshBasicMaterial color="#ffeb3b" />
      </mesh>
      
      {/* Sidewalks */}
      {[-4, 4].map((offset, index) => (
        <group key={`sidewalk-${index}`}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[offset, 0.02, 0]}>
            <planeGeometry args={[2, 100]} />
            <meshBasicMaterial color="#d3d3d3" />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, offset]}>
            <planeGeometry args={[100, 2]} />
            <meshBasicMaterial color="#d3d3d3" />
          </mesh>
        </group>
      ))}
    </group>
  );
}