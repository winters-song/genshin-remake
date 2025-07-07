
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import GradientBackground from '@/components/models/GradientBackground'
import { BigCloud } from '@/components/models/BigCloud'
import React from 'react'
import { Road } from './models/Road'
import Column from './models/Column'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { useHelper } from '@react-three/drei'

const _originalPos = new THREE.Vector3(10000, 0, 6000);
_originalPos.y = Math.sqrt(_originalPos.x * _originalPos.x + _originalPos.z * _originalPos.z) / 1.35;

const Scene = React.memo(({ forwardCameraRef }: { forwardCameraRef: React.RefObject<{ getCameraCenter: () => THREE.Vector3 }> }) => {
  // Lighting setup (same as before)
  const x = _originalPos.x;
  const z = _originalPos.z;
  const y = _originalPos.y;

  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());

  // Add helper for the directional light
  useHelper(lightRef as React.RefObject<THREE.Object3D>, THREE.DirectionalLightHelper, 200, 'hotpink');

  useEffect(() => {
    console.log('Scene rendered')
  }, [])

  useFrame(() => {
    if (lightRef.current && targetRef.current && forwardCameraRef?.current?.getCameraCenter) {
      const cameraCenter = forwardCameraRef.current.getCameraCenter();
      lightRef.current.position.copy(cameraCenter.clone().add(_originalPos));
      targetRef.current.position.copy(cameraCenter);
      lightRef.current.target.updateMatrixWorld();
    }
  });

  return (
    <>
      {/* Add fog to the scene */}
      <fog attach="fog" args={[0x389af2, 5000, 10000]} />
      <EffectComposer>
        <Bloom intensity={0.6} luminanceThreshold={2} luminanceSmoothing={0.1} />
        <ambientLight color="#0f6eff" intensity={6} />
        <directionalLight
          ref={lightRef}
          color={0xff6222}
          intensity={135}
          position={[x, y, z]}
          castShadow={true}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-top={1000}
          shadow-camera-bottom={-1000}
          shadow-camera-left={-1000}
          shadow-camera-right={1000}
          shadow-camera-near={1}
          shadow-camera-far={50000}
          shadow-bias={-0.001}
          target={targetRef.current}
        />
        <primitive object={targetRef.current} />
        <GradientBackground />
        <BigCloud />
        <Column />
        <Road />
      </EffectComposer>
    </>
  );
})

export default Scene