import React, { useRef, useEffect, forwardRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import PlayerController from "./PlayerController";

const Player = forwardRef((props, ref) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/runner.glb");
  const { actions, names } = useAnimations(animations, group);
  const speedRef = useRef(1); // Target kecepatan animasi (0.6 = santai)

  // Sinkronisasi ref internal dengan ref dari parent
  useEffect(() => {
    if (ref) ref.current = group.current;
  }, [ref]);

  useEffect(() => {
    console.log("Animasi yang tersedia:", names);
    const action = actions["Run"] || actions[names[0]];
    if (action) {
      action.reset().fadeIn(0.2).play();
      action.timeScale = speedRef.current;
    }
  }, [actions, names]);

  // Sesuaikan animasi dengan delta time agar konsisten di semua device
  useFrame((_, delta) => {
    const action = actions["Run"] || actions[names[0]];
    if (action) {
      action.timeScale = speedRef.current * (delta / (1 / 60));
    }
  });

  return (
    <>
      <group ref={group} {...props} dispose={null}>
        <primitive object={scene} scale={0.01} />
      </group>
      <PlayerController playerRef={group} trackWidth={8} speed={5} />
    </>
  );
});

useGLTF.preload("/models/runner.glb");

export default Player;
