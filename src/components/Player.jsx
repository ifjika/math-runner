import React, { useRef, useEffect } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const Player = (props) => {
  const group = useRef();
  const { scene, animations } = useGLTF("/models/runner.glb");
  const { actions, names } = useAnimations(animations, group);
  const speedRef = useRef(1); // Target kecepatan animasi (0.6 = santai)

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
      // (1/60) = asumsi 60 FPS sebagai normal
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>
      <primitive object={scene} scale={0.01} />
    </group>
  );
};

useGLTF.preload("/models/runner.glb");

export default Player;
