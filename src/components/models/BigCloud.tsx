import { useGLTF } from "@react-three/drei"
import { getModelByTitle } from "../data/ModelList"
import { useEffect } from "react"
import * as THREE from 'three'
import { useBigCloudMaterial, useBigCloudBGMaterial } from './Materials'

export const BigCloud = () => {
  const { scene } = useGLTF(getModelByTitle('BigCloud') || '')

  const M_BigCloud = useBigCloudMaterial()
  const M_BigCloudBG = useBigCloudBGMaterial()

  // Don't render until both materials are loaded
  if (!M_BigCloud || !M_BigCloudBG) return null

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.position.multiplyScalar(0.1)
          child.scale.multiplyScalar(0.1)

          child.renderOrder = -1
          if (child.name == "Plane011") {
            child.material = M_BigCloud;
          } else {
            child.material = M_BigCloudBG;
          }
        }
      })
    }
  }, [scene])

  return (
    <primitive object={scene} position={[0,0,0]} />
  )
}