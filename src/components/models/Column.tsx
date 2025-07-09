import { useGLTF, Instance, Instances } from "@react-three/drei";
import { MeshList, ObjectList } from '@/components/data/ColumnList';
import { getModelsByTitles } from '@/components/data/ModelList';
import { toonMaterials } from '@/components/models/Materials';
import * as THREE from 'three';
import { MeshListItem, MeshTransformsByObject, MeshTransform } from '@/types/types';
import React, { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { zLength } from "../data/Config";


// Helper: preprocess mesh transforms for each object type
const preprocessMeshListByObject = (meshList: MeshListItem[]): MeshTransformsByObject => {
  const grouped: MeshTransformsByObject = {};
  meshList.forEach((info: MeshListItem) => {
    const objectName = info.Object.replace('SM_', '');
    const position: [number, number, number] = [
      info.Location[0] * 0.1,
      info.Location[2] * 0.1,
      -info.Location[1] * 0.1,
    ];
    const rotation: [number, number, number] = [
      info.Rotation[0],
      info.Rotation[2],
      info.Rotation[1],
    ];
    const scale: [number, number, number] = [
      info.Scale[0] * 0.1,
      info.Scale[2] * 0.1,
      info.Scale[1] * 0.1,
    ];
    if (!grouped[objectName]) grouped[objectName] = [];
    grouped[objectName].push({ position, rotation, scale });
  });
  return grouped;
};


function MeshInstances({ mesh, transforms }: { mesh: THREE.Mesh, transforms: MeshTransform[] }) {
  if (!mesh.geometry || !mesh.material) return null;
  const toonMaterial = toonMaterials.getToonMaterial_Column(mesh.material);
  const { camera } = useThree();
  const instanceRefs = React.useRef<(THREE.Object3D | null)[]>([]);

  useFrame(() => {
    for (let i = 0; i < transforms.length; i++) {
      const ref = instanceRefs.current[i];
      if (ref) {
        // Get current position
        const pos = transforms[i].position;
        // If behind camera, move forward
        if (pos[2] - camera.position.z > 2000) {
          pos[2] -= zLength;
        }
        // Update instance position directly
        ref.position.set(pos[0], pos[1], pos[2]);
      }
    }
  });

  return (
    <Instances
      geometry={mesh.geometry}
      material={toonMaterial}
      limit={1000}
      range={transforms.length}
      castShadow={true}
      receiveShadow={true}
    >
      {transforms.map((t: MeshTransform, idx: number) => (
        <Instance
          key={idx}
          ref={el => { instanceRefs.current[idx] = el as THREE.Object3D; }}
          position={t.position}
          rotation={t.rotation}
          scale={t.scale}
        />
      ))}
    </Instances>
  );
}

export const Column = () => {
  // Memoize transforms to avoid recalculation
  const meshTransformsByObject = useMemo(() => preprocessMeshListByObject(MeshList as MeshListItem[]), []);
  // Get all model info for objects in ObjectList
  const models = getModelsByTitles(ObjectList);
  // Load all GLTFs for the models
  const gltfs = models.map(model => useGLTF(model.url));
  // For each model, collect all meshes
  const meshesByModel: THREE.Mesh[][] = gltfs.map(gltf => {
    const result: THREE.Mesh[] = [];
    gltf.scene?.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        result.push(child as THREE.Mesh);
      }
    });
    return result;
  });
  return (
    <>
      {models.map((model, modelIdx) => (
        meshesByModel[modelIdx].map((mesh, meshIdx) => (
          <MeshInstances
            key={model.title + '-' + meshIdx}
            mesh={mesh}
            transforms={meshTransformsByObject[model.title] || []}
          />
        ))
      ))}
    </>
  );
};

export default Column; 