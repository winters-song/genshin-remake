"use client"

import { Canvas } from '@react-three/fiber'
import { useRef, useEffect, useState, Suspense } from 'react'
import { Stats, useGLTF } from "@react-three/drei"
import { Preloader } from '@/components/Preloader/Preloader'
import { Menu } from '@/components/Menu/Menu'
import { Models } from '@/components/data/ModelList'
import * as THREE from 'three'
import React from 'react'
import Scene from '@/components/GameScene'


export default function Home() {
  const [userReady, setUserReady] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const audioRef = useRef<THREE.Audio | null>(null)
  const listenerRef = useRef<THREE.AudioListener | null>(null)

  // Function to handle canvas click and play audio
  const handleCanvasClick = () => {
    if (!audioStarted) {
      setAudioStarted(true)
      if (audioRef.current) {
        audioRef.current.play()
      }
    }
  }

  // Setup audio when ready and not already set up
  useEffect(() => {
    if (audioStarted && !audioRef.current) {
      const listener = new THREE.AudioListener()
      listenerRef.current = listener
      const audio = new THREE.Audio(listener)
      audioRef.current = audio

      const audioLoader = new THREE.AudioLoader()
      audioLoader.load('/Genshin/BGM.mp3', (buffer) => {
        audio.setBuffer(buffer)
        audio.setLoop(true)
        audio.setVolume(0.5)
        audio.play()
      })
    }
  }, [audioStarted])

  return (
    <>
      {!userReady && <Preloader onFinish={() => setUserReady(true)} />}
      <Menu />
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        camera={{
          position: [0, 0, 3],
          fov: 45,
          near: 0.1,
          far: 100000,
        }}
        frameloop="demand"
        gl={{ antialias: true }}
        onClick={handleCanvasClick}
        // onCreated={({ camera }) => {
          
        // }}
      >
        <Stats />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </>
  )
}

useGLTF.preload(Models.map((model) => model.url));


