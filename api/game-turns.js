const Redis = require('ioredis');

// Singleton Redis connection
let redis;

function getRedis() {
    if (!redis) {
        redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            maxRetriesPerRequest: 3,
            retryStrategy(times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            }
        });

        redis.on('error', (err) => {
            console.error('Redis Client Error:', err);
        });
    }
    return redis;
}

// Get client IP from request
function getClientIP(req) {
    return req.headers['x-forwarded-for']?.split(',')[0] || 
           req.headers['x-real-ip'] || 
           req.socket.remoteAddress || 
           'unknown';
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const redisClient = getRedis();
    const clientIP = getClientIP(req);

    try {
        // GET - Check available turns
        if (req.method === 'GET') {
            const action = req.query.action;

            // Check lixi turns
            if (action === 'checkLixiTurns') {
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const lixiKey = `lixi_limit:${clientIP}:${today}`;
                
                const hasUsed = await redisClient.get(lixiKey);
                
                if (hasUsed) {
                    return res.status(200).json({
                        canPlay: false,
                        turnsLeft: 0,
                        message: 'Bạn đã rút lì xì hôm nay rồi! Quay lại vào ngày mai nhé 🧧',
                        nextReset: new Date(new Date().setHours(24, 0, 0, 0)).toISOString()
                    });
                }

                // Check extra turns from KBB wins
                const extraTurnsKey = `kbb_extra_turns:${clientIP}`;
                const extraTurns = parseInt(await redisClient.get(extraTurnsKey) || '0');

                return res.status(200).json({
                    canPlay: true,
                    turnsLeft: 1 + extraTurns,
                    extraTurns: extraTurns,
                    message: extraTurns > 0 ? `Bạn có ${extraTurns} lượt thêm từ Kéo Búa Bao!` : 'Bạn có 1 lượt rút lì xì hôm nay'
                });
            }

            // Check KBB ban status
            if (action === 'checkKBBBan') {
                const banKey = `kbb_ban:${clientIP}`;
                const banUntil = await redisClient.get(banKey);

                if (banUntil) {
                    const banTime = new Date(banUntil);
                    const now = new Date();

                    if (now < banTime) {
                        const minutesLeft = Math.ceil((banTime - now) / 60000);
                        return res.status(200).json({
                            isBanned: true,
                            banUntil: banUntil,
                            minutesLeft: minutesLeft,
                            message: `Bạn đã thua! Bị cấm chơi trong ${minutesLeft} phút 🚫`
                        });
                    } else {
                        // Ban expired, remove it
                        await redisClient.del(banKey);
                    }
                }

                return res.status(200).json({
                    isBanned: false,
                    message: 'Bạn có thể chơi Kéo Búa Bao!'
                });
            }

            return res.status(400).json({ error: 'Invalid action' });
        }

        // POST - Use turn or update status
        if (req.method === 'POST') {
            const { action } = req.body;

            // Use lixi turn
            if (action === 'useLixiTurn') {
                const today = new Date().toISOString().split('T')[0];
                const lixiKey = `lixi_limit:${clientIP}:${today}`;
                
                const hasUsed = await redisClient.get(lixiKey);
                if (hasUsed) {
                    return res.status(403).json({
                        success: false,
                        error: 'Đã hết lượt',
                        message: 'Bạn đã rút lì xì hôm nay rồi!'
                    });
                }

                // Check extra turns
                const extraTurnsKey = `kbb_extra_turns:${clientIP}`;
                const extraTurns = parseInt(await redisClient.get(extraTurnsKey) || '0');

                if (extraTurns > 0) {
                    // Use extra turn
                    await redisClient.decr(extraTurnsKey);
                    return res.status(200).json({
                        success: true,
                        turnUsed: 'extra',
                        turnsLeft: extraTurns - 1,
                        message: 'Đã sử dụng lượt thêm từ Kéo Búa Bao!'
                    });
                } else {
                    // Use daily turn
                    await redisClient.set(lixiKey, '1', 'EX', 86400); // 24 hours
                    return res.status(200).json({
                        success: true,
                        turnUsed: 'daily',
                        turnsLeft: 0,
                        message: 'Đã sử dụng lượt rút hôm nay!'
                    });
                }
            }

            // KBB Win - Add extra turn
            if (action === 'kbbWin') {
                const extraTurnsKey = `kbb_extra_turns:${clientIP}`;
                const newTurns = await redisClient.incr(extraTurnsKey);
                await redisClient.expire(extraTurnsKey, 86400); // Expire after 24 hours

                return res.status(200).json({
                    success: true,
                    extraTurns: newTurns,
                    message: `Chúc mừng! Bạn nhận được 1 lượt rút lì xì thêm! (Tổng: ${newTurns} lượt)`
                });
            }

            // KBB Loss - Ban for 15 minutes
            if (action === 'kbbLoss') {
                const banKey = `kbb_ban:${clientIP}`;
                const banUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
                
                await redisClient.set(banKey, banUntil.toISOString(), 'EX', 900); // 15 minutes in seconds

                return res.status(200).json({
                    success: true,
                    banned: true,
                    banUntil: banUntil.toISOString(),
                    minutesLeft: 15,
                    message: 'Bạn đã thua! Bị cấm chơi trong 15 phút 🚫'
                });
            }

            return res.status(400).json({ error: 'Invalid action' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Game Turns API Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};
