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
const resetBtn = document.getElementById('reset-btn');
const confettiContainer = document.getElementById('confetti-container');

// Choice buttons
const choiceBtns = document.querySelectorAll('.choice-btn');

// Initialize game
function init() {
    // Add event listeners to choice buttons
    choiceBtns.forEach(btn => {
        btn.addEventListener('click', () => handleChoice(btn.dataset.choice));
    });

    // Reset button
    resetBtn.addEventListener('click', resetGame);

    // Load saved scores from localStorage
    loadScores();
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

        // Show confetti on win
        if (result === 'win') {
            createConfetti();
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
    element.style.color = '#ffcc00';

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

    // Add reset animation
    resetBtn.style.transform = 'rotate(360deg)';
    setTimeout(() => {
        resetBtn.style.transform = '';
    }, 500);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff6b35', '#f7931e', '#ffcc00', '#38ef7d', '#667eea', '#f5576c'];

    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = Math.random() * 10 + 5 + 'px';
            confetti.style.animationDuration = Math.random() * 2 + 2 + 's';

            confettiContainer.appendChild(confetti);

            // Remove after animation
            setTimeout(() => {
                confetti.remove();
            }, 4000);
        }, i * 50);
    }
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
