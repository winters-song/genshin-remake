import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { gsap } from 'gsap';

export type ForwardCameraHandle = {
  stop: (zOffset: number) => void;
  openDoor: () => void;
};

const SPEED = -88; // Z direction

const ForwardCamera = forwardRef<ForwardCameraHandle>((props, ref) => {
  const { camera } = useThree();
  const speed = useRef(new THREE.Vector3(0, 0, SPEED));
  const shouldStop = useRef(false);
  const zOffset = useRef(0);
  const cameraCenter = useRef(new THREE.Vector3(0, 0, 0));
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useImperativeHandle(ref, () => ({
    stop: (offset: number) => {
      shouldStop.current = true;
      zOffset.current = offset;
      if (tweenRef.current) tweenRef.current.kill();
      tweenRef.current = gsap.to(camera.position, {
        x: camera.position.x,
        y: camera.position.y,
        z: offset - 165,
        duration: 5,
        ease: 'power3.out',
      });
    },
    openDoor: () => {
      if (tweenRef.current) tweenRef.current.kill();
      tweenRef.current = gsap.to(camera.position, {
        x: camera.position.x,
        y: camera.position.y,
        z: zOffset.current - 400,
        duration: 0.6,
        ease: 'power3.in',
      });
    },
  }), [camera]);

  useFrame((_, delta) => {
    if (!shouldStop.current) {
      cameraCenter.current.add(speed.current.clone().multiplyScalar(delta));
      camera.position.copy(cameraCenter.current);
    }
  });

  return null; // This component only controls the camera
});

export default ForwardCamera; 