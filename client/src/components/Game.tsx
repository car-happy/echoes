import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import Player from "./Player";
import Room from "./Room";
import InteractiveObject from "./InteractiveObject";
import { usePlayer } from "../lib/stores/usePlayer";
import * as THREE from "three";

enum Controls {
  toggleCamera = 'toggleCamera'
}

export default function Game() {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { position, cameraMode, setCameraMode, cameraRotation, setCameraRotation } = usePlayer();
  const [subscribe] = useKeyboardControls<Controls>();
  const { gl } = useThree();
  
  // Handle camera mode toggle
  useEffect(() => {
    const unsubscribe = subscribe(
      (state) => state.toggleCamera,
      (pressed) => {
        if (pressed) {
          setCameraMode(cameraMode === "first" ? "third" : "first");
          console.log(`Camera mode: ${cameraMode === "first" ? "third" : "first"}`);
        }
      }
    );
    return unsubscribe;
  }, [cameraMode, setCameraMode, subscribe]);

  // Handle mouse and touch controls for camera rotation
  useEffect(() => {
    let isPointerDown = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const handlePointerStart = (event: PointerEvent | MouseEvent) => {
      // For mouse: only right click, for touch: any touch
      if ((event as MouseEvent).button === 2 || event.type === 'touchstart' || event.type === 'pointerdown') {
        isPointerDown = true;
        const clientX = 'touches' in event ? (event as TouchEvent).touches[0].clientX : (event as PointerEvent).clientX;
        const clientY = 'touches' in event ? (event as TouchEvent).touches[0].clientY : (event as PointerEvent).clientY;
        lastPointerX = clientX;
        lastPointerY = clientY;
        gl.domElement.style.cursor = 'grabbing';
        event.preventDefault();
      }
    };

    const handlePointerEnd = (event: PointerEvent | MouseEvent) => {
      if ((event as MouseEvent).button === 2 || event.type === 'touchend' || event.type === 'pointerup') {
        isPointerDown = false;
        gl.domElement.style.cursor = 'default';
      }
    };

    const handlePointerMove = (event: PointerEvent | MouseEvent | TouchEvent) => {
      if (isPointerDown) {
        const clientX = 'touches' in event ? (event as TouchEvent).touches[0].clientX : (event as PointerEvent).clientX;
        const clientY = 'touches' in event ? (event as TouchEvent).touches[0].clientY : (event as PointerEvent).clientY;
        
        const deltaX = clientX - lastPointerX;
        const deltaY = clientY - lastPointerY;
        
        const sensitivity = 0.008;
        const newRotationX = cameraRotation[0] - deltaY * sensitivity;
        const newRotationY = cameraRotation[1] - deltaX * sensitivity;
        
        // Clamp vertical rotation to prevent over-rotation
        const clampedRotationX = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, newRotationX));
        
        setCameraRotation([clampedRotationX, newRotationY]);
        
        lastPointerX = clientX;
        lastPointerY = clientY;
        event.preventDefault();
      }
    };

    const handleContextMenu = (event: Event) => {
      event.preventDefault();
    };

    // Mouse events
    gl.domElement.addEventListener('mousedown', handlePointerStart);
    gl.domElement.addEventListener('mouseup', handlePointerEnd);
    gl.domElement.addEventListener('mousemove', handlePointerMove);
    gl.domElement.addEventListener('contextmenu', handleContextMenu);

    // Touch events for mobile
    gl.domElement.addEventListener('touchstart', handlePointerStart, { passive: false });
    gl.domElement.addEventListener('touchend', handlePointerEnd, { passive: false });
    gl.domElement.addEventListener('touchmove', handlePointerMove, { passive: false });

    return () => {
      gl.domElement.removeEventListener('mousedown', handlePointerStart);
      gl.domElement.removeEventListener('mouseup', handlePointerEnd);
      gl.domElement.removeEventListener('mousemove', handlePointerMove);
      gl.domElement.removeEventListener('contextmenu', handleContextMenu);
      gl.domElement.removeEventListener('touchstart', handlePointerStart);
      gl.domElement.removeEventListener('touchend', handlePointerEnd);
      gl.domElement.removeEventListener('touchmove', handlePointerMove);
    };
  }, [gl.domElement, cameraRotation, setCameraRotation]);

  // Camera positioning based on mode
  useFrame(() => {
    if (cameraRef.current) {
      if (cameraMode === "first") {
        // First person camera - at player eye level with rotation
        const eyeHeight = 1.6;
        const cameraPosition = new THREE.Vector3(
          position[0],
          position[1] + eyeHeight,
          position[2]
        );
        
        cameraRef.current.position.copy(cameraPosition);
        
        // Apply camera rotation for looking around
        const lookDirection = new THREE.Vector3(
          Math.sin(cameraRotation[1]) * Math.cos(cameraRotation[0]),
          Math.sin(cameraRotation[0]),
          Math.cos(cameraRotation[1]) * Math.cos(cameraRotation[0])
        );
        
        const lookAt = cameraPosition.clone().add(lookDirection);
        cameraRef.current.lookAt(lookAt);
      } else {
        // Third person camera - orbits around player with rotation
        const distance = 8;
        const baseHeight = 4;
        
        // Calculate camera position based on rotation
        const cameraX = position[0] + distance * Math.sin(cameraRotation[1]) * Math.cos(cameraRotation[0]);
        const cameraY = position[1] + baseHeight + distance * Math.sin(cameraRotation[0]);
        const cameraZ = position[2] + distance * Math.cos(cameraRotation[1]) * Math.cos(cameraRotation[0]);
        
        const targetPosition = new THREE.Vector3(cameraX, cameraY, cameraZ);
        
        cameraRef.current.position.lerp(targetPosition, 0.08);
        cameraRef.current.lookAt(position[0], position[1] + 1.5, position[2]);
      }
    }
  });

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault />
      
      {/* Simple lighting */}
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        color="#ffd89b"
      />
      
      <Room />
      <Player />
      
      {/* Interactive objects with echoes - placed around the city */}
      <InteractiveObject
        position={[-8, 0.5, -5]}
        echoId="chair_argument"
        objectType="chair"
        name="Park Bench"
      />
      
      <InteractiveObject
        position={[6, 1, -8]}
        echoId="table_secret"
        objectType="table"
        name="Cafe Table"
      />
      
      <InteractiveObject
        position={[0, 1.5, -12]}
        echoId="photo_memory"
        objectType="photograph"
        name="Memorial Plaque"
      />
      
      <InteractiveObject
        position={[-10, 0.5, 8]}
        echoId="diary_confession"
        objectType="book"
        name="Lost Journal"
      />
    </>
  );
}
