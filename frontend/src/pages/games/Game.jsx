import React, { useEffect } from "react";

const Game = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "/snakescript.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <h1>Jeu du Serpent</h1>
      <canvas id="gameCanvas" width="400" height="400"></canvas>
      <p id="score">Score : 0</p>
    </div>
  );
};

export default Game;