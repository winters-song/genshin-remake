import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { MeshList } from "../data/ColumnList";
import { zLength } from "../data/Config";

interface MeshInfo {
  Object: string;
  Location: number[];
  Rotation: number[];
  Scale: number[];
}

// Helper to group mesh data by Object
function groupByObject(list: MeshInfo[]): Map<string, MeshInfo[]> {
  const map = new Map<string, MeshInfo[]>();
  for (const item of list) {
    // if(item.Object !== "SM_ZhuZi01") continue;
    if (!map.has(item.Object)) {
      map.set(item.Object, []);
    }
    // Deep clone to avoid mutating original data
    map.get(item.Object)!.push({
      ...item,
      Location: item.Location.slice(),
      Rotation: item.Rotation.slice(),
      Scale: item.Scale.slice(),
    });
  }
  return map;
}

const columeInstanceMap = groupByObject(MeshList)
console.log(columeInstanceMap.keys());

const Columns = () => {
  // Group mesh data by Object name

  const gltfMap = useMemo(() => {
    let newGltfMap: { [key: string]: any } = {};
    for (const objectName of columeInstanceMap.keys()) {
      newGltfMap[objectName] = useGLTF(`/Genshin/Login/${objectName}.glb`);

      // newGltfMap[objectName].scene.traverse((child: THREE.Object3D) => {
      //   if (child instanceof THREE.Mesh) {
      //   }
      // })
    }
    return newGltfMap;
  }, [])

  // Refs for instanced meshes and their data
  const meshRefs = useRef<{ [key: string]: THREE.InstancedMesh | null }>({});
  const dataRefs = useRef<{ [key: string]: MeshInfo[] }>({});

  // Initialize dataRefs with deep clones
  useEffect(() => {
    for (const [objectName, list] of columeInstanceMap.entries()) {
      dataRefs.current[objectName] = list.map((item: MeshInfo) => ({
        ...item,
        Location: item.Location.slice(),
        Rotation: item.Rotation.slice(),
        Scale: item.Scale.slice(),
      }));
    }
  }, []);


  // Animation/update logic
  useFrame(() => {
    for (const [objectName, list] of Object.entries(dataRefs.current)) {
      const meshRef = meshRefs.current[objectName];
      if (!meshRef) continue;
      for (let j = 0; j < list.length; j++) {
        const info = list[j];
        if (-info.Location[1] * 0.1 > 2000) {
          info.Location[1] += zLength;
        }
        // Compose matrix
        const position = new THREE.Vector3(
          info.Location[0] * 0.1,
          info.Location[2] * 0.1,
          -info.Location[1] * 0.1
        );
        const euler = new THREE.Euler(
          info.Rotation[0],
          info.Rotation[2],
          info.Rotation[1]
        );
        const quaternion = new THREE.Quaternion().setFromEuler(euler);
        const scale = new THREE.Vector3(
          info.Scale[0] * 0.1,
          info.Scale[2] * 0.1,
          info.Scale[1] * 0.1
        );
        const matrix = new THREE.Matrix4().compose(position, quaternion, scale);
        meshRef.setMatrixAt(j, matrix);
      }
      meshRef.instanceMatrix.needsUpdate = true;
    }
  });

  // Render instanced meshes for each unique mesh type
  return (
    <>
      { [...columeInstanceMap.entries()].map(([objectName, list]) => {
        const gltf = gltfMap[objectName];
        let mesh: any = null;
        if (gltf && gltf.scene) {
          gltf.scene.traverse((child: THREE.Object3D) => {
            if (!mesh && child instanceof THREE.Mesh) mesh = child;
          });
        }
        if (mesh && mesh.geometry && mesh.material) {
          mesh.castShadow = true;
          console.log(mesh.material);
          return (
            <instancedMesh
              key={objectName}
              ref={ref => {
                meshRefs.current[objectName] = ref;
              }}
              args={[mesh.geometry, mesh.material, list.length]}
              castShadow
            />
          );
        }
        return null;
      })}
    </>
  );
}

export default Columns;