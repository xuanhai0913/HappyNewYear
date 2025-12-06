const API_BASE_URL = window.location.origin;

// Hàm format tiền VND
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
    
    let html = '<h3><i class="fas fa-trophy"></i> Top 10 Người May Mắn Nhất</h3><div class="leaderboard-list">';
    
    if (leaderboard.length === 0) {
        html += '<p style="text-align: center; color: #ccc;">Chưa có người chơi nào. Hãy là người đầu tiên!</p>';
    } else {
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
    }
    
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
        <h3><i class="fas fa-chart-bar"></i> Thống Kê Lì Xì</h3>
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

async function giveLuckyMoney() {
    const playerName = document.getElementById("playerName").value.trim();
    const ageGroup = document.getElementById("age").value;
    
    // Validate
    if (!playerName) {
        alert("Vui lòng nhập tên của bạn!");
        return;
    }
    
    if (!ageGroup) {
        alert("Vui lòng chọn độ tuổi!");
        return;
    }
    
    // Hiển thị hiệu ứng pháo hoa
    const fireworks = document.getElementById("fireworks");
    const lixiButton = document.getElementById("lixi-button");
    const amountText = document.getElementById("lixi-amount");

    // Tạo số tiền ngẫu nhiên
    const amounts = [10000, 20000, 50000, 100000, 200000, 500000, 1000000];
    let money = amounts[Math.floor(Math.random() * amounts.length)];

    // Hiển thị số tiền nhận được
    amountText.innerHTML = `🎉 Chúc mừng <strong>${playerName}</strong>!<br>Bạn nhận được: <span class="lixi-amount">${formatMoney(money)}</span>`;

    // Ẩn nút nhận lì xì
    lixiButton.disabled = true;
    lixiButton.innerHTML = '<span class="golden-text">Đã nhận lì xì</span>';
    
    const celebrationGif = document.getElementById("celebrationGif");
    celebrationGif.classList.remove("hidden");

    // Tắt hiệu ứng pháo hoa sau khi nhận lì xì
    fireworks.style.display = "none";
    
    // Lưu vào database
    const result = await saveLixiToDatabase(playerName, money, ageGroup);
    
    if (result.success) {
        // Reload bảng xếp hạng và thống kê
        setTimeout(() => {
            loadLeaderboard();
            loadStats();
        }, 500);
        
        // Hiển thị thông báo xếp hạng
        if (result.rank) {
            setTimeout(() => {
                amountText.innerHTML += `<br><small style="color: #FFD700;">🏆 Bạn đang xếp hạng #${result.rank} trong bảng xếp hạng!</small>`;
            }, 1000);
        }
    }
}

// Load dữ liệu khi trang được tải
window.addEventListener('DOMContentLoaded', function() {
    loadLeaderboard();
    loadStats();
});
    //<![CDATA[
        var pictureSrc = "../img/coin.png"; //Link ảnh hoa muốn hiển thị trên web
        var pictureWidth = 35; //Chiều rộng của hoa mai or đào
        var pictureHeight = 35; //Chiều cao của hoa mai or đào
        var numFlakes = 20; //Số bông hoa xuất hiện cùng một lúc trên trang web
        var downSpeed = 0.02; //Tốc độ rơi của hoa
        var lrFlakes = 10; //Tốc độ các bông hoa giao động từ bên trai sang bên phải và ngược lại
    
    
        if (typeof (numFlakes) != 'number' || Math.round(numFlakes) != numFlakes || numFlakes < 1) {
          numFlakes = 10;
        }
    
        //draw the snowflakes
        for (var x = 0; x < numFlakes; x++) {
          if (document.layers) { //releave NS4 bug
            document.write('<layer id="snFlkDiv' + x + '"><imgsrc="' + pictureSrc + '" height="' + pictureHeight + '"width="' + pictureWidth + '" alt="*" border="0"></layer>');
          } else {
            document.write('<div style="position:absolute; z-index:9999;"id="snFlkDiv' + x + '"><img src="' + pictureSrc + '"height="' + pictureHeight + '" width="' + pictureWidth + '" alt="*"border="0"></div>');
          }
        }
    
        //calculate initial positions (in portions of browser window size)
        var xcoords = new Array(),
          ycoords = new Array(),
          snFlkTemp;
        for (var x = 0; x < numFlakes; x++) {
          xcoords[x] = (x + 1) / (numFlakes + 1);
          do {
            snFlkTemp = Math.round((numFlakes - 1) * Math.random());
          } while (typeof (ycoords[snFlkTemp]) == 'number');
          ycoords[snFlkTemp] = x / numFlakes;
        }
    
        //now animate
        function flakeFall() {
          if (!getRefToDivNest('snFlkDiv0')) {
            return;
          }
          var scrWidth = 0,
            scrHeight = 0,
            scrollHeight = 0,
            scrollWidth = 0;
          //find screen settings for all variations. doing this every time allows for resizing and scrolling
          if (typeof (window.innerWidth) == 'number') {
            scrWidth = window.innerWidth;
            scrHeight = window.innerHeight;
          } else {
            if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
              scrWidth = document.documentElement.clientWidth;
              scrHeight = document.documentElement.clientHeight;
            } else {
              if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
                scrWidth = document.body.clientWidth;
                scrHeight = document.body.clientHeight;
              }
            }
          }
          if (typeof (window.pageYOffset) == 'number') {
            scrollHeight = pageYOffset;
            scrollWidth = pageXOffset;
          } else {
            if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
              scrollHeight = document.body.scrollTop;
              scrollWidth = document.body.scrollLeft;
            } else {
              if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
                scrollHeight = document.documentElement.scrollTop;
                scrollWidth = document.documentElement.scrollLeft;
              }
            }
          }
          //move the snowflakes to their new position
          for (var x = 0; x < numFlakes; x++) {
            if (ycoords[x] * scrHeight > scrHeight - pictureHeight) {
              ycoords[x] = 0;
            }
            var divRef = getRefToDivNest('snFlkDiv' + x);
            if (!divRef) {
              return;
            }
            if (divRef.style) {
              divRef = divRef.style;
            }
            var oPix = document.childNodes ? 'px' : 0;
            divRef.top = (Math.round(ycoords[x] * scrHeight) + scrollHeight) + oPix;
            divRef.left = (Math.round(((xcoords[x] * scrWidth) - (pictureWidth / 2)) + ((scrWidth / ((numFlakes + 1) * 4)) * (Math.sin(lrFlakes * ycoords[x]) - Math.sin(3 * lrFlakes * ycoords[x])))) + scrollWidth) + oPix;
            ycoords[x] += downSpeed;
          }
        }
    
        //DHTML handlers
        function getRefToDivNest(divName) {
          if (document.layers) {
            return document.layers[divName];
          } //NS4
          if (document[divName]) {
            return document[divName];
          } //NS4 also
          if (document.getElementById) {
            return document.getElementById(divName);
          } //DOM (IE5+, NS6+, Mozilla0.9+, Opera)
          if (document.all) {
            return document.all[divName];
          } //Proprietary DOM - IE4
          return false;
        }
    
        window.setInterval('flakeFall();', 100);
      //]]>
    