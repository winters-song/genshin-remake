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
import ForwardCamera from '@/components/models/ForwardCamera'


export default function Home() {
  const [userReady, setUserReady] = useState(false)
  const [audioStarted, setAudioStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
      const audio = new window.Audio('/Genshin/BGM.mp3')
      audio.loop = true
      audio.volume = 0.5
      audioRef.current = audio
      audio.play()
    }
    // Pause audio if audioStarted is false
    if (!audioStarted && audioRef.current) {
      audioRef.current.pause()
    }
  }, [audioStarted])

  return (
    <>
      {!userReady && <Preloader onFinish={() => setUserReady(true)} />}
      <Menu />
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        camera={{
          position: [0, 0, 5],
          fov: 45,
          near: 1,
          far: 100000,
        }}
        gl={{ antialias: true }}
        onClick={handleCanvasClick}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
        }}
        // frameloop="demand"
        shadows={{
          enabled: true,
          type: THREE.PCFSoftShadowMap,
          autoUpdate: true,
        }}
      >
        <Stats />

        <ForwardCamera />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </>
  )
}

useGLTF.preload(Models.map((model) => model.url));


