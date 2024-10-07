let colorButtons = ["red", "blue", "green", "yellow"];
let gameSequence = [];
let playerSequence = [];
let level = 0;
let speed = 1000; // Starting speed

const startButton = document.getElementById('start-btn');
const colorBtnElems = document.querySelectorAll('.color-btn');
const leaderboardElem = document.getElementById('leaderboard');

// Function to flash a color
function flashColor(color) {
    const colorElement = document.getElementById(color);
    colorElement.style.opacity = 0.5;
    setTimeout(() => {
        colorElement.style.opacity = 1;
    }, speed / 2);
}

// Function to show the sequence
function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        flashColor(gameSequence[i]);
        i++;
        if (i >= gameSequence.length) {
            clearInterval(interval);
        }
    }, speed);
}

// Add to sequence
function addToSequence() {
    const randomColor = colorButtons[Math.floor(Math.random() * 4)];
    gameSequence.push(randomColor);
}

// Start game
function startGame() {
    gameSequence = [];
    playerSequence = [];
    level = 0;
    nextLevel();
}

// Move to the next level
function nextLevel() {
    playerSequence = [];
    level++;
    speed = Math.max(300, speed - 50); // Game speeds up
    addToSequence();
    playSequence();
}

// Handle player input
function handlePlayerInput(color) {
    playerSequence.push(color);
    const currentStep = playerSequence.length - 1;
    if (playerSequence[currentStep] !== gameSequence[currentStep]) {
        alert("Game Over! You reached level " + level);
        saveScore(level); // Save score when game ends
        startGame();
    } else if (playerSequence.length === gameSequence.length) {
        setTimeout(nextLevel, 1000);
    }
}

// Event listeners for the color buttons
colorBtnElems.forEach(btn => {
    btn.addEventListener('click', (e) => {
        const color = e.target.id;
        flashColor(color);
        handlePlayerInput(color);
    });
});

// Start button event listener
startButton.addEventListener('click', startGame);

// Save score to localStorage
function saveScore(score) {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const username = prompt("Enter your name:");
    leaderboard.push({ username: username, score: score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 10); // Keep top 10 scores
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    loadLeaderboard();
}

// Load leaderboard from localStorage
function loadLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboardElem.innerHTML = "";
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.textContent = `${entry.username}: ${entry.score}`;
        leaderboardElem.appendChild(li);
    });
}

// Load leaderboard on page load
window.onload = loadLeaderboard;
