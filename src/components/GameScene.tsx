
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useHelper } from '@react-three/drei'
import { EffectComposer, Bloom, FXAA } from '@react-three/postprocessing'
import GradientBackground from './models/GradientBackground'
import BigCloud from './models/BigCloud'
import Road from './models/Road'
import Column from './models/Column'
import Cloud from './models/Cloud'
import PolarLight from './models/PolarLight'
import HashFog from './models/HashFog'

const _originalPos = new THREE.Vector3(10000, 0, 6000);
_originalPos.y = Math.sqrt(_originalPos.x * _originalPos.x + _originalPos.z * _originalPos.z) / 1.35;

const Scene = React.memo(() => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const { camera } = useThree();

  // Add helper for the directional light
  useHelper(lightRef as React.RefObject<THREE.Object3D>, THREE.DirectionalLightHelper, 200, 'hotpink');

  useEffect(() => {
    console.log('Scene rendered')
  }, [])

  useFrame(() => {
    if (lightRef.current && targetRef.current && camera) {
      const cameraCenter = camera.position;
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
        <FXAA />
        <Bloom intensity={0.6} luminanceThreshold={2.4} luminanceSmoothing={0.1} mipmapBlur={true} />
      </EffectComposer>

      <ambientLight color="#0f6eff" intensity={12} />
      <directionalLight
        ref={lightRef}
        color={0xff8822}
        intensity={150}
        position={_originalPos}
        castShadow={true}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-camera-left={-1000}
        shadow-camera-right={1000}
        shadow-camera-near={1}
        shadow-camera-far={50000}
        shadow-bias={-0.00005}
        target={targetRef.current}
      />
      <primitive object={targetRef.current} />
      <GradientBackground />
      <BigCloud />
      <Road />
      <Column />
      <Cloud />
      <PolarLight />
      <HashFog />
    </>
  );
})

export default Scene