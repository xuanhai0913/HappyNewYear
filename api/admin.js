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

    try {
        // GET - Get lixi amounts
        if (req.method === 'GET') {
            const action = req.query.action;

            if (action === 'getLixiAmounts') {
                const amountsStr = await redisClient.get('lixi_amounts');
                const amounts = amountsStr
                    ? JSON.parse(amountsStr)
                    : [10000, 20000, 50000, 100000, 200000, 500000, 1000000];

                return res.status(200).json({
                    success: true,
                    amounts: amounts
                });
            }

            return res.status(400).json({ error: 'Invalid action' });
        }

        // POST - Admin actions
        if (req.method === 'POST') {
            const { action, count, amounts, userId } = req.body;

            // Update visitor count
            if (action === 'updateVisitorCount') {
                if (typeof count !== 'number' || count < 0) {
                    return res.status(400).json({ error: 'Invalid count' });
                }

                await redisClient.set('visitor_count', count);

                return res.status(200).json({
                    success: true,
                    message: 'Visitor count updated',
                    count: count
                });
            }

            // Update lixi amounts
            if (action === 'updateLixiAmounts') {
                if (!Array.isArray(amounts) || amounts.length === 0) {
                    return res.status(400).json({ error: 'Invalid amounts' });
                }

                const validAmounts = amounts.filter(a => typeof a === 'number' && a > 0);
                if (validAmounts.length === 0) {
                    return res.status(400).json({ error: 'No valid amounts' });
                }

                await redisClient.set('lixi_amounts', JSON.stringify(validAmounts));

                return res.status(200).json({
                    success: true,
                    message: 'Lixi amounts updated',
                    amounts: validAmounts
                });
            }

            // Delete user from leaderboard
            if (action === 'deleteUser') {
                if (!userId) {
                    return res.status(400).json({ error: 'Missing userId' });
                }

                // Get current leaderboard
                const leaderboardStr = await redisClient.get('lixi_leaderboard');
                if (!leaderboardStr) {
                    return res.status(404).json({ error: 'Leaderboard not found' });
                }

                let leaderboard = JSON.parse(leaderboardStr);
                const userToDelete = leaderboard.find(u => String(u.id) === String(userId));

                if (!userToDelete) {
                    return res.status(404).json({ error: 'User not found' });
                }

                // Remove user from leaderboard
                leaderboard = leaderboard.filter(u => String(u.id) !== String(userId));
                await redisClient.set('lixi_leaderboard', JSON.stringify(leaderboard));

                // Update statistics
                const statsStr = await redisClient.get('lixi_stats');
                let stats = statsStr ? JSON.parse(statsStr) : {
                    total_lixi_given: 0,
                    total_amount_given: 0,
                    total_players: 0
                };

                stats.total_lixi_given = Math.max(0, stats.total_lixi_given - 1);
                stats.total_amount_given = Math.max(0, stats.total_amount_given - userToDelete.amount);
                stats.total_players = leaderboard.length;

                await redisClient.set('lixi_stats', JSON.stringify(stats));

                return res.status(200).json({
                    success: true,
                    message: 'User deleted',
                    userId: userId
                });
            }

            return res.status(400).json({ error: 'Invalid action' });
        }

        return res.status(405).json({ error: 'Method not allowed' });

    } catch (error) {
        console.error('Admin API Error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};
