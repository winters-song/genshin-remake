
import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { EffectComposer, Bloom, FXAA, BrightnessContrast } from '@react-three/postprocessing'
import GradientBackground from './models/GradientBackground'
import BigCloud from './models/BigCloud'
import Road from './models/Road'
import Column from './models/Column'
import Cloud from './models/Cloud'
import PolarLight from './models/PolarLight'
import HashFog from './models/HashFog'
import Door from './models/Door'
import gsap from 'gsap';
import { useSelector } from 'react-redux'
import { RootState } from '@/store/gameStore'

const _originalPos = new THREE.Vector3(10000, 0, 6000);
_originalPos.y = Math.sqrt(_originalPos.x * _originalPos.x + _originalPos.z * _originalPos.z) / 1.35;

const Scene = React.memo(() => {
  const lightRef = useRef<THREE.DirectionalLight>(null);
  const targetRef = useRef<THREE.Object3D>(new THREE.Object3D());
  const shouldOpenDoor = useSelector((state: RootState) => state.game.shouldOpenDoor);

  const bloomPropsRef = useRef({ brightness: 0 });
  const [, setRerender] = React.useState(0); // dummy state to force rerender

  // Add helper for the directional light
  // useHelper(lightRef as React.RefObject<THREE.Object3D>, THREE.DirectionalLightHelper, 200, 'hotpink');

  useEffect(() => {
    console.log('Scene rendered')
  }, [])


  useEffect(() => {
    if (shouldOpenDoor) {
      gsap.to(bloomPropsRef.current, {
        brightness: 1,
        duration: 0.5,
        onUpdate: () => {
          setRerender(r => r + 1); // force rerender to update UI
          console.log(bloomPropsRef.current.brightness);
        },
        overwrite: true,
        ease: 'cubic.in', // typo fixed
      });
    }
  }, [shouldOpenDoor]);

  // useFrame(() => {
  //   if (lightRef.current && targetRef.current && camera) {
  //     const cameraCenter = camera.position;
  //     lightRef.current.position.copy(cameraCenter.clone().add(_originalPos));
  //     targetRef.current.position.copy(cameraCenter);
  //     lightRef.current.target.updateMatrixWorld();
  //   }
  // });

  return (
    <>
      {/* Add fog to the scene */}
      <fog attach="fog" args={[0x389af2, 5000, 10000]} />
      <EffectComposer>
        <FXAA />
        <Bloom intensity={0.6} luminanceThreshold={2} luminanceSmoothing={0.1} mipmapBlur={true} />
        <BrightnessContrast brightness={bloomPropsRef.current.brightness} contrast={0} />
      </EffectComposer>

      <ambientLight color="#0f6eff" intensity={18} />
      <directionalLight
        ref={lightRef}
        color={0xffcc66}
        intensity={35}
        position={_originalPos}
        castShadow={true}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-top={1000}
        shadow-camera-bottom={-1000}
        shadow-camera-left={-1000}
        shadow-camera-right={1000}
        shadow-camera-near={1}
        shadow-camera-far={20000}
        shadow-bias={-0.02}
        target={targetRef.current}
      />
      <primitive object={targetRef.current} />
      <GradientBackground />
      <BigCloud />
      <Road />
      <Door />
      <Column />
      <Cloud />
      <PolarLight />
      <HashFog />
    </>
  );
})

export default Scene