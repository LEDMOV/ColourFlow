let colorButtons = ["red", "blue", "green", "yellow"];
let gameSequence = [];
let playerSequence = [];
let level = 0;
let speed = 1000; // Starting speed

const startButton = document.getElementById('start-btn');
const colorBtnElems = document.querySelectorAll('.color-btn');

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
function submitScore(username, score) {
    fetch('/submit_score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username, score: score }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Score submitted:', data);
    });
}
