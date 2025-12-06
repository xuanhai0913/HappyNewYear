// Test script for API endpoints (local development)
// Run: node test-api.js

const API_BASE_URL = 'http://localhost:3000'; // Vercel dev server

async function testVisitorCount() {
    console.log('\n🧪 Testing Visitor Count API...\n');
    
    try {
        // Test GET
        console.log('1. GET /api/visitor-count');
        let response = await fetch(`${API_BASE_URL}/api/visitor-count`);
        let data = await response.json();
        console.log('   ✅ Response:', data);
        
        // Test POST
        console.log('\n2. POST /api/visitor-count');
        response = await fetch(`${API_BASE_URL}/api/visitor-count`, {
            method: 'POST'
        });
        data = await response.json();
        console.log('   ✅ Response:', data);
        
        // Test GET again
        console.log('\n3. GET /api/visitor-count (after increment)');
        response = await fetch(`${API_BASE_URL}/api/visitor-count`);
        data = await response.json();
        console.log('   ✅ Response:', data);
        
    } catch (error) {
        console.error('   ❌ Error:', error.message);
    }
}

async function testLixiAPI() {
    console.log('\n🧪 Testing Lixi API...\n');
    
    try {
        // Test save lixi
        console.log('1. POST /api/lixi (save lucky money)');
        let response = await fetch(`${API_BASE_URL}/api/lixi`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User ' + Date.now(),
                amount: 500000,
                ageGroup: 'adult'
            })
        });
        let data = await response.json();
        console.log('   ✅ Response:', data);
        
        // Test leaderboard
        console.log('\n2. GET /api/lixi?action=leaderboard');
        response = await fetch(`${API_BASE_URL}/api/lixi?action=leaderboard`);
        data = await response.json();
        console.log('   ✅ Response:', {
            success: data.success,
            count: data.leaderboard?.length,
            top3: data.leaderboard?.slice(0, 3)
        });
        
        // Test stats
        console.log('\n3. GET /api/lixi?action=stats');
        response = await fetch(`${API_BASE_URL}/api/lixi?action=stats`);
        data = await response.json();
        console.log('   ✅ Response:', data);
        
    } catch (error) {
        console.error('   ❌ Error:', error.message);
    }
}

async function runTests() {
    console.log('═══════════════════════════════════════════════════');
    console.log('    🎆 HAPPY NEW YEAR 2026 - API TESTING');
    console.log('═══════════════════════════════════════════════════');
    
    console.log('\n⚠️  Make sure Vercel dev server is running:');
    console.log('   npm install');
    console.log('   vercel dev');
    console.log('\n');
    
    await testVisitorCount();
    await testLixiAPI();
    
    console.log('\n═══════════════════════════════════════════════════');
    console.log('    ✅ All tests completed!');
    console.log('═══════════════════════════════════════════════════\n');
}

// Run tests
runTests().catch(console.error);
