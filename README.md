# 🎆 Happy New Year 2026 - HaiLamDev

[![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Website chúc Tết với các trò chơi thú vị, tính năng lì xì may mắn và database để lưu trữ!

🌐 **Live Demo:** [https://happynewyear.hailamdev.space/](https://happynewyear.hailamdev.space/)

---

## ✨ Tính Năng

### 🎮 Trò Chơi
- 🧧 **Lì xì may mắn** - Nhận lì xì với số tiền ngẫu nhiên
  - 🔒 Giới hạn **1 lượt/ngày** (theo IP)
  - 🎁 Nhận lượt thêm từ game Kéo Búa Bao
  
- ✊ **Kéo Búa Bao** - Trò chơi oẳn tù tì với phần thưởng và hình phạt
  - ✅ **Thắng** → +1 lượt rút lì xì (tự động chuyển trang)
  - ❌ **Thua** → Bị cấm chơi 15 phút
  - 🤝 **Hòa** → Tiếp tục chơi

### 📊 Tính Năng Database
- 👥 **Đếm người truy cập** - Thống kê lượt truy cập website
- 🏆 **Bảng xếp hạng** - Top 10 người may mắn nhất
- 📈 **Thống kê real-time** - Tổng lì xì, tổng tiền, số người chơi
- 💾 **Lưu lịch sử** - Tất cả lượt nhận lì xì được lưu trữ
- 🎯 **Xếp hạng cá nhân** - Xem vị trí của bạn sau khi nhận lì xì
- 🎮 **Quản lý lượt chơi** - Giới hạn theo IP, theo ngày
- ⏰ **Hệ thống ban** - Tự động khóa/mở khóa người chơi
- 🔑 **Admin Panel** - Quản lý visitor count, lixi amounts, users

---

## 🚀 Quick Start

### Deploy lên Vercel (5 phút)

```powershell
# 1. Cài dependencies
npm install

# 2. Deploy
npm i -g vercel
vercel login
vercel --prod

# 3. Tạo KV database trên Vercel Dashboard
#    Storage → Create Database → KV (Redis)

# 4. Redeploy
vercel --prod
```

📖 **Hướng dẫn chi tiết:** Xem [QUICKSTART.md](QUICKSTART.md) hoặc [CHECKLIST.txt](CHECKLIST.txt)

---

## 📁 Cấu Trúc Project

```
HappyNewYear/
├── 📁 api/                    # Vercel Serverless Functions
│   ├── visitor-count.js       # API đếm lượt truy cập
│   └── lixi.js               # API quản lý lì xì
├── 📁 css/                    # Stylesheets
│   ├── style.css
│   ├── lixi.css
│   ├── game.css
│   └── database-features.css # Styles cho tính năng mới
├── 📁 js/                     # JavaScript files
│   ├── api.js                # API helper
│   ├── lixi.js               # Logic lì xì
│   ├── xh.js                 # Game lì xì
│   └── ...
├── 📁 img/                    # Images & assets
├── 📄 index.html             # Trang chủ
├── 📄 xh.html                # Trang game lì xì
├── 📄 vercel.json            # Cấu hình Vercel
├── 📄 package.json           # Dependencies
└── 📖 QUICKSTART.md          # Hướng dẫn deploy
```

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** Redis Cloud (ioredis)
- **CDN:** Vercel Global CDN
- **Deployment:** Vercel
- **Domain:** hailamdev.space

---

## 📊 API Endpoints

### Visitor Counter
- `GET /api/visitor-count` - Lấy số lượt truy cập
- `POST /api/visitor-count` - Tăng số lượt truy cập

### Lixi Management
- `GET /api/lixi?action=leaderboard` - Lấy bảng xếp hạng top 10
- `GET /api/lixi?action=stats` - Lấy thống kê
- `POST /api/lixi` - Lưu lì xì mới

📖 **Chi tiết API:** Xem [DEPLOY.md](DEPLOY.md#api-endpoints)

---

## 💾 Database Schema

Sử dụng **Vercel KV (Redis)** để lưu trữ:

```javascript
// Visitor tracking
visitor_count: number        // Tổng lượt truy cập
visitor_today: number        // Lượt truy cập hôm nay
last_reset: string          // Ngày reset cuối

// Lixi data
lixi_leaderboard: Array<{   // Danh sách người chơi
  id, name, amount, ageGroup, timestamp
}>
total_lixi_given: number    // Tổng số lì xì đã phát
total_amount_given: number  // Tổng số tiền đã phát
total_players: number       // Tổng số người chơi
```

---

## 🎨 Features Showcase

### Visitor Counter
```
┌─────────────────────────────────┐
│ 👥 Tổng: 1,234 | Hôm nay: 56   │
└─────────────────────────────────┘
```

### Leaderboard
```
🏆 Top 10 Người May Mắn Nhất
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🥇  Nguyen Van A     1,000,000₫
🥈  Tran Thi B        500,000₫
🥉  Le Van C          200,000₫
4.  Pham Thi D        100,000₫
...
```

### Statistics
```
┌──────────────┬──────────────┬──────────────┐
│   🎁 100     │  💰 50,000k  │   👥 75      │
│ Lì xì phát   │  Tổng tiền   │ Người chơi   │
└──────────────┴──────────────┴──────────────┘
```

---

## 🧪 Local Development

```powershell
# Install dependencies
npm install

# Run dev server (with Vercel KV mock)
vercel dev

# Open browser
http://localhost:3000

# Test API (optional)
node test-api.js
```

⚠️ **Lưu ý:** Local dev cần có Vercel KV. Để test nhanh, deploy lên Vercel.

---

## 📱 Responsive Design

✅ Desktop (1920x1080)  
✅ Laptop (1366x768)  
✅ Tablet (768x1024)  
✅ Mobile (375x667)

---

## 🔒 Security

- ✅ CORS enabled cho API
- ✅ Input validation và sanitization
- ✅ Error handling
- ✅ Rate limiting (Vercel built-in)
- ✅ Environment variables cho sensitive data

---

## 📈 Performance

- ⚡ **Serverless Functions** - Auto-scaling, pay-per-use
- 🌍 **Global CDN** - Fast delivery worldwide
- 💨 **Redis Cache** - Millisecond response time
- 📦 **Optimized Assets** - Minified CSS/JS

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Visitor counter không hiển thị | Kiểm tra đã tạo KV database |
| API trả về 500 | Xem logs: `vercel logs` |
| Bảng xếp hạng rỗng | Chơi game để thêm dữ liệu |
| Local dev không work | Dùng `vercel dev` thay vì local server |

📖 **Chi tiết:** Xem [CHECKLIST.txt](CHECKLIST.txt#troubleshooting-checklist)

---

## 🎯 Roadmap (Optional)

- [ ] Admin dashboard
- [ ] Export data to Excel
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Multi-language support
- [ ] Dark/Light theme
- [ ] Sound effects
- [ ] More game types

---

## 📄 Documentation

- 📖 [QUICKSTART.md](QUICKSTART.md) - Hướng dẫn deploy nhanh
- 📖 [DEPLOY.md](DEPLOY.md) - Hướng dẫn chi tiết
- 📋 [CHECKLIST.txt](CHECKLIST.txt) - Checklist deploy từng bước
- 📊 [ARCHITECTURE.txt](ARCHITECTURE.txt) - Sơ đồ kiến trúc
- 📝 [SUMMARY.md](SUMMARY.md) - Tóm tắt tính năng

---

## 👨‍💻 Author

**Nguyen Xuan Hai**

- 🌐 Website: [https://hailamdev.space/](https://hailamdev.space/)
- 💬 Zalo: 0929501116
- 📧 Email: [Thêm email của bạn]

---

## 📝 License

MIT License - Copyright © 2025 Nxhai

Tất cả các quyền được bảo lưu.

---

## 🙏 Acknowledgments

- Icons: [Font Awesome](https://fontawesome.com/)
- Hosting: [Vercel](https://vercel.com/)
- Database: [Vercel KV](https://vercel.com/docs/storage/vercel-kv)

---

<div align="center">

### 🎉 Chúc Mừng Năm Mới 2026! 🎉

**Made with ❤️ by HaiLamDev**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/xuanhai0913/HappyNewYear)

</div>