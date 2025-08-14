import React from "react";

const Obstacle = ({ x, z }) => {
  return (
    <mesh position={[x, 0.5, z]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
};

export default Obstacle;
