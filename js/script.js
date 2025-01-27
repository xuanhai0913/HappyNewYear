// Get the elements
const playerScore = document.getElementById("player-score");
const computerScore = document.getElementById("computer-score");
const resultText = document.getElementById("result");
const lixiMessage = document.getElementById("lixi-message");  // Để hiển thị thông báo lì xì
const winGif = document.getElementById("win-gif");
const loseGif = document.getElementById("lose-gif");
const drawGif = document.getElementById("draw-gif");
// Game logic
let playerScoreCount = 0;
let computerScoreCount = 0;
let roundsPlayed = 0;
let roundsRequired = 6; // Tổng số lượt chơi
let winsRequired = 4;  // Cần thắng ít nhất 4 lượt để nhận lì xì

const choices = ["Búa", "Bao", "Kéo"];

function computerChoice() {
  const randomIndex = Math.floor(Math.random() * 3);
  return choices[randomIndex];
}

function playRound(playerSelection, computerSelection) {
  if (playerSelection === computerSelection) {
    return "Hòa!";
  }

  if (
    (playerSelection === "Búa" && computerSelection === "Kéo") ||
    (playerSelection === "Kéo" && computerSelection === "Bao") ||
    (playerSelection === "Bao" && computerSelection === "Búa")
  ) {
    playerScoreCount++;
    return "Bạn thắng!";
  } else {
    computerScoreCount++;
    return "BOT thắng!";
  }
}

function updateScores() {
  playerScore.textContent = playerScoreCount;
  computerScore.textContent = computerScoreCount;
}

function checkForWinner() {
  if (roundsPlayed >= roundsRequired) {
    if (playerScoreCount > computerScoreCount) {
      lixiMessage.textContent = "Chúc mừng! Bạn thắng và nhận được lì xì!";
      lixiMessage.style.color = "green";
      winGif.classList.remove("hidden"); // Hiển thị GIF thắng
      // Chuyển hướng tới trang lixi.html khi thắng
      setTimeout(() => {
        window.location.href = "../xephinh/xh.html"; // Chuyển hướng sau khi thắng
      }, 2000); // Đợi 2 giây trước khi chuyển hướng

    } else if (playerScoreCount < computerScoreCount) {
      lixiMessage.textContent = "Thật tiếc! BOT thắng!";
      lixiMessage.style.color = "red";
      loseGif.classList.remove("hidden"); // Hiển thị GIF thua

    } else {
      lixiMessage.textContent = "Hòa! Không ai thắng!";
      lixiMessage.style.color = "orange";
      drawGif.classList.remove("hidden"); // Hiển thị GIF hòa

    }
    // Vô hiệu hóa các nút khi đã hết lượt chơi
    document.getElementById("Búa").disabled = true;
    document.getElementById("Bao").disabled = true;
    document.getElementById("Kéo").disabled = true;
  }
}

// Handle player's choice
document.getElementById("Búa").addEventListener("click", function () {
  if (roundsPlayed < roundsRequired) {
    const playerSelection = "Búa";
    const computerSelection = computerChoice();
    const result = playRound(playerSelection, computerSelection);
    roundsPlayed++;
    resultText.textContent = `${result} (Máy tính chọn ${computerSelection})`;
    updateScores();
    checkForWinner();
  }
});

document.getElementById("Bao").addEventListener("click", function () {
  if (roundsPlayed < roundsRequired) {
    const playerSelection = "Bao";
    const computerSelection = computerChoice();
    const result = playRound(playerSelection, computerSelection);
    roundsPlayed++;
    resultText.textContent = `${result} (Máy tính chọn ${computerSelection})`;
    updateScores();
    checkForWinner();
  }
});

document.getElementById("Kéo").addEventListener("click", function () {
  if (roundsPlayed < roundsRequired) {
    const playerSelection = "Kéo";
    const computerSelection = computerChoice();
    const result = playRound(playerSelection, computerSelection);
    roundsPlayed++;
    resultText.textContent = `${result} (Máy tính chọn ${computerSelection})`;
    updateScores();
    checkForWinner();
  }
});