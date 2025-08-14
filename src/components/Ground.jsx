import React from "react";

export default function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -50]}>
      <planeGeometry args={[20, 200]} />
      <meshStandardMaterial color="green" />
    </mesh>
  );
}
