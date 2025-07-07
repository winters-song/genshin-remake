
import {  useEffect } from 'react'
import GradientBackground from '@/components/models/GradientBackground'
import { BigCloud } from '@/components/models/BigCloud'
import React from 'react'
import { Road } from './models/Road'
import Column from './models/Column'


const Scene = React.memo(() => {
  // Lighting setup (same as before)
  const x = 10000;
  const z = 6000;
  const y = Math.sqrt(x * x + z * z) / 1.35;

  useEffect(() => {
    console.log('Scene rendered')
  }, [])

  return (
    <>
      <ambientLight color="#0f6eff" intensity={6} />
      <directionalLight
        color={0xff6222}
        intensity={35}
        position={[x, y, z]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-top={400}
        shadow-camera-bottom={-100}
        shadow-camera-left={-100}
        shadow-camera-right={400}
        shadow-camera-near={1}
        shadow-camera-far={50000}
        shadow-bias={-0.00005}
      />
      <GradientBackground />
      <BigCloud />
      <Column />
      <Road />
    </>
  );
})

export default Scene