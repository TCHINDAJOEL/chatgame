const canvas = document.getElementById("pong");
const ctx = canvas.getContext("2d");
const maxSpeed = 10;
const winningScore = 5; // Score nécessaire pour gagner
const newGameBtn = document.getElementById("new-game-btn");
const resumeGameBtn = document.getElementById("resume-game-btn");
const exitGameBtn = document.getElementById("exit-game-btn");
const pauseGameBtn = document.getElementById("pause-game-btn");
const homePage = document.getElementById("home-page");
const gamePage = document.getElementById("game-page");

let paddleWidth = 10;
let paddleHeight = 100;
let ballSize = 10;
let playerScore = 0;
let aiScore = 0;
let gamePaused = false; // Ajout d'un indicateur de pause
let gameStarted = false; // Indicateur pour savoir si une partie a commencé
let gameOver = false; // Indicateur de fin de jeu

let playerPaddle = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
};

let aiPaddle = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
};

let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballSize,
    speedX: 5,
    speedY: 5,
};

// Écouteur d'événement pour recommencer le jeu
document.addEventListener("keydown", (event) => {
    if (event.key === 'r' && gameOver) {
        resetGame();
    }
});

// Contrôle du paddle du joueur
document.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseY = event.clientY - rect.top;

    // Limite le mouvement du paddle à la hauteur du canvas
    if (mouseY > 0 && mouseY < canvas.height - playerPaddle.height) {
        playerPaddle.y = mouseY;
    }
});

// Nouvelle Partie
newGameBtn.addEventListener("click", () => {
    gameStarted = true;
    resetGame();
    showGamePage();
    gamePaused = false;
});

// Reprendre Partie
resumeGameBtn.addEventListener("click", () => {
    if (gamePaused && gameStarted) {
        gamePaused = false;
        showGamePage();
    }
});

// Quitter
exitGameBtn.addEventListener("click", () => {
    if (confirm("Êtes-vous sûr de vouloir quitter le jeu ?")) {
        window.close();
    }
});

// Pause Partie
pauseGameBtn.addEventListener("click", () => {
    gamePaused = true;
    showHomePage();
    resumeGameBtn.disabled = false;
});

function drawGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'white';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Jeu terminé", canvas.width / 2, canvas.height / 2 - 60);
	ctx.fillText("Score final", canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText(`Joueur: ${playerScore} | IA: ${aiScore}`, canvas.width / 2, canvas.height / 2 + 20);
    ctx.fillText("Appuyez sur R pour recommencer", canvas.width / 2, canvas.height / 2 + 60);
    
    // Afficher qui a gagné
    if (playerScore >= winningScore) {
        ctx.fillText("Félicitations! Vous avez gagné!", canvas.width / 2, canvas.height / 2 + 100);
    } else if (aiScore >= winningScore) {
        ctx.fillText("Dommage! L'IA a gagné!", canvas.width / 2, canvas.height / 2 + 100);
    }
	gamePaused = true; // Mettre en pause la boucle une fois le jeu terminé
}

function checkGameOver() {
    if (playerScore >= winningScore || aiScore >= winningScore) {
        gameOver = true;
    }
}

// Affiche la page de jeu et masque la page d'accueil
function showGamePage() {
    homePage.classList.add("hidden");
    gamePage.classList.remove("hidden");
}

// Affiche la page d'accueil et masque la page de jeu
function showHomePage() {
    homePage.classList.remove("hidden");
    gamePage.classList.add("hidden");
}

function resetGame() {
    playerScore = 0;
    aiScore = 0;
    gameOver = false; // Réinitialiser l'indicateur de fin de jeu
    resetBall(); // Réinitialiser la balle
	resumeGameBtn.disabled = true; // Désactiver le bouton de reprise au début d'une nouvelle partie
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Player: ${playerScore}`, 20, 30);
    ctx.fillText(`AI: ${aiScore}`, canvas.width - 100, 30);
}

function aiMove() {
    // Calcule la position anticipée de la balle
    let anticipatedY = ball.y + ball.speedY * 10; // Multiplier par un facteur pour anticiper
    anticipatedY = Math.max(0, Math.min(canvas.height - aiPaddle.height, anticipatedY)); // Limiter à la taille du canvas

    // Déplace l'IA vers la position anticipée
    if (anticipatedY < aiPaddle.y) {
        aiPaddle.y -= 4 + (playerScore + aiScore) * 0.5; // Vitesse de l'IA
    } else if (anticipatedY > aiPaddle.y + aiPaddle.height) {
        aiPaddle.y += 4 + (playerScore + aiScore) * 0.5; // Vitesse de l'IA
    }

    // Limiter le mouvement du paddle de l'IA
    if (aiPaddle.y < 0) aiPaddle.y = 0;
    if (aiPaddle.y > canvas.height - aiPaddle.height) aiPaddle.y = canvas.height - aiPaddle.height;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
	drawScore();
    ctx.fillRect(playerPaddle.x, playerPaddle.y, playerPaddle.width, playerPaddle.height);
    ctx.fillRect(aiPaddle.x, aiPaddle.y, aiPaddle.width, aiPaddle.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
}

function update() {
	
	if (gameOver) {
        return; // Si le jeu est terminé, ne rien mettre à jour
    }
	
    // Vérifie les collisions avec les murs et raquettes
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
		
		ball.speedX *= 1.05; // Augmente la vitesse après chaque collision
		ball.speedY *= 1.05; // Augmente la vitesse après chaque collision
		ball.speedX = Math.sign(ball.speedX) * Math.min(Math.abs(ball.speedX), maxSpeed);
		ball.speedY = Math.sign(ball.speedY) * Math.min(Math.abs(ball.speedY), maxSpeed);
	}

    if (ball.x - ball.radius < playerPaddle.x + playerPaddle.width && ball.y > playerPaddle.y && ball.y < playerPaddle.y + playerPaddle.height) {
        ball.speedX = -ball.speedX;
		
		ball.speedX *= 1.05; // Augmente la vitesse après chaque collision
		ball.speedY *= 1.05; // Augmente la vitesse après chaque collision
		ball.speedX = Math.sign(ball.speedX) * Math.min(Math.abs(ball.speedX), maxSpeed);
		ball.speedY = Math.sign(ball.speedY) * Math.min(Math.abs(ball.speedY), maxSpeed);
	}

    if (ball.x + ball.radius > aiPaddle.x && ball.y > aiPaddle.y && ball.y < aiPaddle.y + aiPaddle.height) {
        ball.speedX = -ball.speedX;
		
		ball.speedX *= 1.05; // Augmente la vitesse après chaque collision
		ball.speedY *= 1.05; // Augmente la vitesse après chaque collision
		ball.speedX = Math.sign(ball.speedX) * Math.min(Math.abs(ball.speedX), maxSpeed);
		ball.speedY = Math.sign(ball.speedY) * Math.min(Math.abs(ball.speedY), maxSpeed);
    }

    // Remise en jeu après un point
    if (ball.x < 0) {
        aiScore++;
		checkGameOver(); // Vérifie si le jeu est terminé
        resetBall();
    } else if (ball.x > canvas.width) {
        playerScore++;
		checkGameOver(); // Vérifie si le jeu est terminé
        resetBall();
    }

    aiMove(); // Mouvements de l'IA
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = (Math.random() > 0.5 ? 5 : -5); // Direction aléatoire
    ball.speedY = (Math.random() > 0.5 ? 5 : -5); // Vitesse aléatoire
}

function gameLoop() {
	if (!gamePaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (gameOver) {
            drawGameOver();
        } else {
            draw();
            update();
        }
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();