import React from "react";

const Track = ({ z }) => {
  return (
    <mesh position={[0, -0.5, z]}>
      <boxGeometry args={[6, 0.5, 20]} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
};

export default Track;
