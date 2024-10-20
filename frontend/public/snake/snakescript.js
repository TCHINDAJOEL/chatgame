const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');

const gridSize = 20;
const tileCount = 20;
let snake = [{ x: 10, y: 10 }];
let velocity = { x: 1, y: 0 };  // Le serpent commence par se déplacer vers la droite
let apple = { x: 15, y: 15 };
let score = 0;
let gameOver = false;
let started = false;  // Variable pour vérifier si le joueur a commencé à bouger

canvas.width = canvas.height = gridSize * tileCount;

function gameLoop() {
    if (gameOver) return;

    update();
    draw();

    setTimeout(gameLoop, 100);
}

function update() {
    const head = { ...snake[0] };

    // Si le joueur n'a pas commencé à bouger, ne pas terminer le jeu
    if (!started) return;

    head.x += velocity.x;
    head.y += velocity.y;

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount || collisionWithSnake(head)) {
        gameOver = true;
        alert('Game Over! Votre score est de ' + score);
        return;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
        score++;
        scoreDisplay.innerText = 'Score : ' + score;
        placeApple();
    } else {
        snake.pop();
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dessiner le serpent
    snake.forEach(segment => {
        ctx.fillStyle = 'lime';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });

    // Dessiner la pomme
    ctx.fillStyle = 'red';
    ctx.fillRect(apple.x * gridSize, apple.y * gridSize, gridSize, gridSize);
}

function placeApple() {
    apple.x = Math.floor(Math.random() * tileCount);
    apple.y = Math.floor(Math.random() * tileCount);
}

function collisionWithSnake(position) {
    return snake.some(segment => segment.x === position.x && segment.y === position.y);
}

// Contrôle du serpent
document.addEventListener('keydown', (event) => {
    started = true;  // Le joueur commence à jouer lorsqu'une touche est pressée

    switch (event.key) {
        case 'ArrowUp':
            if (velocity.y === 0) {
                velocity = { x: 0, y: -1 };
            }
            break;
        case 'ArrowDown':
            if (velocity.y === 0) {
                velocity = { x: 0, y: 1 };
            }
            break;
        case 'ArrowLeft':
            if (velocity.x === 0) {
                velocity = { x: -1, y: 0 };
            }
            break;
        case 'ArrowRight':
            if (velocity.x === 0) {
                velocity = { x: 1, y: 0 };
            }
            break;
    }
});

gameLoop();