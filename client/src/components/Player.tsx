import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { usePlayer } from "../lib/stores/usePlayer";
import * as THREE from "three";

enum Controls {
  forward = 'forward',
  backward = 'backward', 
  left = 'left',
  right = 'right',
  interact = 'interact'
}

export default function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const { position, setPosition, velocity, setVelocity, rotation, setRotation } = usePlayer();
  const [subscribe, getState] = useKeyboardControls<Controls>();
  
  // Create a simple but detailed character using geometric shapes

  useFrame((_, delta) => {
    const controls = getState();
    const speed = 8;
    const dampening = 0.9;
    
    let newVelocity = [...velocity] as [number, number, number];
    let newRotation = [...rotation] as [number, number, number];
    
    // Apply movement based on keyboard controls
    if (controls.forward) {
      newVelocity[2] -= speed * delta;
    }
    if (controls.backward) {
      newVelocity[2] += speed * delta;
    }
    if (controls.left) {
      newVelocity[0] -= speed * delta;
      newRotation[1] = Math.PI / 2; // Face left
    }
    if (controls.right) {
      newVelocity[0] += speed * delta;
      newRotation[1] = -Math.PI / 2; // Face right
    }
    
    // Set forward/backward rotation
    if (controls.forward) {
      newRotation[1] = 0; // Face forward
    }
    if (controls.backward) {
      newRotation[1] = Math.PI; // Face backward
    }
    
    // Apply dampening to both keyboard and mobile input
    newVelocity[0] *= dampening;
    newVelocity[2] *= dampening;
    
    // Update position - expand city boundaries
    const newPosition: [number, number, number] = [
      position[0] + newVelocity[0],
      position[1],
      position[2] + newVelocity[2]
    ];
    
    // Expanded city boundaries
    newPosition[0] = Math.max(-50, Math.min(50, newPosition[0]));
    newPosition[2] = Math.max(-50, Math.min(50, newPosition[2]));
    
    setPosition(newPosition);
    setVelocity(newVelocity);
    setRotation(newRotation);
    
    // Update mesh position and rotation
    if (groupRef.current) {
      groupRef.current.position.set(...newPosition);
      groupRef.current.rotation.set(...newRotation);
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* Head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.25]} />
        <meshBasicMaterial color="#ffdbac" />
      </mesh>
      
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshBasicMaterial color="#4169e1" />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.45, 1.2, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshBasicMaterial color="#ffdbac" />
      </mesh>
      <mesh position={[0.45, 1.2, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshBasicMaterial color="#ffdbac" />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.2, 0.2, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshBasicMaterial color="#2c2c54" />
      </mesh>
      <mesh position={[0.2, 0.2, 0]}>
        <boxGeometry args={[0.25, 0.8, 0.25]} />
        <meshBasicMaterial color="#2c2c54" />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 1.85, 0]}>
        <boxGeometry args={[0.35, 0.2, 0.35]} />
        <meshBasicMaterial color="#8b4513" />
      </mesh>
      
      {/* Invisible collision box */}
      <mesh position={[0, 1, 0]} visible={false}>
        <boxGeometry args={[1, 2, 1]} />
      </mesh>
    </group>
  );
}
