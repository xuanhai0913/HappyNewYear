/**
 * Kéo Búa Bao - Rock Paper Scissors Game
 * Happy New Year 2026 Edition
 */

// Game state
const gameState = {
    playerScore: 0,
    computerScore: 0,
    tieScore: 0,
    isPlaying: false
};

// Choice mappings
const choices = {
    rock: { emoji: '✊', name: 'Búa', beats: 'scissors' },
    paper: { emoji: '🖐️', name: 'Bao', beats: 'rock' },
    scissors: { emoji: '✌️', name: 'Kéo', beats: 'paper' }
};

// DOM Elements
const playerChoiceEl = document.getElementById('player-choice');
const computerChoiceEl = document.getElementById('computer-choice');
const playerScoreEl = document.getElementById('player-score');
const computerScoreEl = document.getElementById('computer-score');
const tieScoreEl = document.getElementById('tie-score');
const resultContainer = document.getElementById('result-container');
const resultTextEl = document.getElementById('result-text');
const choiceBtns = document.querySelectorAll('.choice-btn');
// Game Control Elements
const resetBtn = document.getElementById('reset-btn');
const musicBtn = document.getElementById('music-btn');
const bgMusic = document.getElementById('bg-music');
let isMusicPlaying = true;

// Initialize game
function init() {
    // Add event listeners to choice buttons
    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => handleChoice(btn.dataset.choice));
    });

    // Reset button
    resetBtn.addEventListener('click', resetGame);

    // Music toggle
    musicBtn.addEventListener('click', toggleMusic);

    // Load saved scores from localStorage
    loadScores();

    // Start background fireworks
    startBackgroundFireworks();

    // Attempt to play music (might be blocked by browser policy)
    bgMusic.volume = 0.5;
    bgMusic.play().catch(() => {
        isMusicPlaying = false;
        updateMusicIcon();
    });
}

function toggleMusic() {
    if (isMusicPlaying) {
        bgMusic.pause();
    } else {
        bgMusic.play();
    }
    isMusicPlaying = !isMusicPlaying;
    updateMusicIcon();
}

function updateMusicIcon() {
    const icon = musicBtn.querySelector('i');
    if (isMusicPlaying) {
        icon.className = 'fas fa-volume-up';
    } else {
        icon.className = 'fas fa-volume-mute';
    }
}

// Load scores from localStorage
function loadScores() {
    const savedScores = localStorage.getItem('kbbScores');
    if (savedScores) {
        const scores = JSON.parse(savedScores);
        gameState.playerScore = scores.player || 0;
        gameState.computerScore = scores.computer || 0;
        gameState.tieScore = scores.tie || 0;
        updateScoreDisplay();
    }
}

// Save scores to localStorage
function saveScores() {
    const scores = {
        player: gameState.playerScore,
        computer: gameState.computerScore,
        tie: gameState.tieScore
    };
    localStorage.setItem('kbbScores', JSON.stringify(scores));
}

// Handle player choice
function handleChoice(playerChoice) {
    if (gameState.isPlaying) return;

    gameState.isPlaying = true;

    // Disable buttons during animation
    choiceBtns.forEach(btn => btn.disabled = true);

    // Show thinking animation
    showThinking();

    // After animation, show result
    setTimeout(() => {
        const computerChoice = getComputerChoice();
        const result = determineWinner(playerChoice, computerChoice);

        // Update displays
        updateChoiceDisplay(playerChoiceEl, playerChoice);
        updateChoiceDisplay(computerChoiceEl, computerChoice);

        // Update result
        showResult(result, playerChoice, computerChoice);

        // Update scores
        updateScores(result);

        // Re-enable buttons
        choiceBtns.forEach(btn => btn.disabled = false);
        gameState.isPlaying = false;

        // Show large fireworks on win
        if (result === 'win') {
            triggerWinFireworks();
        }

    }, 1000);
}

// Show thinking animation
function showThinking() {
    const emojis = ['✊', '🖐️', '✌️'];
    let index = 0;

    playerChoiceEl.classList.add('thinking');
    computerChoiceEl.classList.add('thinking');

    const interval = setInterval(() => {
        computerChoiceEl.querySelector('.choice-emoji').textContent = emojis[index];
        index = (index + 1) % emojis.length;
    }, 150);

    setTimeout(() => {
        clearInterval(interval);
        playerChoiceEl.classList.remove('thinking');
        computerChoiceEl.classList.remove('thinking');
    }, 1000);
}

// Get random computer choice
function getComputerChoice() {
    const choiceKeys = Object.keys(choices);
    const randomIndex = Math.floor(Math.random() * choiceKeys.length);
    return choiceKeys[randomIndex];
}

// Determine winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    if (choices[playerChoice].beats === computerChoice) {
        return 'win';
    }

    return 'lose';
}

// Update choice display
function updateChoiceDisplay(element, choice) {
    const emoji = choices[choice].emoji;
    element.querySelector('.choice-emoji').textContent = emoji;

    // Add animation
    element.style.transform = 'scale(1.2)';
    setTimeout(() => {
        element.style.transform = 'scale(1)';
    }, 200);
}

// Show result
function showResult(result, playerChoice, computerChoice) {
    // Remove previous result classes
    resultContainer.classList.remove('win', 'lose', 'tie');

    const playerName = choices[playerChoice].name;
    const computerName = choices[computerChoice].name;

    switch (result) {
        case 'win':
            resultContainer.classList.add('win');
            resultTextEl.textContent = `🎉 Bạn thắng! ${playerName} thắng ${computerName}!`;
            break;
        case 'lose':
            resultContainer.classList.add('lose');
            resultTextEl.textContent = `😢 Bạn thua! ${computerName} thắng ${playerName}!`;
            break;
        case 'tie':
            resultContainer.classList.add('tie');
            resultTextEl.textContent = `🤝 Hòa! Cả hai cùng chọn ${playerName}!`;
            break;
    }
}

// Update scores
function updateScores(result) {
    switch (result) {
        case 'win':
            gameState.playerScore++;
            animateScore(playerScoreEl);
            break;
        case 'lose':
            gameState.computerScore++;
            animateScore(computerScoreEl);
            break;
        case 'tie':
            gameState.tieScore++;
            animateScore(tieScoreEl);
            break;
    }

    updateScoreDisplay();
    saveScores();
}

// Update score display
function updateScoreDisplay() {
    playerScoreEl.textContent = gameState.playerScore;
    computerScoreEl.textContent = gameState.computerScore;
    tieScoreEl.textContent = gameState.tieScore;
}

// Animate score
function animateScore(element) {
    element.style.transform = 'scale(1.5)';
    element.style.color = '#FFD700';

    setTimeout(() => {
        element.style.transform = 'scale(1)';
        element.style.color = '';
    }, 300);
}

// Reset game
function resetGame() {
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.tieScore = 0;

    updateScoreDisplay();
    saveScores();

    // Reset displays
    playerChoiceEl.querySelector('.choice-emoji').textContent = '❓';
    computerChoiceEl.querySelector('.choice-emoji').textContent = '❓';

    // Reset result
    resultContainer.classList.remove('win', 'lose', 'tie');
    resultTextEl.textContent = 'Hãy chọn để bắt đầu!';

    // Hide Meme
    const memeContainer = document.getElementById("kbbMemeResult");
    if (memeContainer) {
        memeContainer.classList.remove("show");
    }

    // Add reset animation
    resetBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        resetBtn.style.transform = '';
    }, 500);
}

// Background Fireworks Loop
function startBackgroundFireworks() {
    if (typeof confetti === 'undefined') return;

    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        // Occasional bursts
        if (Math.random() < 0.1) {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { x: Math.random(), y: Math.random() - 0.2 },
                colors: ['#FFD700', '#FF0000', '#FFFFFF']
            });
        }

    }, 2000);
}

// Big Fireworks on Win
function triggerWinFireworks() {
    if (typeof confetti === 'undefined') return;

    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 999 };

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        // since particles fall down, start a bit higher than random
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function randomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Add keyboard support
document.addEventListener('keydown', (e) => {
    if (gameState.isPlaying) return;

    switch (e.key.toLowerCase()) {
        case 'r':
        case '1':
            handleChoice('rock');
            break;
        case 'p':
        case '2':
            handleChoice('paper');
            break;
        case 's':
        case '3':
            handleChoice('scissors');
            break;
        case 'escape':
            resetGame();
            break;
    }
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);
