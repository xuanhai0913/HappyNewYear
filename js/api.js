// API Helper - Kết nối với Vercel Serverless Functions

const API_BASE_URL = window.location.origin;

// Visitor Counter API
export const visitorAPI = {
  // Lấy số lượt truy cập
  async getCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visitor-count`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching visitor count:', error);
      return { total: 0, today: 0, success: false };
    }
  },
  
  // Tăng số lượt truy cập
  async incrementCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/visitor-count`, {
        method: 'POST'
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error incrementing visitor count:', error);
      return { success: false };
    }
  }
};

// Lixi API
export const lixiAPI = {
  // Lưu lì xì vào database
  async saveLixi(name, amount, ageGroup) {
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
  },
  
  // Lấy bảng xếp hạng
  async getLeaderboard() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lixi?action=leaderboard`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return { leaderboard: [], success: false };
    }
  },
  
  // Lấy thống kê
  async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/lixi?action=stats`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      return { totalLixi: 0, totalAmount: 0, players: 0, success: false };
    }
  }
};

// Hàm khởi tạo khi load trang
export async function initializeApp() {
  // Kiểm tra xem đã đếm lượt truy cập chưa (dùng sessionStorage)
  const hasVisited = sessionStorage.getItem('has_visited');
  
  if (!hasVisited) {
    // Tăng số lượt truy cập
    await visitorAPI.incrementCount();
    sessionStorage.setItem('has_visited', 'true');
  }
  
  // Hiển thị số lượt truy cập
  updateVisitorDisplay();
}

// Cập nhật hiển thị số lượt truy cập
export async function updateVisitorDisplay() {
  const data = await visitorAPI.getCount();
  
  const visitorElement = document.getElementById('visitor-count');
  if (visitorElement && data.success) {
    visitorElement.innerHTML = `
      <i class="fas fa-eye"></i> 
      <span>Lượt xem: <strong>${formatNumber(data.total)}</strong></span>
    `;
  }
}

// Format số với dấu phẩy
function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
