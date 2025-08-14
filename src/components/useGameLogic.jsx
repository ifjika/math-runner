import { useState, useEffect, useCallback } from "react";

export default function useGameLogic() {
  const lanes = [-2, 0, 2];
  const [playerLane, setPlayerLane] = useState(0);
  const [playerY, setPlayerY] = useState(0.5);
  const [obstacles, setObstacles] = useState([]);
  const [tracks, setTracks] = useState([-10, 10, 30, 50]);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(0.1);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setRunning(true);
    setGameOver(false);
    setScore(0);
    setSpeed(0.1);
  };

  const restartGame = () => {
    startGame();
    setPlayerLane(0);
    setObstacles([]);
  };

  const handleKeyPress = useCallback((e) => {
    if (e.key === "ArrowLeft") {
      setPlayerLane((prev) => lanes[Math.max(0, lanes.indexOf(prev) - 1)]);
    }
    if (e.key === "ArrowRight") {
      setPlayerLane(
        (prev) => lanes[Math.min(lanes.length - 1, lanes.indexOf(prev) + 1)]
      );
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      setScore((s) => s + 1);
      setObstacles((prev) =>
        prev
          .map((o) => ({ ...o, z: o.z + speed * 5 }))
          .filter((o) => o.z < 5)
          .concat(
            Math.random() < 0.1
              ? [{ x: lanes[Math.floor(Math.random() * lanes.length)], z: -20 }]
              : []
          )
      );
    }, 50);
    return () => clearInterval(interval);
  }, [running, speed]);

  return {
    playerLane,
    playerY,
    obstacles,
    tracks,
    score,
    speed,
    running,
    gameOver,
    startGame,
    restartGame,
    handleKeyPress,
  };
}
