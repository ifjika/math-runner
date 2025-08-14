import { useState, useEffect } from "react";

const PlayerController = ({ playerRef, trackWidth = 8, speed = 5 }) => {
  const [direction, setDirection] = useState(0); // -1 kiri, 1 kanan, 0 diam

  // Klik mouse: kiri/kanan
  useEffect(() => {
    const handleClick = (event) => {
      const x = event.clientX;
      const width = window.innerWidth;
      setDirection(x < width / 2 ? -1 : 1);
    };

    const handleRelease = () => setDirection(0);

    window.addEventListener("mousedown", handleClick);
    window.addEventListener("mouseup", handleRelease);

    return () => {
      window.removeEventListener("mousedown", handleClick);
      window.removeEventListener("mouseup", handleRelease);
    };
  }, []);

  // Keyboard: A/D atau arrow left/right
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key.toLowerCase() === "a")
        setDirection(-1);
      if (e.key === "ArrowRight" || e.key.toLowerCase() === "d")
        setDirection(1);
    };
    const handleKeyUp = (e) => setDirection(0);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Update posisi player setiap frame
  useEffect(() => {
    let frameId;

    const animate = (time) => {
      if (playerRef.current) {
        let newX = playerRef.current.position.x + direction * speed * 0.016; // asumsi 60 FPS ~ delta 0.016
        const halfTrack = trackWidth / 2 - 0.5; // batas track ±3.5 jika trackWidth=8
        newX = Math.max(-halfTrack, Math.min(halfTrack, newX));
        playerRef.current.position.x = newX;
      }
      frameId = requestAnimationFrame(animate);
    };
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [direction, playerRef, speed, trackWidth]);

  return null; // komponen ini tidak render apa-apa
};

export default PlayerController;
