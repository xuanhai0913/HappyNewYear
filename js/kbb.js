const API_BASE_URL = window.location.origin;

// Get the elements
const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");
const resultText = document.getElementById("result");
const lixiMessage = document.getElementById("lixi-message");
const playerChoiceDiv = document.getElementById("player-choice");
const computerChoiceDiv = document.getElementById("computer-choice");
const gameButtons = document.querySelectorAll(".cube");


// Game logic
let playerScoreCount = 0;
let computerScoreCount = 0;
let isGameActive = true;

const choices = ["Búa", "Bao", "Kéo"];
const choiceEmojis = {
  "Búa": "✊",
  "Bao": "✋",
  "Kéo": "✌️"
};

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
      lixiMessage.textContent = `🎉 ${data.message}`;
      lixiMessage.style.color = "green";
      
      // Show victory popup
      showVictoryPopup(data.extraTurns);
    }
  } catch (error) {
    console.error('Error handling win:', error);
  }
  
  isGameActive = false;
}

function showVictoryPopup(totalTurns) {
  // Remove any existing popup
  const existingOverlay = document.getElementById('victory-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Create popup overlay
  const overlay = document.createElement('div');
  overlay.id = 'victory-overlay';
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.9) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 999999 !important;
    animation: fadeIn 0.3s ease-in;
    overflow: hidden !important;
  `;
  
  // Create popup content
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: relative !important;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
    padding: 40px !important;
    border-radius: 20px !important;
    text-align: center !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
    max-width: 90vw !important;
    width: 500px !important;
    animation: slideIn 0.5s ease-out !important;
    border: 3px solid #FFD700 !important;
    z-index: 1000000 !important;
  `;
  
  popup.innerHTML = `
    <div style="font-size: 80px; margin-bottom: 20px;">🎉</div>
    <h1 style="color: #FFD700; font-size: 36px; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
      CHÚC MỪNG!
    </h1>
    <p style="color: white; font-size: 24px; margin: 20px 0; line-height: 1.6;">
      Bạn đã thắng!<br>
      <strong style="color: #00FF00; font-size: 28px;">+1 lượt rút lì xì</strong>
    </p>
    <p style="color: #FFD700; font-size: 20px; margin: 20px 0;">
      💎 Tổng lượt hiện có: <strong>${totalTurns}</strong>
    </p>
    <button id="goto-lixi-btn" style="
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #000;
      border: none;
      padding: 15px 40px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 50px;
      cursor: pointer;
      margin-top: 20px;
      box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
      transition: all 0.3s ease;
    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      🎁 Đi Rút Lì Xì Ngay!
    </button>
  `;
  
  // Add animations (only once)
  if (!document.getElementById('popup-animations')) {
    const style = document.createElement('style');
    style.id = 'popup-animations';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes slideIn {
        from { 
          transform: translateY(-50px) scale(0.9);
          opacity: 0;
        }
        to { 
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }
    `;
    document.head.appendChild(style);
  }
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Add click handler
  document.getElementById('goto-lixi-btn').addEventListener('click', () => {
    window.location.href = 'xh.html';
  });
  
  // Close on overlay click (optional)
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      window.location.href = 'xh.html';
    }
  });
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
      lixiMessage.textContent = `❌ ${data.message}`;
      lixiMessage.style.color = "red";
      
      // Show loss popup
      showLossPopup(data.minutesLeft);
    }
  } catch (error) {
    console.error('Error handling loss:', error);
  }
  
  isGameActive = false;
}

function showLossPopup(minutes) {
  // Remove any existing popup
  const existingOverlay = document.getElementById('loss-overlay');
  if (existingOverlay) {
    existingOverlay.remove();
  }
  
  // Prevent body scroll
  document.body.style.overflow = 'hidden';
  
  // Create popup overlay
  const overlay = document.createElement('div');
  overlay.id = 'loss-overlay';
  overlay.style.cssText = `
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    background: rgba(0, 0, 0, 0.9) !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    z-index: 999999 !important;
    animation: fadeIn 0.3s ease-in;
    overflow: hidden !important;
  `;
  
  // Create popup content
  const popup = document.createElement('div');
  popup.style.cssText = `
    position: relative !important;
    background: linear-gradient(135deg, #FF4444, #CC0000) !important;
    padding: 40px !important;
    border-radius: 20px !important;
    text-align: center !important;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8) !important;
    max-width: 90vw !important;
    width: 500px !important;
    animation: slideIn 0.5s ease-out !important;
    border: 3px solid #FFD700 !important;
    z-index: 1000000 !important;
  `;
  
  popup.innerHTML = `
    <div style="font-size: 80px; margin-bottom: 20px;">😢</div>
    <h1 style="color: white; font-size: 36px; margin: 0 0 20px 0; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
      RẤT TIẾC!
    </h1>
    <p style="color: white; font-size: 24px; margin: 20px 0; line-height: 1.6;">
      Bạn đã thua!<br>
      <strong style="color: #FFD700; font-size: 28px;">Bị cấm ${minutes} phút</strong>
    </p>
    <p style="color: #FFF; font-size: 18px; margin: 20px 0;">
      ⏰ Quay lại sau ${minutes} phút để chơi tiếp nhé!
    </p>
    <button onclick="window.location.href='index.html'" style="
      background: linear-gradient(135deg, #666, #333);
      color: white;
      border: none;
      padding: 15px 40px;
      font-size: 20px;
      font-weight: bold;
      border-radius: 50px;
      cursor: pointer;
      margin-top: 20px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
      transition: all 0.3s ease;
    " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
      🏠 Về Trang Chủ
    </button>
  `;
  
  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      window.location.href = 'index.html';
    }
  });
}

function updateScores() {
  playerScore.textContent = playerScoreCount;
  computerScore.textContent = computerScoreCount;
}

async function handleGameLogic(playerSelection, computerSelection) {
    if (!isGameActive) return;

    // Display choices
    playerChoiceDiv.textContent = choiceEmojis[playerSelection];
    computerChoiceDiv.textContent = choiceEmojis[computerSelection];

    const result = await playRound(playerSelection, computerSelection);
    resultText.textContent = `${result}`;
    updateScores();
}

async function play(playerSelection) {
    if (!isGameActive) return;
    const computerSelection = computerChoice();
    await handleGameLogic(playerSelection, computerSelection);
}