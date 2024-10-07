let colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"];
let gameSequence = [];
let playerSequence = [];
let level = 0;
let speed = 1000; // Initial speed
let gridSize = 2; // Initial grid size (2x2)

const startButton = document.getElementById('start-btn');
const gameBoard = document.getElementById('game-board');
const leaderboardElem = document.getElementById('leaderboard');

// Generate game board based on grid size
function generateGameBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 150px)`;
    gameBoard.style.gridTemplateRows = `repeat(${gridSize}, 150px)`;

    for (let i = 0; i < gridSize * gridSize; i++) {
        let color = colors[i % colors.length];
        let colorDiv = document.createElement('div');
        colorDiv.classList.add('color-btn');
        colorDiv.id = color;
        colorDiv.style.backgroundColor = color;
        gameBoard.appendChild(colorDiv);

        // Add event listener for player input
        colorDiv.addEventListener('click', () => handlePlayerInput(color));
    }
}

// Flash a color
function flashColor(color) {
    const colorElem = document.getElementById(color);
    colorElem.style.opacity = 0.5;
    setTimeout(() => colorElem.style.opacity = 1, speed / 2);
}

// Play the sequence
function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        flashColor(gameSequence[i]);
        i++;
        if (i >= gameSequence.length) clearInterval(interval);
    }, speed);
}

// Add a random color to the sequence
function addToSequence() {
    let availableColors = document.querySelectorAll('.color-btn');
    const randomIndex = Math.floor(Math.random() * availableColors.length);
    gameSequence.push(availableColors[randomIndex].id);
}

// Start the game
function startGame() {
    gameSequence = [];
    playerSequence = [];
    level = 0;
    gridSize = 2; // Reset grid size to initial state
    generateGameBoard();
    nextLevel();
}

// Go to the next level
function nextLevel() {
    playerSequence = [];
    level++;
    speed = Math.max(300, speed - 50); // Speed up the game each level
    addToSequence();
    playSequence();

    // Increase grid size every 5 levels
    if (level % 5 === 0) {
        gridSize++;
        generateGameBoard();
    }
}

// Handle player input
function handlePlayerInput(color) {
    playerSequence.push(color);
    const currentMove = playerSequence.length - 1;

    if (playerSequence[currentMove] !== gameSequence[currentMove]) {
        alert(`Game Over! You reached level ${level}`);
        saveScore(level);
        startGame();
    } else if (playerSequence.length === gameSequence.length) {
        setTimeout(nextLevel, 1000);
    }
}

// Start button listener
startButton.addEventListener('click', startGame);

// Save score to localStorage
function saveScore(score) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const username = prompt("Enter your name:");
    leaderboard.push({ username, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10); // Keep top 10
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    loadLeaderboard();
}

// Load leaderboard from localStorage
function loadLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardElem.innerHTML = leaderboard.map(entry => `<li>${entry.username}: ${entry.score}</li>`).join('');
}

// Load leaderboard when the page is loaded
window.onload = loadLeaderboard;
