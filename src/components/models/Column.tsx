import { useMemo } from 'react';
import { useGLTF, Instance, Instances } from "@react-three/drei";
import { MeshList, ObjectList } from '@/components/data/ColumnList';
import { getModelsByTitles } from '@/components/data/ModelList';
import { toonMaterials } from '@/components/models/Materials';
import * as THREE from 'three';

// Types from GameScene
export type MeshTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};
export type MeshListItem = {
  Object: string;
  Location: number[];
  Rotation: number[];
  Scale: number[];
};
export type MeshTransformsByObject = {
  [objectName: string]: MeshTransform[];
};

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
        <Instance key={idx} position={t.position} rotation={t.rotation} scale={t.scale} />
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