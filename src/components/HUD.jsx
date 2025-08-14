import React from "react";

const HUD = ({ score, speed, running, gameOver, onStart, onRestart }) => {
  return (
    <div style={{ color: "white", fontFamily: "sans-serif" }}>
      <div style={{ position: "absolute", top: 10, left: 10 }}>
        <p>Score: {Math.floor(score)}</p>
        <p>Speed: {speed.toFixed(1)}</p>
      </div>

      {!running && !gameOver && (
        <div style={{ position: "absolute", top: "40%", left: "40%" }}>
          <button onClick={onStart}>Start Game</button>
        </div>
      )}

      {gameOver && (
        <div style={{ position: "absolute", top: "40%", left: "40%" }}>
          <p>Game Over</p>
          <button onClick={onRestart}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default HUD;
