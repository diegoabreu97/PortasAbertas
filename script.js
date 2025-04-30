const cardsArray = [
    '🍎', '🍎',
    '🍌', '🍌',
    '🍇', '🍇',
    '🍓', '🍓',
    '🍍', '🍍',
    '🥝', '🥝',
    '🍒', '🍒',
    '🍉', '🍉'
];

let gameBoard = document.getElementById('game-board');
let resetButton = document.getElementById('reset-button');
let message = document.getElementById('message');

let flippedCards = [];
let matchedCards = 0;
let lockBoard = false;

let movesCount = 0;
let timerInterval = null;
let secondsElapsed = 0;
let timerStarted = false;

const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');

const startButton = document.getElementById('start-button');
const playerNameInput = document.getElementById('player-name');
const rankingList = document.getElementById('ranking-list');

let playerName = '';
let ranking = [];

resetButton.disabled = true;
gameBoard.style.pointerEvents = 'none';

startButton.addEventListener('click', () => {
    const name = playerNameInput.value.trim();
    if (name === '') {
        alert('Por favor, digite seu nome para iniciar o jogo.');
        return;
    }
    playerName = name;
    startGame();
});

function startGame() {
    resetButton.disabled = false;
    gameBoard.style.pointerEvents = 'auto';
    startButton.disabled = true;
    playerNameInput.disabled = true;
    createBoard();
}

function addToRanking(name, moves, time) {
    ranking.push({ name, moves, time });
    ranking.sort((a, b) => a.time - b.time || a.moves - b.moves);
    updateRankingDisplay();
}

function updateRankingDisplay() {
    rankingList.innerHTML = '';
    ranking.forEach((entry, index) => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'bg-success', 'text-dark', 'mb-2', 'rounded', 'text-center', 'fw-bold');
        li.textContent = `${index + 1}. ${entry.name} - Tempo: ${entry.time}s, Jogadas: ${entry.moves}`;
        rankingList.appendChild(li);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
function createBoard() {
    gameBoard.innerHTML = '';
    let shuffledCards = shuffle(cardsArray.slice());
    shuffledCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-dark', 'text-white', 'shadow', 'rounded');
        card.style.width = '100px';
        card.style.height = '100px';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.style.cursor = 'pointer';
        card.style.perspective = '600px';
        card.style.position = 'relative';

        const cardInner = document.createElement('div');
        cardInner.classList.add('card-inner');
        cardInner.style.width = '100%';
        cardInner.style.height = '100%';
        cardInner.style.transition = 'transform 0.5s';
        cardInner.style.transformStyle = 'preserve-3d';
        cardInner.style.position = 'relative';

        const cardFront = document.createElement('div');
        cardFront.classList.add('card-front', 'd-flex', 'align-items-center', 'justify-content-center');
        cardFront.style.backgroundColor = '#34495e';
        cardFront.style.fontSize = '48px';
        cardFront.style.width = '100%';
        cardFront.style.height = '100%';
        cardFront.style.position = 'absolute';
        cardFront.style.backfaceVisibility = 'hidden';
        cardFront.style.borderRadius = '0.5rem';
        cardFront.textContent = '?';

        const cardBack = document.createElement('div');
        cardBack.classList.add('card-back', 'd-flex', 'align-items-center', 'justify-content-center');
        cardBack.style.backgroundColor = '#1abc9c';
        cardBack.style.fontSize = '48px';
        cardBack.style.width = '100%';
        cardBack.style.height = '100%';
        cardBack.style.position = 'absolute';
        cardBack.style.backfaceVisibility = 'hidden';
        cardBack.style.borderRadius = '0.5rem';
        cardBack.style.transform = 'rotateY(180deg)';
        cardBack.textContent = emoji;

        cardInner.appendChild(cardFront);
        cardInner.appendChild(cardBack);
        card.appendChild(cardInner);

        card.addEventListener('click', flipCard);

        gameBoard.appendChild(card);
    });
    matchedCards = 0;
    message.textContent = '';
    resetStats();
}

function flipCard() {
    if (lockBoard) return;
    if (this.classList.contains('flipped')) return;

    if (!timerStarted) {
        startTimer();
        timerStarted = true;
    }

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        movesCount++;
        updateMoves();
        checkForMatch();
    }
}