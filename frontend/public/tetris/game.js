let playerName; // Variable globale pour stocker le nom du joueur
//let gameOver = false;


function initGame(name){
    playerName = name; // Stocker le nom du joueur


    // Configuration du jeu
const config = {
    type: Phaser.AUTO,
    width: 320,  // 10 colonnes * 32 pixels
    height: 640, // 20 lignes * 32 pixels
    backgroundColor: '#000000',
    parent: 'game-container',  // Assure que le canvas est rendu dans le div #game-container
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);
    
}


// Variables globales
let grid = [];
const gridWidth = 10;
const gridHeight = 20;
const blockSize = 32;
let currentPiece;
let cursors;
let timer;
let score = 0;
let scoreText;
let gameOver = false;
let scoreSaved = false

// Les formes des Tétrominos
const tetrominoes = [
    // I
    {
        shape: [
            [1, 1, 1, 1]
        ],
        color: 0x00ffff
    },
    // O
    {
        shape: [
            [1, 1],
            [1, 1]
        ],
        color: 0xffff00
    },
    // T
    {
        shape: [
            [0, 1, 0],
            [1, 1, 1]
        ],
        color: 0x800080
    },
    // S
    {
        shape: [
            [0, 1, 1],
            [1, 1, 0]
        ],
        color: 0x00ff00
    },
    // Z
    {
        shape: [
            [1, 1, 0],
            [0, 1, 1]
        ],
        color: 0xff0000
    },
    // J
    {
        shape: [
            [1, 0, 0],
            [1, 1, 1]
        ],
        color: 0x0000ff
    },
    // L
    {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        color: 0xffa500
    }
];

function preload() {
    // Pas de ressources externes à charger pour ce jeu
}

function create() {
    // Initialiser la grille
    for (let row = 0; row < gridHeight; row++) {
        grid[row] = [];
        for (let col = 0; col < gridWidth; col++) {
            grid[row][col] = 0;
        }
    }

    // Create a group for game blocks
    this.blocksGroup = this.add.group();

    // Afficher le score
    scoreText = this.add.text(50, 50, 'Score: 0', { fontSize: '32px', fill: '#ffffff' });

    // Configurer les contrôles
    cursors = this.input.keyboard.createCursorKeys();

    // Générer la première pièce
    currentPiece = generatePiece();

    // Démarrer le timer pour descendre la pièce
    timer = this.time.addEvent({
        delay: 500,
        callback: moveDown,
        callbackScope: this,
        loop: true
    });

    this.draw = draw.bind(this);
}

function update() {
    if (gameOver) return;  // Stop updates if the game is over

    if (Phaser.Input.Keyboard.JustDown(cursors.left)) {
        move(-1);
    } else if (Phaser.Input.Keyboard.JustDown(cursors.right)) {
        move(1);
    } else if (Phaser.Input.Keyboard.JustDown(cursors.up)) {
        rotate();
    } else if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
        moveDown();
    }

    this.draw();
}

function generatePiece() {
    const index = Phaser.Math.Between(0, tetrominoes.length - 1);
    const piece = tetrominoes[index];
    return {
        shape: piece.shape,
        color: piece.color,
        x: Math.floor(gridWidth / 2) - Math.ceil(piece.shape[0].length / 2),
        y: 0
    };
}

function draw() {
    // Clear the previous blocks
    this.blocksGroup.clear(true);

    // Dessiner la grille
    for (let row = 0; row < gridHeight; row++) {
        for (let col = 0; col < gridWidth; col++) {
            if (grid[row][col] !== 0) {
                const block = this.add.rectangle(
                    col * blockSize + blockSize / 2,
                    row * blockSize + blockSize / 2,
                    blockSize - 1,
                    blockSize - 1,
                    grid[row][col]
                );
                this.blocksGroup.add(block);
            }
        }
    }

    // Dessiner la pièce courante
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                const block = this.add.rectangle(
                    (currentPiece.x + col) * blockSize + blockSize / 2,
                    (currentPiece.y + row) * blockSize + blockSize / 2,
                    blockSize - 1,
                    blockSize - 1,
                    currentPiece.color
                );
                this.blocksGroup.add(block);
            }
        }
    }

    // Mettre à jour le score
    scoreText.setText('Score: ' + score);
}

function move(offset) {
    if (!collides(currentPiece.shape, currentPiece.x + offset, currentPiece.y)) {
        currentPiece.x += offset;
    }
}

function moveDown() {
    if (!collides(currentPiece.shape, currentPiece.x, currentPiece.y + 1)) {
        currentPiece.y += 1;
    } else {
        merge();
        clearLines();
        currentPiece = generatePiece();
        if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
            gameOver = true;

            if(!scoreSaved){

                scoreSaved= true;
                this.add.text(100, 300, 'Game Over', { fontSize: '32px', fill: '#ff0000' });

            // Réafficher le chat à la fin du jeu
            document.getElementById('leaderboard').style.display = 'block';

            console.log('Enregistrement du score:', score); // Ajouter cela avant l'appel à saveScoreToDatabase
            console.log('Player Name:', playerName);            
        

            saveScoreToDatabase(playerName, score); //sauvegarder si le jeu est terminé
            getLeaderboard();

            }
            
        }
    }

}

function rotate() {
    const rotatedShape = rotateMatrix(currentPiece.shape);
    if (!collides(rotatedShape, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotatedShape;
    }
}

function rotateMatrix(matrix) {
    const result = [];
    for (let i = 0; i < matrix[0].length; i++) {
        result[i] = [];
        for (let j = 0; j < matrix.length; j++) {
            result[i][j] = matrix[matrix.length - j - 1][i];
        }
    }
    return result;
}

function collides(shape, x, y) {
    for (let row = 0; row < shape.length; row++) {
        for (let col = 0; col < shape[row].length; col++) {
            if (shape[row][col]) {
                let newX = x + col;
                let newY = y + row;
                if (newX < 0 || newX >= gridWidth || newY >= gridHeight) {
                    return true;
                }
                if (grid[newY] && grid[newY][newX]) {
                    return true;
                }
            }
        }
    }
    return false;
}

function merge() {
    for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
            if (currentPiece.shape[row][col]) {
                grid[currentPiece.y + row][currentPiece.x + col] = currentPiece.color;
            }
        }
    }
}

function clearLines() {
    let linesCleared = 0;
    for (let row = gridHeight - 1; row >= 0; row--) {
        if (grid[row].every(cell => cell !== 0)) {
            grid.splice(row, 1);
            grid.unshift(new Array(gridWidth).fill(0));
            linesCleared++;
            row++;  // Adjust the row to recheck the new one
        }
    }

    if (linesCleared > 0) {
        score += linesCleared * 10;
        scoreText.setText('Score: ' + score);
    }
}

function saveScoreToDatabase(name, score) {
    const data = {
        name: name,
        score: score
    };

    console.log('Données envoyées :', data); //  voir les données dans la console

    fetch('http://localhost/save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
     }
    )
    .then(response => response.text())
    .then(data => {
        console.log('Success:', data);
        getLeaderboard(); // Appel après la réussite de la sauvegarde
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}


function getLeaderboard() {
    fetch('http://localhost/get_scores.php')
    .then(response => response.json())
    .then(data => {
        // Effacer les anciens éléments du leaderboard si nécessaire
        const leaderboardElement = document.getElementById('leaderboard');
        leaderboardElement.innerHTML = ''; // Vider l'élément pour éviter les doublons

        // Ajouter un titre pour le leaderboard
        const title = document.createElement('h2');
        title.textContent = 'Leaderboard :';
        leaderboardElement.appendChild(title);

        // Boucler sur les données pour afficher chaque score
        data.forEach((item, index) => {
            const listItem = document.createElement('p');
            listItem.textContent = `${index + 1}. ${item.player_name} - Score: ${item.score}`;
            leaderboardElement.appendChild(listItem);
        });
    })
    .catch(error => {
        console.error('Erreur lors de la récupération du leaderboard:', error);
    });
}
