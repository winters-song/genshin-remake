import { useMemo, useRef } from 'react';
import { Instance, Instances } from "@react-three/drei";
import * as THREE from 'three';
import { MeshListItem, MeshTransform } from '@/types/types';
import { MeshList } from '../data/CloudList';
import { useCloudMaterial } from './Materials';
import { useFrame, useThree } from '@react-three/fiber';
import { zLength } from '../data/Config';


// Helper: preprocess mesh transforms for each object type
const preprocessMeshList = (meshList: MeshListItem[]): MeshTransform[] => {
  const list: MeshTransform[] = [];
  meshList.forEach((info: MeshListItem) => {
    const position: [number, number, number] = [
      info.Location[0] * 0.1,
      info.Location[2] * 0.1,
      -info.Location[1] * 0.1,
    ];
   
    list.push({ position, rotation: [0, 0, 0], scale: [1, 1, 1] });
  });
  return list;
};

const Cloud = () => {
  const { camera } = useThree();
  // Memoize transforms to avoid recalculation
  const meshTransforms = useMemo(() => preprocessMeshList(MeshList as MeshListItem[]), []);
  const instanceRefs = useRef<(THREE.Object3D | null)[]>([]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(3000, 1500), []);
  const material = useCloudMaterial();

  useFrame(() => {
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
        // Make the cloud face the camera's position
        ref.lookAt(camera.position);
      }
    }
  });
  return (
    <Instances
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
    </Instances>
  );
};

export default Cloud; 