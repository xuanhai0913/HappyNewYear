const API_BASE_URL = window.location.origin;

// Get the elements
const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");
const resultText = document.getElementById("result");
const lixiMessage = document.getElementById("lixi-message");
const winGif = document.getElementById("win-gif");
const loseGif = document.getElementById("lose-gif");
const drawGif = document.getElementById("draw-gif");

// Game logic
let playerScoreCount = 0;
let computerScoreCount = 0;
let isGameActive = true;

const choices = ["Búa", "Bao", "Kéo"];

// Check ban status on load
window.addEventListener('DOMContentLoaded', async function() {
    await checkBanStatus();
});

async function checkBanStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/game-turns?action=checkKBBBan`);
        const data = await response.json();
        
        if (data.isBanned) {
            disableGame(data.message);
            lixiMessage.textContent = data.message;
            lixiMessage.style.color = "red";
        }
    } catch (error) {
        console.error('Error checking ban status:', error);
    }
}

function disableGame(message) {
    isGameActive = false;
    document.getElementById("Búa").disabled = true;
    document.getElementById("Bao").disabled = true;
    document.getElementById("Kéo").disabled = true;
    if (message) {
        resultText.textContent = message;
    }
}

function computerChoice() {
  const randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
}

async function playRound(playerSelection, computerSelection) {
  if (!isGameActive) return;
  
  let result;
  
  if (playerSelection === computerSelection) {
    result = "Hòa!";
  } else if (
    (playerSelection === "Búa" && computerSelection === "Kéo") ||
    (playerSelection === "Kéo" && computerSelection === "Bao") ||
    (playerSelection === "Bao" && computerSelection === "Búa")
  ) {
    playerScoreCount++;
    result = "Bạn thắng!";
    await handleWin();
  } else {
    computerScoreCount++;
    result = "BOT thắng!";
    await handleLoss();
  }
  
  return result;
}

async function handleWin() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-turns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'kbbWin' })
    });
    
    const data = await response.json();
    if (data.success) {
      winGif.classList.remove("hidden");
      lixiMessage.textContent = `🎉 ${data.message}`;
      lixiMessage.style.color = "green";
      
      // Redirect to lixi page after 3 seconds
      setTimeout(() => {
        window.location.href = "xh.html";
      }, 3000);
    }
  } catch (error) {
    console.error('Error handling win:', error);
  }
  
  disableGame();
}

async function handleLoss() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/game-turns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'kbbLoss' })
    });
    
    const data = await response.json();
    if (data.success) {
      loseGif.classList.remove("hidden");
      lixiMessage.textContent = `❌ ${data.message}`;
      lixiMessage.style.color = "red";
    }
  } catch (error) {
    console.error('Error handling loss:', error);
  }
  
  disableGame();
}

function updateScores() {
  playerScore.textContent = playerScoreCount;
  computerScore.textContent = computerScoreCount;
}



// Handle player's choice
document.getElementById("Búa").addEventListener("click", async function () {
  if (!isGameActive) return;
  
  const playerSelection = "Búa";
  const computerSelection = computerChoice();
  const result = await playRound(playerSelection, computerSelection);
  resultText.textContent = `${result} (Máy tính chọn ${computerSelection})`;
  updateScores();
});

document.getElementById("Bao").addEventListener("click", async function () {
  if (!isGameActive) return;
  
  const playerSelection = "Bao";
  const computerSelection = computerChoice();
  const result = await playRound(playerSelection, computerSelection);
  resultText.textContent = `${result} (Máy tính chọn ${computerSelection})`;
  updateScores();
});

document.getElementById("Kéo").addEventListener("click", async function () {
  if (!isGameActive) return;
  
  const playerSelection = "Kéo";
  const computerSelection = computerChoice();
  const result = await playRound(playerSelection, computerSelection);
  resultText.textContent = `${result} (Máy tính chọn ${computerSelection})`;
  updateScores();
});