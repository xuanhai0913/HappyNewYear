// Admin Panel JavaScript
const ADMIN_PASSWORD = 'xuanhai0913';
const API_BASE_URL = window.location.origin;

// Check if already logged in
window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = sessionStorage.getItem('admin_logged_in');
    if (isLoggedIn === 'true') {
        showAdminPanel();
        loadAdminData();
    }
});

// Login Form
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password').value;
    
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('admin_logged_in', 'true');
        showAdminPanel();
        loadAdminData();
    } else {
        document.getElementById('errorMessage').style.display = 'block';
        setTimeout(() => {
            document.getElementById('errorMessage').style.display = 'none';
        }, 3000);
    }
});

// Show Admin Panel
function showAdminPanel() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
}

// Logout
function logout() {
    sessionStorage.removeItem('admin_logged_in');
    window.location.reload();
}

// Load Admin Data
async function loadAdminData() {
    await Promise.all([
        loadStatistics(),
        loadUsers(),
        loadLixiAmounts()
    ]);
}

// Load Statistics
async function loadStatistics() {
    try {
        // Get visitor count
        const visitorRes = await fetch(`${API_BASE_URL}/api/visitor-count`);
        const visitorData = await visitorRes.json();
        
        // Get lixi stats
        const statsRes = await fetch(`${API_BASE_URL}/api/lixi?action=stats`);
        const statsData = await statsRes.json();
        
        // Update UI
        document.getElementById('totalViews').textContent = formatNumber(visitorData.total || 0);
        document.getElementById('totalLixi').textContent = formatNumber(statsData.totalLixi || 0);
        document.getElementById('totalAmount').textContent = formatMoney(statsData.totalAmount || 0);
        document.getElementById('totalPlayers').textContent = formatNumber(statsData.players || 0);
        
        // Set visitor count input
        document.getElementById('visitorCount').value = visitorData.total || 0;
    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/lixi?action=leaderboard`);
        const data = await response.json();
        
        const userList = document.getElementById('userList');
        if (data.leaderboard && data.leaderboard.length > 0) {
            userList.innerHTML = data.leaderboard.map(user => `
                <div class="user-item">
                    <div class="user-info">
                        <div class="user-name">${user.name}</div>
                        <div class="user-details">
                            ${formatMoney(user.amount)} - ${getAgeGroupLabel(user.ageGroup)} - ${formatDate(user.timestamp)}
                        </div>
                    </div>
                    <button class="btn btn-danger" onclick="deleteUser('${user.id}', '${user.name}')">
                        <i class="fas fa-trash"></i> Xóa
                    </button>
                </div>
            `).join('');
        } else {
            userList.innerHTML = '<p style="text-align: center; color: #ccc;">Chưa có người dùng nào</p>';
        }
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('userList').innerHTML = '<p style="text-align: center; color: #ff4444;">Lỗi tải dữ liệu</p>';
    }
}

// Load Lixi Amounts
async function loadLixiAmounts() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin?action=getLixiAmounts`);
        const data = await response.json();
        
        if (data.success && data.amounts) {
            const amounts = data.amounts.join(', ');
            document.getElementById('currentAmounts').textContent = amounts;
            document.getElementById('lixiAmounts').value = amounts;
        }
    } catch (error) {
        console.error('Error loading lixi amounts:', error);
    }
}

// Update Visitor Count
document.getElementById('visitorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const count = parseInt(document.getElementById('visitorCount').value);
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: 'updateVisitorCount',
                count: count
            })
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess('visitorSuccess');
            loadStatistics();
        }
    } catch (error) {
        console.error('Error updating visitor count:', error);
        alert('Lỗi cập nhật lượt xem!');
    }
});

// Update Lixi Amounts
document.getElementById('lixiAmountsForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const amountsStr = document.getElementById('lixiAmounts').value;
    const amounts = amountsStr.split(',').map(a => parseInt(a.trim())).filter(a => !isNaN(a) && a > 0);
    
    if (amounts.length === 0) {
        alert('Vui lòng nhập mệnh giá hợp lệ!');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: 'updateLixiAmounts',
                amounts: amounts
            })
        });
        
        const data = await response.json();
        if (data.success) {
            showSuccess('lixiSuccess');
            loadLixiAmounts();
        }
    } catch (error) {
        console.error('Error updating lixi amounts:', error);
        alert('Lỗi cập nhật mệnh giá!');
    }
});

// Delete User
async function deleteUser(userId, userName) {
    if (!confirm(`Bạn có chắc muốn xóa "${userName}"?`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/admin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                action: 'deleteUser',
                userId: userId
            })
        });
        
        const data = await response.json();
        if (data.success) {
            alert('Đã xóa người dùng!');
            loadUsers();
            loadStatistics();
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Lỗi xóa người dùng!');
    }
}

// Helper Functions
function showSuccess(elementId) {
    const element = document.getElementById(elementId);
    element.style.display = 'block';
    setTimeout(() => {
        element.style.display = 'none';
    }, 3000);
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function formatMoney(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleString('vi-VN');
}

function getAgeGroupLabel(ageGroup) {
    const labels = {
        'kid': 'Trẻ em',
        'teen': 'Thiếu niên',
        'adult': 'Người lớn',
        'senior': 'Cao tuổi'
    };
    return labels[ageGroup] || 'Không rõ';
}
