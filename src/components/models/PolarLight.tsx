import { useMemo, useRef } from 'react';
import { Instance, Instances, useGLTF } from "@react-three/drei";
import * as THREE from 'three';
import { MeshListItem, MeshTransform } from '@/types/types';
import { MeshList } from '../data/PolarLightList';
import { usePolarLightMaterial } from './Materials';
import { useFrame, useThree } from '@react-three/fiber';
import { zLength } from '../data/Config';
import { getModelByTitle } from '../data/ModelList';


// Helper: preprocess mesh transforms for each object type
const preprocessMeshList = (meshList: MeshListItem[]): MeshTransform[] => {
  const list: MeshTransform[] = [];
  meshList.forEach((info: MeshListItem) => {
    const position: [number, number, number] = [
      info.Location[0] * 0.1,
      info.Location[2] * 0.1,
      -info.Location[1] * 0.1,
    ];
    const rotation: [number, number, number] = [
      info.Rotation[0],
      -info.Rotation[1],
      info.Rotation[2],
    ];
    list.push({ position, rotation, scale: [0.1, 0.1, 0.1] });
  });
  return list;
};

const PolarLight = () => {
  const { camera } = useThree();
  const { scene } = useGLTF(getModelByTitle('Light') || '')
  const geometry = useMemo(() => {
    let geometry = null;
    scene.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        geometry = child.geometry;
      }
    });
    return geometry;
  }, []);
  const material = usePolarLightMaterial();
  // Memoize transforms to avoid recalculation
  const meshTransforms = useMemo(() => preprocessMeshList(MeshList as MeshListItem[]), []);
  const instanceRefs = useRef<(THREE.Object3D | null)[]>([]);

  useFrame((_, dt) => {
    // Update the time uniform for animation
    if (material && material.uniforms && material.uniforms.time) {
      material.uniforms.time.value += dt;
    }
    for (let i = 0; i < meshTransforms.length; i++) {
      const ref = instanceRefs.current[i];
      if (ref) {
        // Get current position
        const pos = meshTransforms[i].position;
        // If behind camera, move forward
        if (pos[2] - camera.position.z > 0) {
          pos[2] -= zLength * 0.1;
        }
        // Update instance position directly
        ref.position.set(pos[0], pos[1], pos[2]);
      }
    }
  });
  return (
    <>{
      geometry && <Instances
        geometry={geometry}
        material={material}
        limit={1000}
        range={meshTransforms.length}
        castShadow={true}
        receiveShadow={true}
      >
        {meshTransforms.map((t: MeshTransform, idx: number) => (
          <Instance key={idx} position={t.position} rotation={t.rotation} scale={t.scale}
            ref={el => { instanceRefs.current[idx] = el as THREE.Object3D; }}
          />
        ))}
      </Instances>}
    </>
  );
};

export default PolarLight; 