import { create } from "zustand";

interface PlayerState {
  position: [number, number, number];
  velocity: [number, number, number];
  rotation: [number, number, number];
  cameraMode: "first" | "third";
  cameraRotation: [number, number];
  
  // Actions
  setPosition: (position: [number, number, number]) => void;
  setVelocity: (velocity: [number, number, number]) => void;
  setRotation: (rotation: [number, number, number]) => void;
  setCameraMode: (mode: "first" | "third") => void;
  setCameraRotation: (rotation: [number, number]) => void;
}

export const usePlayer = create<PlayerState>((set) => ({
  position: [0, 1, 5],
  velocity: [0, 0, 0],
  rotation: [0, 0, 0],
  cameraMode: "third",
  cameraRotation: [0, 0],
  
  setPosition: (position) => set({ position }),
  setVelocity: (velocity) => set({ velocity }),
  setRotation: (rotation) => set({ rotation }),
  setCameraMode: (mode) => set({ cameraMode: mode }),
  setCameraRotation: (rotation) => set({ cameraRotation: rotation })
}));
