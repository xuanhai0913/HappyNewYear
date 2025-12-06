// Test Redis connection
// Run: node test-redis.js

import Redis from 'ioredis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const redis = new Redis(process.env.REDIS_URL);

async function testRedis() {
    console.log('═══════════════════════════════════════════════');
    console.log('    🧪 TESTING REDIS CONNECTION');
    console.log('═══════════════════════════════════════════════\n');

    try {
        // Test 1: Ping
        console.log('1. Testing connection (PING)...');
        const pong = await redis.ping();
        console.log('   ✅ Response:', pong);

        // Test 2: Set value
        console.log('\n2. Setting test value...');
        await redis.set('test_key', 'Hello from Redis!');
        console.log('   ✅ Value set successfully');

        // Test 3: Get value
        console.log('\n3. Getting test value...');
        const value = await redis.get('test_key');
        console.log('   ✅ Retrieved:', value);

        // Test 4: Increment
        console.log('\n4. Testing increment...');
        await redis.set('test_counter', 0);
        const count1 = await redis.incr('test_counter');
        const count2 = await redis.incr('test_counter');
        console.log('   ✅ Counter:', count1, '→', count2);

        // Test 5: JSON data
        console.log('\n5. Testing JSON storage...');
        const testData = { name: 'Test User', amount: 100000 };
        await redis.set('test_json', JSON.stringify(testData));
        const retrieved = JSON.parse(await redis.get('test_json'));
        console.log('   ✅ Retrieved:', retrieved);

        // Test 6: Check existing data
        console.log('\n6. Checking existing app data...');
        const visitorCount = await redis.get('visitor_count');
        const lixiData = await redis.get('lixi_leaderboard');
        console.log('   - visitor_count:', visitorCount || 'Not set');
        console.log('   - lixi_leaderboard:', lixiData ? 'Exists' : 'Not set');

        // Cleanup
        console.log('\n7. Cleaning up test keys...');
        await redis.del('test_key', 'test_counter', 'test_json');
        console.log('   ✅ Cleanup complete');

        console.log('\n═══════════════════════════════════════════════');
        console.log('    ✅ ALL TESTS PASSED!');
        console.log('    Redis is working correctly!');
        console.log('═══════════════════════════════════════════════\n');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
        console.error('\nTroubleshooting:');
        console.error('1. Check REDIS_URL in .env file');
        console.error('2. Verify Redis server is running');
        console.error('3. Check network connection');
    } finally {
        redis.disconnect();
    }
}

testRedis();
