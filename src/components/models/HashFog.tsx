import { useFrame, useThree } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import { useHashFogMaterial } from "./Materials";

const HashFog = () => {
  const ref = useRef<THREE.Mesh>(null);
  const material = useHashFogMaterial()
  const { camera } = useThree();
  useFrame((_, dt) => {
    if (material && material.uniforms && material.uniforms.time) {
      material.uniforms.time.value += dt;
    }
    if (ref.current) {
      ref.current.position.z = camera.position.z - 400
    }
  });

  return (
    <mesh ref={ref} material={material}>
      <planeGeometry args={[1000, 1000]} />
    </mesh>
  )
}

export default HashFog;