const prizes = ['10,000đ', '20,000đ', '50,000đ', 'Cái nịt', '30,000đ', '50,000đ', '40,000đ', '30,000đ', '50,000đ', '60,000đ'];
const shuffledPrizes = [...prizes].sort(() => Math.random() - 0.5); // Xáo trộn phần thưởng
let remainingPrizes = [...shuffledPrizes];
let hasClicked = false; // Biến kiểm tra đã bấm hay chưa

const container = document.getElementById('lixi-container');

// Tạo 10 ô lì xì
for (let i = 0; i < 10; i++) {
    const button = document.createElement('button');
    button.className = 'lixi';
    button.textContent = 'Lì Xì ' + (i + 1);
    button.onclick = () => openLixi(button);
    container.appendChild(button);
}

function openLixi(button) {
    if (button.classList.contains('disabled') || hasClicked) return; // Ngăn bấm nhiều lần

    // Lấy phần thưởng ngẫu nhiên không trùng
    const prize = remainingPrizes.pop();

    button.textContent = prize;
    button.classList.add('disabled');
    button.style.cursor = 'not-allowed';

    hasClicked = true; // Đánh dấu người chơi đã bấm
    showPopup(`Chúc mừng bạn nhận được ${prize}!`);

    setTimeout(() => {
        window.location.href = 'index.html';
    }, 4000); // Chuyển hướng sau 4 giây
}

function showPopup(message) {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    const popupMessage = document.getElementById('popup-message');

    popupMessage.textContent = message;
    popup.style.display = 'block';
    overlay.style.display = 'block';
}

function closePopup() {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');

    popup.style.display = 'none';
    overlay.style.display = 'none';
}