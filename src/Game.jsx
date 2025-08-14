import React, { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import Player from "./components/Player";

const CameraFocus = () => {
  const controlsRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    camera.lookAt(0, 1, 0);
  }, [camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      target={[0, 1, 0]}
      enablePan={false}
      enableDamping
      dampingFactor={0.05}
    />
  );
};

const Game = () => {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 50 }}
      style={{
        width: "100vw",
        height: "100vh",
        background: "#ffffff",
      }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <Player position={[0, 0, 0]} />

      <Environment preset="sunset" />
      <CameraFocus />
    </Canvas>
  );
};

export default Game;
