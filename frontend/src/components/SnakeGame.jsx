import React, { useEffect } from "react";

const SnakeGame = () => {
  useEffect(() => {
    // Charger les fichiers statiques Snake
    const script = document.createElement("script");
    script.src = "/snake/snakescript.js";  // Chemin vers votre fichier JavaScript
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-black">
      <h1 className="text-secondary-content">Jeu du Serpent</h1>
      <canvas id="gameCanvas"></canvas>
      <p className=" text-secondary-content" id="score">Score : 0</p>
      {/* Le CSS sera automatiquement appliqué si le fichier snake.css est dans /public/snake */}
    </div>
  );
};

export default SnakeGame;
