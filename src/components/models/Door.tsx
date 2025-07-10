import { useGLTF } from "@react-three/drei";
import { getModelByTitle } from "../data/ModelList";
import { useEffect, useRef } from "react";
import * as THREE from 'three';
import { useSelector, useDispatch } from "react-redux";
import { RootState, setDoorCreated, setShouldOpenDoor } from "@/store/gameStore";
import { useFrame } from "@react-three/fiber";
import { toonMaterials } from "./Materials";
import audioEffect from "../AudioEffect";
import { jumpUrl } from "../data/Config";

const DOOR_ANIMATION_END = 1.4583333333333333;

const Door = () => {
  const { scene, animations } = useGLTF(getModelByTitle("Door") || "");
  const { scene: doorLight } = useGLTF(getModelByTitle("WhitePlane") || "");
  const shouldStop  = useSelector((state: RootState) => state.game.shouldStop);
  const doorPosition = useSelector((state: RootState) => state.game.doorPosition);
  const doorCreated = useSelector((state: RootState) => state.game.doorCreated);
  // You may want to get shouldOpenDoor from Redux or props; for now, use a ref
  const shouldOpenDoor = useSelector((state: RootState) => state.game.shouldOpenDoor);
  const mixerList = useRef<THREE.AnimationMixer[]>([]);
  const doorHasCreate = useRef(false);
  const dispatch = useDispatch();

  const createBackground = () => {
    doorLight.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.color = new THREE.Color("#ffffff").multiplyScalar(3)
      }
    });
    doorLight.position.set(doorPosition[0], doorPosition[1], doorPosition[2]);
    console.log('Background created');
    doorHasCreate.current = true;
  };

  useEffect(() => {
    if (!scene) return;
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.material = toonMaterials.getToonMaterial_Door(child.material)
      }
    });
  }, [scene]);

  useEffect(() => {
    if (shouldStop && animations && scene) {
      audioEffect.play({ url: "/Genshin/Genshin Impact [DoorComeout].mp3", force: true });

      scene.position.set(doorPosition[0], doorPosition[1], doorPosition[2]);
      console.log('play animations');
      // Clear previous mixers
      mixerList.current = [];
      // Create mixer and play animations
      const mixer = new THREE.AnimationMixer(scene);
      for (let clip of animations) {
        const action = mixer.clipAction(clip);
        action.setLoop(THREE.LoopOnce, 1);
        action.clampWhenFinished = true;
        action.play();
      }
      mixerList.current.push(mixer);
      doorHasCreate.current = false; // Reset flag when (re)starting
    }
  }, [shouldStop, animations, scene, doorPosition]);

  useFrame((_, delta) => {
    for (let mix of mixerList.current) {
      // mix.time is the current time of the mixer
      // mix.timeScale is the speed multiplier
      // mix._actions[0]._clip.duration is the duration of the animation
      // We'll use the public API as much as possible
      const actions = (mix as any)._actions as THREE.AnimationAction[];
      const duration = actions && actions[0] && typeof actions[0].getClip === 'function' ? actions[0].getClip().duration : 0;
      const nextTime = mix.time + delta;
      if (nextTime > DOOR_ANIMATION_END) {
        if (!doorHasCreate.current) {
          dispatch(setDoorCreated(true));
          createBackground();
        }
        if (
          shouldOpenDoor &&
          mix.time + delta * 1.6 < mix.timeScale * duration
        ) {
          mix.update(delta * 1.6);
        } else {
          // Optionally, you could pause or stop the mixer here
        }
      } else {
        mix.update(delta);
      }
    }
  });

  const jump = () => {
    dispatch(setShouldOpenDoor(true));

    setTimeout(() => audioEffect.play({ url: "/Genshin/Genshin Impact [DoorThrough].mp3", force: true }), 150);
    setTimeout(() => {
      window.location.href = jumpUrl
    }, 1000);
  }

  useEffect(() => {
    if (doorCreated) {
      const handleMouseDown = () => {
        console.log('Door mousedown event triggered!');
        jump();
        window.removeEventListener('mousedown', handleMouseDown);
      };
      window.addEventListener('mousedown', handleMouseDown);
      // Clean up in case doorCreated changes or component unmounts
      return () => {
        window.removeEventListener('mousedown', handleMouseDown);
      };
    }
  }, [doorCreated]);

  return <>
    <primitive object={scene} scale={[0.1, 0.1, 0.04]} position={[0, 0, 0]} visible={shouldStop} />
    <primitive object={doorLight} scale={[0.1, 0.1, 0.1]} visible={shouldStop} />
  </>;
}

export default Door;