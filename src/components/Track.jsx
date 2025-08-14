"use client";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CanvasTexture } from "three";

const Track = () => {
  const texture = useMemo(() => {
    const width = 256;
    const height = 256;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    // Warna dasar lintasan
    ctx.fillStyle = "#555";
    ctx.fillRect(0, 0, width, height);

    // Garis putus-putus di tengah
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 10;
    for (let y = 0; y < height; y += 100) {
      ctx.beginPath();
      ctx.moveTo(width / 2, y);
      ctx.lineTo(width / 2, y + 50);
      ctx.stroke();
    }

    const tex = new CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(1, 20); // 1 lebar, 20 panjang
    return tex;
  }, []);

  useFrame((state, delta) => {
    texture.offset.y += delta * 2; // kecepatan scroll
    if (texture.offset.y <= -1) texture.offset.y = 0; // reset offset
  });

  return (
    <mesh position={[0, -0.05, 0]} receiveShadow>
      <boxGeometry args={[8, 0.1, 70]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
};

export default Track;
