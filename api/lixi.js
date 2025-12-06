// API để quản lý lì xì với database
// Lưu trữ lịch sử nhận lì xì, top người may mắn

import Redis from 'ioredis';

// Tạo Redis client
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  try {
    if (req.method === 'GET') {
      // Lấy top người may mắn
      const action = req.query.action;
      
      if (action === 'leaderboard') {
        const data = await redis.get('lixi_leaderboard');
        const leaderboard = data ? JSON.parse(data) : [];
        return res.status(200).json({
          leaderboard: leaderboard.slice(0, 10), // Top 10
          success: true
        });
      }
      
      if (action === 'stats') {
        const totalLixi = parseInt(await redis.get('total_lixi_given') || '0');
        const totalAmount = parseInt(await redis.get('total_amount_given') || '0');
        const players = parseInt(await redis.get('total_players') || '0');
        
        return res.status(200).json({
          totalLixi,
          totalAmount,
          players,
          success: true
        });
      }
      
      return res.status(400).json({ error: 'Invalid action' });
    }
    
    if (req.method === 'POST') {
      const { name, amount, ageGroup } = req.body;
      
      if (!name || !amount) {
        return res.status(400).json({ 
          error: 'Missing required fields: name and amount' 
        });
      }
      
      // Lưu vào leaderboard
      const data = await redis.get('lixi_leaderboard');
      const leaderboard = data ? JSON.parse(data) : [];
      const timestamp = new Date().toISOString();
      
      const entry = {
        name,
        amount,
        ageGroup: ageGroup || 'unknown',
        timestamp,
        id: Date.now()
      };
      
      leaderboard.push(entry);
      // Sắp xếp theo số tiền giảm dần
      leaderboard.sort((a, b) => b.amount - a.amount);
      
      await redis.set('lixi_leaderboard', JSON.stringify(leaderboard));
      
      // Cập nhật thống kê
      await redis.incr('total_lixi_given');
      const totalAmount = parseInt(await redis.get('total_amount_given') || '0');
      await redis.set('total_amount_given', totalAmount + amount);
      
      // Đếm số người chơi unique (đơn giản hóa)
      await redis.incr('total_players');
      
      return res.status(200).json({
        success: true,
        entry,
        rank: leaderboard.findIndex(e => e.id === entry.id) + 1
      });
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
