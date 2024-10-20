document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const tiles = Array.from(document.getElementsByClassName("tile"));
    const scoreDisplay = document.getElementById("score");
    const highScoreDisplay = document.getElementById("highscore");
    const restartButton = document.getElementById("restart");
    const gameMessage = document.getElementById("game-message");
    const messageText = document.getElementById("message-text");
    const continueButton = document.getElementById("continue");
    const leaderboardTable = document.getElementById("leaderboard-table").getElementsByTagName("tbody")[0];
    
    let board = new Array(16).fill(0);
    let score = 0;
    let highScore = localStorage.getItem('highScore') || 0;
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];  // Récupère les meilleurs scores

    // Initialisation du jeu
    function initGame() {
        board.fill(0);
        score = 0;
        updateScore(0);
        updateHighScore();
        placeRandomTile();
        placeRandomTile();
        updateBoard();
        hideMessage();
        loadLeaderboard();  // Charge le leaderboard à chaque démarrage du jeu
    }

    restartButton.addEventListener("click", initGame);
    continueButton.addEventListener("click", hideMessage);

    document.addEventListener("keydown", handleKeyPress);

    function handleKeyPress(event) {
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
        }
        if (moved) {
            placeRandomTile();
            updateBoard();
            checkWinOrLose();
        }
    }

    function moveUp() {
        return move(0, 4);
    }

    function moveDown() {
        return move(12, -4);
    }

    function moveLeft() {
        return move(0, 1);
    }

    function moveRight() {
        return move(3, -1);
    }

    function move(start, step) {
        let moved = false;
        for (let i = 0; i < 4; i++) {
            let temp = [];
            for (let j = 0; j < 4; j++) {
                let index = start + i * (step === 1 || step === -1 ? 4 : 1) + j * step;
                temp.push(board[index]);
            }
            let newTemp = slide(temp);
            if (temp.toString() !== newTemp.toString()) {
                moved = true;
            }
            for (let j = 0; j < 4; j++) {
                let index = start + i * (step === 1 || step === -1 ? 4 : 1) + j * step;
                board[index] = newTemp[j];
            }
        }
        return moved;
    }

    function slide(row) {
        let arr = row.filter(val => val);
        for (let i = 0; i < arr.length - 1; i++) {
            if (arr[i] === arr[i + 1]) {
                arr[i] *= 2;
                updateScore(arr[i]);
                arr[i + 1] = 0;
            }
        }
        arr = arr.filter(val => val);
        while (arr.length < 4) {
            arr.push(0);
        }
        return arr;
    }

    function placeRandomTile() {
        let emptyTiles = board.map((val, idx) => (val === 0 ? idx : null)).filter(val => val !== null);
        if (emptyTiles.length === 0) return;
        let randomIndex = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
        board[randomIndex] = 2; // Nouvelle ligne, n'affiche que des 2
        updateBoard();
    }

    function updateBoard() {
        tiles.forEach((tile, index) => {
            const value = board[index];
            tile.textContent = value === 0 ? "" : value;
            tile.setAttribute("data-value", value);
        });
    }

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = score;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
            updateHighScore();
        }
    }

    function updateHighScore() {
        highScoreDisplay.textContent = highScore;
    }

    function checkWinOrLose() {
        if (board.includes(2048)) {
            showMessage("You Win!");
            saveScore(localStorage.getItem('playerName'), score);  // Sauvegarde le score après la victoire
        } else if (board.every(val => val !== 0) && !canMove()) {
            showMessage("Game Over!");
            saveScore(localStorage.getItem('playerName'), score);  // Sauvegarde le score après la défaite
        }
    }

    function canMove() {
        for (let i = 0; i < board.length; i++) {
            if (i % 4 !== 3 && board[i] === board[i + 1]) return true;
            if (i < 12 && board[i] === board[i + 4]) return true;
        }
        return false;
    }

    function showMessage(message) {
        messageText.textContent = message;
        gameMessage.classList.remove("hidden");
    }

    function hideMessage() {
        gameMessage.classList.add("hidden");
    }

    // Fonction pour sauvegarder le score et le pseudo dans localStorage
    function saveScore(playerName, score) {
        leaderboard.push({ playerName, score });
        leaderboard.sort((a, b) => b.score - a.score);  // Trie les scores par ordre décroissant
        leaderboard = leaderboard.slice(0, 5);  // Garde les 5 meilleurs scores
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));  // Sauvegarde dans localStorage
        loadLeaderboard();  // Recharge le leaderboard
    }

    // Fonction pour charger et afficher le leaderboard
    function loadLeaderboard() {
        leaderboardTable.innerHTML = "";  // Vide le tableau avant de le remplir à nouveau
        leaderboard.forEach(entry => {
            const row = leaderboardTable.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            cell1.textContent = entry.playerName;
            cell2.textContent = entry.score;
        });
    }

    initGame();  // Démarre le jeu immédiatement
});