// script.js
const cards = document.querySelectorAll('.memory-card'); // Sélectionne toutes les cartes

let hasFlippedCard = false; // Indique si une carte a été retournée
let lockBoard = false; // Empêche de retourner d'autres cartes pendant l'animation
let firstCard, secondCard; // Stocke les deux cartes retournées

// Fonction pour retourner une carte
function flipCard() {
    if (lockBoard) return; // Ne fait rien si le tableau est verrouillé
    if (this === firstCard) return; // Ne permet pas de retourner la même carte

    this.classList.add('flip'); // Ajoute la classe flip pour retourner la carte

    if (!hasFlippedCard) {
        hasFlippedCard = true; // Une carte a été retournée
        firstCard = this; // Stocke la première carte
        return; // Termine la fonction
    }

    secondCard = this; // Stocke la deuxième carte
    checkForMatch(); // Vérifie si les deux cartes correspondent
}

// Fonction pour vérifier si les cartes correspondent
function checkForMatch() {
    const isMatch = firstCard.dataset.framework === secondCard.dataset.framework; // Compare les données des cartes
    isMatch ? disableCards() : unflipCards(); // Appelle la fonction appropriée
}

// Fonction pour désactiver les cartes correspondantes
function disableCards() {
    firstCard.removeEventListener('click', flipCard); // Retire l'événement de clic
    secondCard.removeEventListener('click', flipCard);
    resetBoard(); // Réinitialise le tableau
}

// Fonction pour retourner les cartes non correspondantes
function unflipCards() {
    lockBoard = true; // Verrouille le tableau
    setTimeout(() => {
        firstCard.classList.remove('flip'); // Retire la classe flip
        secondCard.classList.remove('flip');
        resetBoard(); // Réinitialise le tableau
    }, 1500); // Délai de 1,5 seconde avant de retourner les cartes
}

// Fonction pour réinitialiser le tableau
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false]; // Réinitialise les variables
    [firstCard, secondCard] = [null, null]; // Réinitialise les cartes
}

// Fonction pour mélanger les cartes
(function shuffle() {
    cards.forEach(card => {
        const randomPos = Math.floor(Math.random() * 12); // Génère une position aléatoire
        card.style.order = randomPos; // Change l'ordre de la carte
    });
})();

// Ajoute un événement de clic à chaque carte
cards.forEach(card => card.addEventListener('click', flipCard));
