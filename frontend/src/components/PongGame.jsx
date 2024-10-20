import React, { useEffect } from "react";

const PongGame = () => {
  useEffect(() => {
    // Charger les fichiers statiques de Pong
    const script = document.createElement("script");
    script.src = "/pong/pong.js"; // Chemin vers votre fichier JavaScript
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center artboard artboard-horizontal phone-4 bg-black w-20">
      <h1 className="text-4xl font-bold mb-8 text-secondary-content">Jeu de Pong</h1>
      <div id="home-page" className="home-container flex flex-col items-center">
        <h1 className="text-2xl font-semibold mb-4 text-secondary-content">Bienvenue dans le jeu Pong</h1>
        <div className="flex space-x-4">
          <button id="new-game-btn" className="btn btn-primary">Nouvelle Partie</button>
          <button id="resume-game-btn" className="btn btn-secondary" disabled>Reprendre la Partie</button>
          <button id="exit-game-btn" className="btn btn-error">Quitter</button>
        </div>
      </div>
      <div id="game-page" className="game-container hidden flex flex-col items-center mt-8">
        <canvas id="pong" width="600" height="300" className="border-2 border-gray-300 mb-4"></canvas>
        <button id="pause-game-btn" className="btn btn-warning">Pause</button>
      </div>
    </div>
  );
};

export default PongGame;
