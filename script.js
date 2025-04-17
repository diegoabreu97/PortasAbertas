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