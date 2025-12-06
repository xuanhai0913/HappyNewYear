// API để đếm số người truy cập
// Sử dụng Redis để lưu trữ

import Redis from 'ioredis';

// Tạo Redis client
const redis = new Redis(process.env.REDIS_URL);

export default async function handler(req, res) {
  // Cho phép CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  
  try {
    if (req.method === 'GET') {
      // Lấy số lượt truy cập
      const count = parseInt(await redis.get('visitor_count') || '0');
      const today = parseInt(await redis.get('visitor_today') || '0');
      const lastReset = await redis.get('last_reset') || new Date().toDateString();
      
      // Reset số lượt hôm nay nếu qua ngày mới
      const currentDate = new Date().toDateString();
      if (lastReset !== currentDate) {
        await redis.set('visitor_today', 0);
        await redis.set('last_reset', currentDate);
      }
      
      return res.status(200).json({
        total: count,
        today: today,
        success: true
      });
    }
    
    if (req.method === 'POST') {
      // Tăng số lượt truy cập
      const total = await redis.incr('visitor_count');
      const today = await redis.incr('visitor_today');
      
      return res.status(200).json({
        total,
        today,
        success: true
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
