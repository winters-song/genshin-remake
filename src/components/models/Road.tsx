import React, { useRef, useMemo, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Mesh, Vector3, Group } from "three";
import { getModelByTitle } from "../data/ModelList";
import { toonMaterials } from "./Materials";

interface RoadProps {
  extendNum?: number;
  speed?: number;
}

export function Road({ extendNum = 1, speed = 0.5 }: RoadProps) {
  const group = useRef<Group>(null);
  const { gl, camera } = useThree(); // 获取 renderer 和 camera
  const { scene } = useGLTF(getModelByTitle("Road") || "");
  const [shouldStop, setShouldStop] = useState(false)

  // Only run traverse once
  useEffect(() => {
    scene.traverse((mesh: any) => {
      if (mesh instanceof Mesh) {
        mesh.material = toonMaterials.getToonMaterial_Road(mesh.material, gl)
        // mesh.receiveShadow = true
      }
    })
  }, [scene, gl]);

  const roadUnits = useMemo(() => {
    const base = scene.clone(true) as Group;
    base.children.forEach((child) => {
      child.scale.multiplyScalar(0.1);
      child.position.multiplyScalar(0.1);
    });
    return base.children;
  }, [scene]);

  const zLength = 212.4027;
  const offset = useMemo(() => new Vector3(0, 34, 200), []);

  // Store refs to all road meshes and their positions
  const roadRefs = useRef<Array<Mesh | null>>([]);
  const originPositions = useRef<Array<Vector3>>([]);

  // Build all road segments and store refs
  const allRoads = useMemo<React.ReactNode[]>(() => {
    const roads: React.ReactNode[] = [];
    const n = roadUnits.length;
    roadRefs.current = [];
    originPositions.current = [];
    for (let i = 0; i < extendNum + 1; i++) {
      for (let j = 0; j < n; j++) {
        const child = roadUnits[j].clone() as Mesh;
        child.position.add(new Vector3(0, 0, -zLength * i));
        // Store original position
        originPositions.current.push(child.position.clone());
        // Key is important for React
        roads.push(
          <primitive
            object={child}
            key={`road-${i}-${j}`}
            castShadow
            receiveShadow
            ref={(ref: Mesh | null) => {
              roadRefs.current[i * n + j] = ref;
            }}
          />
        );
      }
    }
    return roads;
  }, [roadUnits, extendNum, zLength]);

  // Animate the road moving towards the camera
  useFrame((state, delta) => {
    if (shouldStop) return;
    const cameraZ = camera.position.z;
    for (let i = 0; i < roadRefs.current.length; i++) {
      const mesh = roadRefs.current[i];
      if (!mesh) continue;
      // Move forward
      mesh.position.z += speed;
      // If passed camera, wrap to back
      if (mesh.position.z > cameraZ) {
        mesh.position.z -= (zLength * (extendNum + 1));
      }
        // Optionally, you can also reset Y if you want a bounce effect
        mesh.position.y -= 70;
        mesh.position.y = originPositions.current[i].y; // or use a tween for smooth effect
    }
  });

  return (
    <group ref={group} position={[-offset.x, -offset.y, -offset.z]}>
      {allRoads}
    </group>
  );
}
