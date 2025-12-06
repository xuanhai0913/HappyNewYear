// Import API helper (sẽ được thêm vào HTML)
const API_BASE_URL = window.location.origin;

// Hàm random số tiền lì xì
function getRandomLixiAmount() {
    const amounts = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];
    return amounts[Math.floor(Math.random() * amounts.length)];
}

// Hàm format tiền
function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Hàm lưu lì xì vào database
async function saveLixiToDatabase(name, amount, ageGroup) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/lixi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, amount, ageGroup })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error saving lixi:', error);
        return { success: false };
    }
}

// Hàm load bảng xếp hạng
async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/lixi?action=leaderboard`);
        const data = await response.json();
        
        if (data.success && data.leaderboard) {
            displayLeaderboard(data.leaderboard);
        }
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

// Hiển thị bảng xếp hạng
function displayLeaderboard(leaderboard) {
    const leaderboardDiv = document.getElementById('leaderboard');
    if (!leaderboardDiv) return;
    
    let html = '<h3>🏆 Top 10 Người May Mắn Nhất</h3><div class="leaderboard-list">';
    
    leaderboard.forEach((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        html += `
            <div class="leaderboard-item">
                <span class="rank">${medal}</span>
                <span class="name">${entry.name}</span>
                <span class="amount">${formatMoney(entry.amount)}</span>
            </div>
        `;
    });
    
    html += '</div>';
    leaderboardDiv.innerHTML = html;
}

// Hàm load thống kê
async function loadStats() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/lixi?action=stats`);
        const data = await response.json();
        
        if (data.success) {
            displayStats(data);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Hiển thị thống kê
function displayStats(stats) {
    const statsDiv = document.getElementById('lixi-stats');
    if (!statsDiv) return;
    
    statsDiv.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <i class="fas fa-gift"></i>
                <div class="stat-value">${stats.totalLixi || 0}</div>
                <div class="stat-label">Lì xì đã phát</div>
            </div>
            <div class="stat-item">
                <i class="fas fa-money-bill-wave"></i>
                <div class="stat-value">${formatMoney(stats.totalAmount || 0)}</div>
                <div class="stat-label">Tổng tiền</div>
            </div>
            <div class="stat-item">
                <i class="fas fa-users"></i>
                <div class="stat-value">${stats.players || 0}</div>
                <div class="stat-label">Người chơi</div>
            </div>
        </div>
    `;
}

document.getElementById("ageForm").addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngăn form tải lại trang
    
    const ageGroup = document.getElementById("age").value;
    const nameInput = document.getElementById("playerName");
    const playerName = nameInput ? nameInput.value.trim() : "Khách";
    const messageDiv = document.getElementById("message");
    
    // Random số tiền lì xì
    const lixiAmount = getRandomLixiAmount();
    
    let message = "";

    // Lời chúc tùy theo độ tuổi
    switch (ageGroup) {
        case "kid":
            message = `Chúc con ${playerName} năm mới học giỏi, ngoan ngoãn và luôn vui vẻ nhé!<br>🧧 Bạn nhận được: <strong class="lixi-amount">${formatMoney(lixiAmount)}</strong>`;
            break;
        case "teen":
            message = `Chúc bạn ${playerName} một năm mới nhiều thành công, luôn tràn đầy năng lượng!<br>🧧 Bạn nhận được: <strong class="lixi-amount">${formatMoney(lixiAmount)}</strong>`;
            break;
        case "adult":
            message = `Chúc bạn ${playerName} năm mới sức khỏe dồi dào, sự nghiệp thăng tiến!<br>🧧 Bạn nhận được: <strong class="lixi-amount">${formatMoney(lixiAmount)}</strong>`;
            break;
        case "senior":
            message = `Chúc bác/cụ ${playerName} năm mới an khang, thịnh vượng và sống lâu trăm tuổi!<br>🧧 Bạn nhận được: <strong class="lixi-amount">${formatMoney(lixiAmount)}</strong>`;
            break;
        default:
            message = `Chúc ${playerName} mừng năm mới! Hãy luôn vui vẻ và hạnh phúc!<br>🧧 Bạn nhận được: <strong class="lixi-amount">${formatMoney(lixiAmount)}</strong>`;
    }

    // Hiển thị lời chúc
    messageDiv.innerHTML = message;
    messageDiv.classList.remove("hidden");
    
    // Lưu vào database
    if (playerName !== "Khách") {
        const result = await saveLixiToDatabase(playerName, lixiAmount, ageGroup);
        
        if (result.success) {
            // Reload bảng xếp hạng và thống kê
            setTimeout(() => {
                loadLeaderboard();
                loadStats();
            }, 500);
            
            // Hiển thị thông báo xếp hạng
            if (result.rank) {
                setTimeout(() => {
                    messageDiv.innerHTML += `<br><small>🎉 Bạn đang xếp hạng #${result.rank} trong bảng xếp hạng!</small>`;
                }, 1000);
            }
        }
    }
});

// Load dữ liệu khi trang được tải
window.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
    loadStats();
});