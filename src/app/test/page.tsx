"use client"

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stats, useGLTF } from "@react-three/drei"
import * as THREE from 'three'
import React, { Suspense, useEffect, useRef } from 'react'
import GradientBackground from '@/components/models/GradientBackground'
import { patch } from '@/shader/chunk/patch.chunk'
import { default as lights_fragment_beginToon } from '@/shader/chunk/lights_fragment_beginToon'
import { RE_Direct_ToonPhysical } from '@/shader/chunk/RE_Direct_ToonPhysical.chunk'
// import { default as lights_fragment_begin } from '@/shader/vendor/lights_fragment_begin.glsl'


const Scene = () => {
  // const { scene } = useGLTF('/Genshin/Login/SM_ZhuZi01.glb')
  const { scene } = useGLTF('/glb/bake.glb')

  // const materialRef = useRef<THREE.MeshStandardMaterial>(null)

  const initMaterial = (material: THREE.MeshStandardMaterial) => {
    material.onBeforeCompile = function (shader: any) {
      let fragment = shader.fragmentShader

      fragment = fragment.replace("#include <lights_physical_pars_fragment>", `

          #include <lights_physical_pars_fragment>
          //vec3 fresnelCol = vec3(254., 103., 57.)/255.;
          vec3 fresnelCol = vec3(0.)/255.;

          ${patch}
          ${RE_Direct_ToonPhysical}
          `)

      console.log(fragment)

      // fragment = fragment.replace("#include <lights_fragment_begin>", `
      //       ${lights_fragment_begin}
      //       `)
      fragment = fragment.replace("#include <lights_fragment_begin>", `
          ${lights_fragment_beginToon}
          `)

      shader.fragmentShader = fragment;
    }
  }
  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          // child.castShadow = true
          // child.receiveShadow = true

          let material = child.material
          // If the material is an array, handle each one
          if (!Array.isArray(material)) {
            if (!(material instanceof THREE.MeshStandardMaterial)) {
              const stdMat = new THREE.MeshStandardMaterial()
              // stdMat.copy(material)
              if (material.map) stdMat.map = material.map
              if (material.color) stdMat.color.copy(material.color)
              child.material = stdMat
              material = stdMat
              initMaterial(child.material)
            }
          }
        }
      })
    }
  }, [scene])

  return <primitive object={scene} />
}

export default function Home() {
  



  return (
    <Canvas
      style={{ width: '100vw', height: '100vh' }}
      camera={{
        position: [-5, 5, 5],
        fov: 45,
        near: 1,
        far: 100,
      }}
      gl={{ antialias: true }}

      frameloop="demand"
      // shadows={{
      //   enabled: true,
      //   type: THREE.PCFShadowMap,
      // }}
    >
      <Stats />
      <OrbitControls />
      <directionalLight position={[10, 10, 10]} intensity={2} castShadow />
      
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
      {/* <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="gray" />
      </mesh> */}
      <GradientBackground />
    </Canvas>
  )
}

