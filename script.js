let colors = ["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"];
let gameSequence = [];
let playerSequence = [];
let level = 0;
let speed = 1000; // Initial speed
let gridSize = 2; // Initial grid size (2x2)

const startButton = document.getElementById('start-btn');
const musicToggleButton = document.getElementById('music-toggle-btn'); // New button
const gameBoard = document.getElementById('game-board');
const leaderboardElem = document.getElementById('leaderboard');
const clickSound = document.getElementById('click-sound'); 

// Define your playlist of songs
const playlist = [
    "sounds/hello-bossa-245054.mp3",
    "sounds/jazzy-slow-background-music-244598.mp3",
    "sounds/bossa-for-love-245952.mp3"
];

let currentSongIndex = 0;
const audioPlayer = document.getElementById('background-music');
let isMusicPlaying = true; // Flag to track music status

// Function to toggle music on and off
function toggleMusic() {
    if (isMusicPlaying) {
        audioPlayer.pause(); // Pause music
        musicToggleButton.textContent = "Play Music"; // Change button text
    } else {
        loadAndPlaySong(currentSongIndex); // Play the current song
        musicToggleButton.textContent = "Pause Music"; // Change button text
    }
    isMusicPlaying = !isMusicPlaying; // Toggle the flag
}

// Generate game board based on grid size
function generateGameBoard() {
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 150px)`;

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

// Function to flash a color
function flashColor(color) {
    const colorElem = document.getElementById(color);
    colorElem.style.opacity = 0.5;
    setTimeout(() => colorElem.style.opacity = 1, speed / 2);
}

// Function to show the sequence
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
    const randomIndex = Math.floor(Math.random() * (gridSize * gridSize));
    gameSequence.push(colors[randomIndex % colors.length]);
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

// Move to the next level
function nextLevel() {
    playerSequence = [];
    level++;
    speed = Math.max(300, speed - 50); // Game speeds up
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

    // Play sound on button click
    clickSound.currentTime = 0; // Reset sound to start
    clickSound.play(); // Play the sound

    if (playerSequence[currentMove] !== gameSequence[currentMove]) {
        alert(`Game Over! You reached level ${level}`);
        saveScore(level);
        startGame();
    } else if (playerSequence.length === gameSequence.length) {
        setTimeout(nextLevel, 1000);
    }
}

// Start button listener
startButton.addEventListener('click', () => {
    startGame();
    loadAndPlaySong(currentSongIndex); // Start the background music when the game begins
});

// Music toggle button listener
musicToggleButton.addEventListener('click', toggleMusic); // Add event listener for music toggle button

// Add event listener for toggle leaderboard button
const toggleLeaderboardButton = document.getElementById('toggle-leaderboard-btn'); // Get the toggle leaderboard button
toggleLeaderboardButton.addEventListener('click', () => {
    if (leaderboardElem.style.display === "none") {
        leaderboardElem.style.display = "block"; // Show the leaderboard
    } else {
        leaderboardElem.style.display = "none"; // Hide the leaderboard
    }
});

// Load and play a song
function loadAndPlaySong(songIndex) {
    if (songIndex < playlist.length) {
        audioPlayer.src = playlist[songIndex];
        audioPlayer.play().catch(error => {
            console.log('Music autoplay was blocked:', error);
        });
    }
}

// Move to the next song when one ends
audioPlayer.addEventListener('ended', function() {
    currentSongIndex++;
    if (currentSongIndex < playlist.length) {
        loadAndPlaySong(currentSongIndex);
    } else {
        currentSongIndex = 0; // Restart playlist
        loadAndPlaySong(currentSongIndex);
    }
});

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
