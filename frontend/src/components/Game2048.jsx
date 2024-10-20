import React, { useState, useEffect } from "react";
import "../assets/css/Game2048.css"; // Assurez-vous que le CSS est bien lié

const Game2048 = () => {
  const [board, setBoard] = useState(new Array(16).fill(0));
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0);
  const [message, setMessage] = useState("");
  const [showMessagePopup, setShowMessagePopup] = useState(false);
  const [leaderboard, setLeaderboard] = useState(JSON.parse(localStorage.getItem('leaderboard')) || []);

  useEffect(() => {
    initGame();
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const initGame = () => {
    const newBoard = new Array(16).fill(0);
    placeRandomTile(newBoard);
    placeRandomTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setShowMessagePopup(false);
    loadLeaderboard();
  };

  const handleKeyPress = (event) => {
    let moved = false;
    switch (event.key) {
      case "ArrowUp":
        moved = moveUp();
        break;
      case "ArrowDown":
        moved = moveDown();
        break;
      case "ArrowLeft":
        moved = moveLeft();
        break;
      case "ArrowRight":
        moved = moveRight();
        break;
      default:
        break;
    }
    if (moved) {
      placeRandomTile(board);
      console.log("Updated Board: ", board); // Vérification du tableau
      setBoard([...board]);
      checkWinOrLose();
    }
  };

  const moveUp = () => move(0, 4);
  const moveDown = () => move(12, -4);
  const moveLeft = () => move(0, 1);
  const moveRight = () => move(3, -1);

  const move = (start, step) => {
    let moved = false;
    const newBoard = [...board]; // Copie du tableau
    for (let i = 0; i < 4; i++) {
      let temp = [];
      for (let j = 0; j < 4; j++) {
        let index = start + i * (step === 1 || step === -1 ? 4 : 1) + j * step;
        temp.push(newBoard[index]);
      }
      let newTemp = slide(temp);
      if (temp.toString() !== newTemp.toString()) {
        moved = true;
      }
      for (let j = 0; j < 4; j++) {
        let index = start + i * (step === 1 || step === -1 ? 4 : 1) + j * step;
        newBoard[index] = newTemp[j];
      }
    }
    console.log("Move result: ", newBoard); // Vérification du tableau après mouvement
    setBoard(newBoard); // Mise à jour du tableau dans l'état
    return moved;
  };

  const slide = (row) => {
    let arr = row.filter(val => val); // Filtrer pour supprimer les zéros
    for (let i = 0; i < arr.length - 1; i++) {
      if (arr[i] === arr[i + 1]) {
        arr[i] *= 2;
        updateScore(arr[i]);
        arr[i + 1] = 0;
      }
    }
    arr = arr.filter(val => val); // Filtrer pour supprimer les zéros après fusion
    while (arr.length < 4) {
      arr.push(0); // Remplir les espaces vides avec des zéros
    }
    return arr;
  };

  const placeRandomTile = (newBoard) => {
    let emptyTiles = newBoard.map((val, idx) => (val === 0 ? idx : null)).filter(val => val !== null);
    if (emptyTiles.length === 0) return;
    let randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    newBoard[randomIndex] = 2; // Place une nouvelle tuile 2
  };

  const updateBoard = () => {
    return board.map((value, index) => (
      <div key={index} className="tile" data-value={value}>
        {value !== 0 ? value : ""} {/* N'affiche pas les zéros */}
      </div>
    ));
  };

  const updateScore = (points) => {
    const newScore = score + points;
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem('highScore', newScore);
    }
  };

  const checkWinOrLose = () => {
    if (board.includes(2048)) {
      displayMessage("You Win!");
      saveScore("Invité", score);
    } else if (board.every(val => val !== 0) && !canMove()) {
      displayMessage("Game Over!");
      saveScore("Invité", score);
    }
  };

  const canMove = () => {
    for (let i = 0; i < board.length; i++) {
      if (i % 4 !== 3 && board[i] === board[i + 1]) return true;
      if (i < 12 && board[i] === board[i + 4]) return true;
    }
    return false;
  };

  const displayMessage = (msg) => {
    setMessage(msg);
    setShowMessagePopup(true);
  };

  const saveScore = (playerName, score) => {
    let newLeaderboard = [...leaderboard, { playerName, score }];
    newLeaderboard.sort((a, b) => b.score - a.score);
    newLeaderboard = newLeaderboard.slice(0, 5); // Garder les 5 meilleurs scores
    setLeaderboard(newLeaderboard);
    localStorage.setItem('leaderboard', JSON.stringify(newLeaderboard));
  };

  const loadLeaderboard = () => {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];
    setLeaderboard(leaderboardData);
  };

  return (
    <div>
      <div id="header">
        <div>Joueur : Invité</div>
        <div>Score : {score}</div>
        <div>High Score : {highScore}</div>
        <button onClick={initGame}>Redémarrer</button>
      </div>

      <div id="game-container">
        <div id="game-board">
          {updateBoard()}
        </div>
      </div>

      {showMessagePopup && (
        <div id="game-message">
          <p>{message}</p>
          <button onClick={() => setShowMessagePopup(false)}>Continuer</button>
        </div>
      )}

      <div id="leaderboard">
        <h2>Meilleurs scores</h2>
        <table>
          <thead>
            <tr>
              <th>Joueur</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={index}>
                <td>{entry.playerName}</td>
                <td>{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Game2048;
