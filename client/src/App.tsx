import { Canvas } from "@react-three/fiber";
import { KeyboardControls } from "@react-three/drei";
import { Suspense } from "react";
import Game from "./components/Game";
import GameUI from "./components/GameUI";
import Timeline from "./components/Timeline";
import MobileControls from "./components/MobileControls";
import "@fontsource/inter";

// Control scheme for the game
enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left', 
  right = 'right',
  interact = 'interact',
  toggleTimeline = 'toggleTimeline',
  toggleCamera = 'toggleCamera'
}

const keyMap = [
  { name: Controls.forward, keys: ['KeyW', 'ArrowUp'] },
  { name: Controls.backward, keys: ['KeyS', 'ArrowDown'] },
  { name: Controls.left, keys: ['KeyA', 'ArrowLeft'] },
  { name: Controls.right, keys: ['KeyD', 'ArrowRight'] },
  { name: Controls.interact, keys: ['KeyE', 'Space'] },
  { name: Controls.toggleTimeline, keys: ['KeyT', 'Tab'] },
  { name: Controls.toggleCamera, keys: ['KeyC'] }
];

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{
            position: [0, 3, 8],
            fov: 60,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            alpha: false
          }}
        >
          <color attach="background" args={["#1a1a2e"]} />
          
          <Suspense fallback={null}>
            <Game />
          </Suspense>
        </Canvas>
        
        <GameUI />
        <Timeline />
        <MobileControls />
      </KeyboardControls>
    </div>
  );
}

export default App;
