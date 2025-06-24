import * as THREE from "three";

// Utility functions for Three.js operations
export const createBoxCollider = (
  position: [number, number, number], 
  size: [number, number, number]
) => {
  return new THREE.Box3(
    new THREE.Vector3(
      position[0] - size[0]/2,
      position[1] - size[1]/2,
      position[2] - size[2]/2
    ),
    new THREE.Vector3(
      position[0] + size[0]/2,
      position[1] + size[1]/2,
      position[2] + size[2]/2
    )
  );
};

export const checkCollision = (
  pos1: [number, number, number], 
  size1: [number, number, number],
  pos2: [number, number, number], 
  size2: [number, number, number]
): boolean => {
  const box1 = createBoxCollider(pos1, size1);
  const box2 = createBoxCollider(pos2, size2);
  return box1.intersectsBox(box2);
};

export const calculateDistance = (
  pos1: [number, number, number], 
  pos2: [number, number, number]
): number => {
  return Math.sqrt(
    Math.pow(pos1[0] - pos2[0], 2) +
    Math.pow(pos1[1] - pos2[1], 2) +
    Math.pow(pos1[2] - pos2[2], 2)
  );
};

export const normalizeVector = (vector: [number, number, number]): [number, number, number] => {
  const magnitude = Math.sqrt(vector[0] ** 2 + vector[1] ** 2 + vector[2] ** 2);
  if (magnitude === 0) return [0, 0, 0];
  return [vector[0] / magnitude, vector[1] / magnitude, vector[2] / magnitude];
};

export const lerpVector = (
  start: [number, number, number], 
  end: [number, number, number], 
  factor: number
): [number, number, number] => {
  return [
    start[0] + (end[0] - start[0]) * factor,
    start[1] + (end[1] - start[1]) * factor,
    start[2] + (end[2] - start[2]) * factor
  ];
};
