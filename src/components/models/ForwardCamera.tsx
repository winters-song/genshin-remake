import React, { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PointerLockControls } from '@react-three/drei';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/gameStore';
import gsap from "gsap";

const SPEED = -88; // Z direction

const ForwardCamera = () => {
  const { camera } = useThree();
  const speed = new THREE.Vector3(0, 0, SPEED);
  const shouldStop = useSelector((state: RootState) => state.game.shouldStop);
  const doorPosition = useSelector((state: RootState) => state.game.doorPosition);
  const shouldOpenDoor = useSelector((state: RootState) => state.game.shouldOpenDoor);
  const cameraCenter = useRef(new THREE.Vector3(0, 0, 0));
  const pointerLockControlsRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (!shouldStop) {
      cameraCenter.current.add(speed.clone().multiplyScalar(delta));
      camera.position.copy(cameraCenter.current);
    } 
  });

  useEffect(() => {
    if (shouldStop) {
      gsap.to(camera.position, {
        z: doorPosition[2] + 250,
        duration: 5,
        ease: "cubic.out",
      });
    }
  }, [shouldStop]);

  useEffect(() => {
    if (shouldOpenDoor) {
      gsap.killTweensOf(camera.position); // Kill all tweens on camera.position
      gsap.to(camera.position, {
        z: doorPosition[2] - 150,
        duration: 0.6,
        ease: "cubic.in",
      });
    }
  }, [shouldOpenDoor]);

  return <PointerLockControls ref={pointerLockControlsRef} />;
};

export default ForwardCamera; 