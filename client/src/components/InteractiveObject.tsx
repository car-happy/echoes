import { useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useKeyboardControls } from "@react-three/drei";
import { usePlayer } from "../lib/stores/usePlayer";
import { useEchoes } from "../lib/stores/useEchoes";
import { useAudio } from "../lib/stores/useAudio";
import * as THREE from "three";

interface InteractiveObjectProps {
  position: [number, number, number];
  echoId: string;
  objectType: "chair" | "table" | "photograph" | "book";
  name: string;
}

enum Controls {
  interact = 'interact'
}

export default function InteractiveObject({ 
  position, 
  echoId, 
  objectType, 
  name 
}: InteractiveObjectProps) {
  const meshRef = useRef<THREE.Group>(null);
  const [isNear, setIsNear] = useState(false);
  const [isDiscovered, setIsDiscovered] = useState(false);
  const [glowIntensity, setGlowIntensity] = useState(0);
  
  const { position: playerPosition } = usePlayer();
  const { discoverEcho, echos } = useEchoes();
  const { playSuccess } = useAudio();
  const [subscribe] = useKeyboardControls<Controls>();

  // Check if echo is already discovered
  useEffect(() => {
    const discovered = echos.some(echo => echo.id === echoId);
    setIsDiscovered(discovered);
  }, [echos, echoId]);

  // Check distance to player
  useFrame((_, delta) => {
    const distance = Math.sqrt(
      Math.pow(playerPosition[0] - position[0], 2) +
      Math.pow(playerPosition[2] - position[2], 2)
    );
    
    const wasNear = isNear;
    const nowNear = distance < 2;
    setIsNear(nowNear);
    
    // Update glow effect
    if (nowNear && !isDiscovered) {
      setGlowIntensity(Math.min(1, glowIntensity + delta * 2));
    } else {
      setGlowIntensity(Math.max(0, glowIntensity - delta * 2));
    }
    
    // Auto-discover echo when getting close for the first time
    if (nowNear && !wasNear && !isDiscovered) {
      handleDiscoverEcho();
    }
  });

  // Handle interaction
  useEffect(() => {
    if (!isNear || isDiscovered) return;
    
    const unsubscribe = subscribe(
      (state) => state.interact,
      (pressed) => {
        if (pressed) {
          handleDiscoverEcho();
        }
      }
    );
    return unsubscribe;
  }, [isNear, isDiscovered, subscribe]);

  const handleDiscoverEcho = () => {
    if (isDiscovered) return;
    
    // Create echo data based on object type
    const echoData = getEchoData(echoId, objectType, name);
    discoverEcho(echoData);
    setIsDiscovered(true);
    playSuccess();
    
    console.log(`Discovered echo: ${name}`);
  };

  const getEchoData = (id: string, type: string, objectName: string) => {
    const echoDatabase = {
      chair_argument: {
        id,
        title: "Heated Argument",
        timestamp: 1,
        audioFile: "/sounds/hit.mp3", // Using available audio
        transcript: "I told you never to mention that name again! Some secrets should stay buried...",
        location: objectName,
        emotionalWeight: "anger"
      },
      table_secret: {
        id,
        title: "Whispered Secret",
        timestamp: 2,
        audioFile: "/sounds/success.mp3",
        transcript: "The key is hidden under the loose floorboard. But promise me you'll never use it unless...",
        location: objectName,
        emotionalWeight: "fear"
      },
      photo_memory: {
        id,
        title: "Loving Memory",
        timestamp: 3,
        audioFile: "/sounds/background.mp3",
        transcript: "This was the last photo we took together. I should have told her how much she meant to me...",
        location: objectName,
        emotionalWeight: "regret"
      },
      diary_confession: {
        id,
        title: "Final Confession",
        timestamp: 4,
        audioFile: "/sounds/hit.mp3",
        transcript: "I've carried this guilt for thirty years. The truth about what happened that night will die with me...",
        location: objectName,
        emotionalWeight: "guilt"
      }
    };
    
    return echoDatabase[id as keyof typeof echoDatabase] || {
      id,
      title: "Unknown Echo",
      timestamp: 0,
      audioFile: "/sounds/hit.mp3",
      transcript: "An echo from the past...",
      location: objectName,
      emotionalWeight: "mystery"
    };
  };

  const renderObject = () => {
    switch (objectType) {
      case "chair":
        return (
          <group>
            {/* Chair seat */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[0.8, 0.1, 0.8]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Chair back */}
            <mesh position={[0, 0.7, -0.35]} castShadow>
              <boxGeometry args={[0.8, 0.9, 0.1]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Chair legs */}
            {[[-0.3, -0.25, -0.3], [0.3, -0.25, -0.3], [-0.3, -0.25, 0.3], [0.3, -0.25, 0.3]].map((pos, i) => (
              <mesh key={i} position={pos} castShadow>
                <cylinderGeometry args={[0.05, 0.05, 0.5]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
            ))}
          </group>
        );
      
      case "table":
        return (
          <group>
            {/* Table top */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[2, 0.1, 1]} />
              <meshStandardMaterial color="#8b4513" />
            </mesh>
            {/* Table legs */}
            {[[-0.8, -0.1, -0.4], [0.8, -0.1, -0.4], [-0.8, -0.1, 0.4], [0.8, -0.1, 0.4]].map((pos, i) => (
              <mesh key={i} position={pos} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.8]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
            ))}
          </group>
        );
        
      case "photograph":
        return (
          <group>
            {/* Frame */}
            <mesh position={[0, 0, 0]} castShadow>
              <boxGeometry args={[0.6, 0.8, 0.05]} />
              <meshStandardMaterial color="#2d1810" />
            </mesh>
            {/* Photo */}
            <mesh position={[0, 0, 0.026]}>
              <planeGeometry args={[0.5, 0.7]} />
              <meshStandardMaterial color="#f0f0f0" />
            </mesh>
          </group>
        );
        
      case "book":
        return (
          <group>
            {/* Book cover */}
            <mesh position={[0, 0.05, 0]} castShadow>
              <boxGeometry args={[0.3, 0.1, 0.4]} />
              <meshStandardMaterial color="#4a0e0e" />
            </mesh>
            {/* Pages */}
            <mesh position={[0.01, 0.055, 0]}>
              <boxGeometry args={[0.28, 0.09, 0.38]} />
              <meshStandardMaterial color="#f5f5dc" />
            </mesh>
          </group>
        );
        
      default:
        return (
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#666" />
          </mesh>
        );
    }
  };

  return (
    <group ref={meshRef} position={position}>
      {renderObject()}
      
      {/* Glow effect for undiscovered echoes */}
      {!isDiscovered && glowIntensity > 0 && (
        <pointLight
          intensity={glowIntensity * 2}
          color="#8b5cf6"
          distance={3}
        />
      )}
      
      {/* Interaction prompt */}
      {isNear && !isDiscovered && (
        <Text
          position={[0, 2, 0]}
          fontSize={0.3}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
        >
          {`Press E to examine ${name}`}
        </Text>
      )}
      
      {/* Object name label */}
      {isNear && (
        <Text
          position={[0, 1.5, 0]}
          fontSize={0.2}
          color={isDiscovered ? "#22c55e" : "#fbbf24"}
          anchorX="center"
          anchorY="middle"
        >
          {name} {isDiscovered ? "✓" : ""}
        </Text>
      )}
    </group>
  );
}
