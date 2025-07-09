import React, { useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PointerLockControls } from '@react-three/drei';

const SPEED = -88; // Z direction

const ForwardCamera = () => {
  const { camera } = useThree();
  const speed = useRef(new THREE.Vector3(0, 0, SPEED));
  const shouldStop = useRef(false);
  const cameraCenter = useRef(new THREE.Vector3(0, 0, 0));
  const pointerLockControlsRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (!shouldStop.current) {
      cameraCenter.current.add(speed.current.clone().multiplyScalar(delta));
      camera.position.copy(cameraCenter.current);
    }
  });

  return <PointerLockControls ref={pointerLockControlsRef} />;
};

export default ForwardCamera; 