import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";

const SPEED = 0.15; // kecepatan mundur
const WALL_SPACING = 40; // jarak antar wall
const WALL_POOL = 3; // jumlah wall per sisi
const WALL_RESPAWN_DELAY = 5000; // delay 5 detik setelah pecah
const INITIAL_WALL_Z = -20; // posisi awal tembok pertama jauh di depan

const Walls = ({ playerRef }) => {
  const leftWalls = useRef([]);
  const rightWalls = useRef([]);
  const [fragments, setFragments] = useState([]);
  const fragmentsRef = useRef([]);

  const playerZ = 0;

  // Spawn pecahan wall
  const spawnFragments = (pos, color) => {
    const newFragments = [];
    for (let i = 0; i < 5; i++) {
      newFragments.push({
        id: crypto.randomUUID(),
        position: [pos[0] + (Math.random() - 0.5) * 0.5, pos[1], pos[2]],
        velocity: [
          (Math.random() - 0.5) * 0.25,
          Math.random() * 0.25,
          (Math.random() - 0.5) * 0.25,
        ],
        color,
        lifetime: 60,
      });
    }
    fragmentsRef.current = [...fragmentsRef.current, ...newFragments];
    setFragments([...fragmentsRef.current]);
  };

  useFrame(() => {
    if (!playerRef?.current) return;
    const playerX = playerRef.current.position.x;
    const now = performance.now();

    const updateWalls = (walls, side) => {
      walls.forEach((wall) => {
        if (!wall) return;
        wall.position.z += SPEED;

        const playerOnSide = side === "left" ? playerX < 0 : playerX > 0;

        // Pecah wall
        if (
          !wall.userData.broken &&
          playerOnSide &&
          wall.position.z >= playerZ
        ) {
          spawnFragments(wall.position, side === "left" ? "red" : "blue");
          wall.userData.broken = true;
          wall.userData.brokenTime = now;
          wall.visible = false;
        }

        // Recycle wall setelah 5 detik
        if (
          wall.userData.broken &&
          now - wall.userData.brokenTime >= WALL_RESPAWN_DELAY
        ) {
          // Cari posisi wall paling depan
          const maxZ = Math.max(...walls.map((w) => w.position.z));
          wall.position.z = maxZ - WALL_SPACING;
          wall.userData.broken = false;
          wall.visible = true;
        }
      });
    };

    updateWalls(leftWalls.current, "left");
    updateWalls(rightWalls.current, "right");

    // Update pecahan
    const newFragments = fragmentsRef.current
      .map((frag) => ({
        ...frag,
        position: [
          frag.position[0] + frag.velocity[0],
          frag.position[1] + frag.velocity[1],
          frag.position[2] + frag.velocity[2],
        ],
        velocity: [
          frag.velocity[0] * 0.95,
          frag.velocity[1] - 0.01,
          frag.velocity[2] * 0.95,
        ],
        lifetime: frag.lifetime - 1,
      }))
      .filter((frag) => frag.lifetime > 0);

    fragmentsRef.current = newFragments;
    setFragments(newFragments);
  });

  return (
    <>
      {/* Wall kiri */}
      {[...Array(WALL_POOL)].map((_, i) => (
        <mesh
          key={`left-${i}`}
          ref={(el) => (leftWalls.current[i] = el)}
          position={[-2, 1.5, INITIAL_WALL_Z - i * WALL_SPACING]}
          userData={{ broken: false, brokenTime: 0 }}
        >
          <boxGeometry args={[4, 3, 1]} />
          <meshStandardMaterial color="red" />
        </mesh>
      ))}

      {/* Wall kanan */}
      {[...Array(WALL_POOL)].map((_, i) => (
        <mesh
          key={`right-${i}`}
          ref={(el) => (rightWalls.current[i] = el)}
          position={[2, 1.5, INITIAL_WALL_Z - i * WALL_SPACING]}
          userData={{ broken: false, brokenTime: 0 }}
        >
          <boxGeometry args={[4, 3, 1]} />
          <meshStandardMaterial color="blue" />
        </mesh>
      ))}

      {/* Pecahan wall */}
      {fragments.map((frag) => (
        <mesh key={frag.id} position={frag.position} scale={[0.3, 0.3, 0.3]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={frag.color} />
        </mesh>
      ))}
    </>
  );
};

export default Walls;
