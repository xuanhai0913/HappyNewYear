/**
 * 🎆 BẮN PHÁO HOA TẾT - GAME ENGINE
 * Firework Shooting Game for Happy New Year 2026
 */

// ============ GAME CONFIGURATION ============
const CONFIG = {
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 550,

    // Firework settings
    FIREWORK_SPEED: 8,
    FIREWORK_SIZE: 6,
    PARTICLE_COUNT: 30,
    PARTICLE_LIFE: 60,

    // Target settings
    TARGET_SIZE: 55,
    TARGET_MIN_SPEED: 1,
    TARGET_MAX_SPEED: 2.5,

    // Power-up settings
    POWERUP_SIZE: 30,
    POWERUP_CHANCE: 0.08,          // 8% chance per spawn cycle
    BLAST_RADIUS: 120,

    // Scoring
    BASE_SCORE: 10,
    COMBO_MULTIPLIER: 0.5,         // Each combo adds 50%
    MAX_COMBO: 10,

    // Difficulty levels
    LEVELS: {
        1: {
            name: 'Dễ',
            duration: 30,
            spawnRate: 1200,
            targetSpeed: 1,
            targetGoal: 100,
            maxTargets: 6
        },
        2: {
            name: 'Thường',
            duration: 45,
            spawnRate: 900,
            targetSpeed: 1.5,
            targetGoal: 200,
            maxTargets: 8
        },
        3: {
            name: 'Khó',
            duration: 60,
            spawnRate: 600,
            targetSpeed: 2.2,
            targetGoal: 400,
            maxTargets: 12
        }
    }
};

// ============ GAME STATE ============
const gameState = {
    isRunning: false,
    isPaused: false,
    currentLevel: 1,
    score: 0,
    combo: 0,
    maxCombo: 0,
    timeLeft: 30,
    targetsHit: 0,
    totalShots: 0,
    hasBlast: false,

    fireworks: [],
    targets: [],
    particles: [],
    powerups: [],
    textPopups: [],

    lastUpdate: 0,
    lastSpawn: 0,
    timerInterval: null,
    animationId: null,

    mouseX: 0,
    mouseY: 0
};

// ============ GAME CLASSES ============

class Firework {
    constructor(x, y, targetX, targetY, isBlast = false) {
        this.x = x;
        this.y = y;
        this.isBlast = isBlast;

        // Calculate direction
        const angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(angle) * CONFIG.FIREWORK_SPEED;
        this.vy = Math.sin(angle) * CONFIG.FIREWORK_SPEED;

        this.size = CONFIG.FIREWORK_SIZE;
        this.trail = [];
        this.alive = true;
        this.color = isBlast
            ? `hsl(45, 100%, 60%)`
            : `hsl(${Math.random() * 360}, 80%, 60%)`;
    }

    update() {
        // Store trail
        this.trail.push({ x: this.x, y: this.y, alpha: 1 });
        if (this.trail.length > 12) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;

        // Fade trail
        for (const t of this.trail) {
            t.alpha -= 0.08;
        }

        // Out of bounds
        if (this.x < -20 || this.x > CONFIG.CANVAS_WIDTH + 20 ||
            this.y < -20 || this.y > CONFIG.CANVAS_HEIGHT + 20) {
            this.alive = false;
            // Missed shot resets combo
            gameState.combo = 0;
        }
    }

    draw(ctx) {
        // Draw trail
        for (const t of this.trail) {
            if (t.alpha <= 0) continue;
            ctx.globalAlpha = t.alpha * 0.6;
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(t.x, t.y, this.size * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw firework head
        ctx.globalAlpha = 1;
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

class LixiTarget {
    constructor(speedMultiplier = 1) {
        this.size = CONFIG.TARGET_SIZE;
        this.x = Math.random() * (CONFIG.CANVAS_WIDTH - this.size * 2) + this.size;
        this.y = -this.size;
        this.speed = (CONFIG.TARGET_MIN_SPEED + Math.random() * (CONFIG.TARGET_MAX_SPEED - CONFIG.TARGET_MIN_SPEED)) * speedMultiplier;
        this.rotation = 0;
        this.rotationSpeed = (Math.random() - 0.5) * 0.04;
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.wobbleSpeed = 0.02 + Math.random() * 0.02;
        this.wobbleAmp = 20 + Math.random() * 15;
        this.alive = true;
        this.value = 10;
        this.alpha = 1;
        this.pulse = Math.random() * Math.PI * 2;
    }

    update() {
        this.y += this.speed;
        this.rotation += this.rotationSpeed;
        this.wobblePhase += this.wobbleSpeed;
        this.pulse += 0.05;
        this.x += Math.sin(this.wobblePhase) * 0.8;

        // Off bottom
        if (this.y > CONFIG.CANVAS_HEIGHT + this.size) {
            this.alive = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const pulseScale = 1 + Math.sin(this.pulse) * 0.08;
        ctx.scale(pulseScale, pulseScale);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;

        // Outer glow
        ctx.shadowColor = '#dc2626';
        ctx.shadowBlur = 20;

        // Envelope body - red
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.rect(-this.size / 2, -this.size * 0.6, this.size, this.size * 1.2);
        ctx.fill();

        // Gold border
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(-this.size / 2, -this.size * 0.6, this.size, this.size * 1.2);
        ctx.stroke();

        // Gold flap (top triangle)
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(-this.size / 2, -this.size * 0.6);
        ctx.lineTo(this.size / 2, -this.size * 0.6);
        ctx.lineTo(0, -this.size * 0.15);
        ctx.closePath();
        ctx.fill();

        // Center gold circle with "Lộc" text
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(0, this.size * 0.15, this.size * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#dc2626';
        ctx.font = `bold ${this.size * 0.2}px "Baloo 2", Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('福', 0, this.size * 0.17);

        ctx.restore();
    }
}

class PowerUp {
    constructor() {
        this.size = CONFIG.POWERUP_SIZE;
        this.x = Math.random() * (CONFIG.CANVAS_WIDTH - 100) + 50;
        this.y = -this.size;
        this.speed = 1.5;
        this.alive = true;
        this.pulse = 0;
    }

    update() {
        this.y += this.speed;
        this.pulse += 0.1;

        if (this.y > CONFIG.CANVAS_HEIGHT + this.size) {
            this.alive = false;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);

        const scale = 1 + Math.sin(this.pulse) * 0.15;
        ctx.scale(scale, scale);

        // Glow
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 20;

        ctx.font = `${this.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⭐', 0, 0);

        ctx.shadowBlur = 0;
        ctx.restore();
    }
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color || `hsl(${Math.random() * 360}, 90%, 60%)`;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.gravity = 0.03;
        this.friction = 0.98;
        this.life = CONFIG.PARTICLE_LIFE;
        this.maxLife = this.life;
        this.size = Math.random() * 3 + 1;
    }

    update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

class TextPopup {
    constructor(x, y, text, color = '#fbbf24') {
        this.x = x;
        this.y = y;
        this.text = text;
        this.color = color;
        this.life = 60;
        this.maxLife = 60;
        this.vy = -2;
    }

    update() {
        this.y += this.vy;
        this.vy *= 0.95;
        this.life--;
    }

    draw(ctx) {
        const alpha = this.life / this.maxLife;
        const scale = 0.5 + alpha * 0.5;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.font = `bold ${18 * scale}px "Baloo 2", Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(this.text, this.x, this.y);
        ctx.restore();
    }
}

// ============ UTILITY ============
function roundRect(ctx, x, y, w, h, r) {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
}

function spawnExplosion(x, y, count = CONFIG.PARTICLE_COUNT, color = null) {
    const colors = ['#f472b6', '#bef264', '#fbbf24', '#60a5fa', '#c084fc', '#f87171'];
    for (let i = 0; i < count; i++) {
        const c = color || colors[Math.floor(Math.random() * colors.length)];
        gameState.particles.push(new Particle(x, y, c));
    }
}

// ============ GAME FUNCTIONS ============

function initGame() {
    const level = CONFIG.LEVELS[gameState.currentLevel];
    gameState.score = 0;
    gameState.combo = 0;
    gameState.maxCombo = 0;
    gameState.timeLeft = level.duration;
    gameState.targetsHit = 0;
    gameState.totalShots = 0;
    gameState.hasBlast = false;

    gameState.fireworks = [];
    gameState.targets = [];
    gameState.particles = [];
    gameState.powerups = [];
    gameState.textPopups = [];

    gameState.lastSpawn = 0;

    document.getElementById('total-time').textContent = level.duration;
    document.getElementById('time-left').textContent = level.duration;
    document.getElementById('current-level').textContent = level.name;
    document.getElementById('target-score').textContent = level.targetGoal;
    updateUI();
}

function startGame() {
    gameState.isRunning = true;
    gameState.isPaused = false;
    gameState.lastUpdate = performance.now();

    document.getElementById('start-overlay').classList.add('hidden');

    // Timer
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        if (gameState.isPaused) return;
        gameState.timeLeft--;
        document.getElementById('time-left').textContent = gameState.timeLeft;

        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    // Start loop
    gameState.animationId = requestAnimationFrame(gameLoop);
}

function endGame() {
    gameState.isRunning = false;
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    if (gameState.animationId) cancelAnimationFrame(gameState.animationId);

    const level = CONFIG.LEVELS[gameState.currentLevel];
    const won = gameState.score >= level.targetGoal;

    if (won) {
        document.getElementById('win-overlay').classList.remove('hidden');
        document.getElementById('win-score').textContent = gameState.score;
        document.getElementById('win-targets').textContent = gameState.targetsHit;
        document.getElementById('win-combo').textContent = gameState.maxCombo;
        document.getElementById('win-accuracy').textContent =
            gameState.totalShots > 0
                ? Math.round((gameState.targetsHit / gameState.totalShots) * 100) + '%'
                : '0%';

        // Victory explosion
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                spawnExplosion(
                    Math.random() * CONFIG.CANVAS_WIDTH,
                    Math.random() * CONFIG.CANVAS_HEIGHT * 0.6,
                    50
                );
            }, i * 300);
        }
        // Keep rendering particles
        requestAnimationFrame(function renderVictory() {
            const canvas = document.getElementById('game-canvas');
            const ctx = canvas.getContext('2d');
            renderBackground(ctx);
            gameState.particles = gameState.particles.filter(p => p.life > 0);
            for (const p of gameState.particles) {
                p.update();
                p.draw(ctx);
            }
            if (gameState.particles.length > 0) requestAnimationFrame(renderVictory);
        });
    } else {
        document.getElementById('lose-overlay').classList.remove('hidden');
        document.getElementById('lose-score').textContent = gameState.score;
        document.getElementById('lose-goal').textContent = level.targetGoal;
    }
}

function restartGame() {
    document.getElementById('win-overlay').classList.add('hidden');
    document.getElementById('lose-overlay').classList.add('hidden');
    document.getElementById('start-overlay').classList.remove('hidden');
    initGame();
}

// ============ GAME LOOP ============

function gameLoop(timestamp) {
    if (!gameState.isRunning) return;

    if (gameState.isPaused) {
        gameState.animationId = requestAnimationFrame(gameLoop);
        return;
    }

    const deltaTime = timestamp - gameState.lastUpdate || 16;
    gameState.lastUpdate = timestamp;

    update(timestamp, deltaTime);
    render();

    gameState.animationId = requestAnimationFrame(gameLoop);
}

function update(timestamp, deltaTime) {
    const level = CONFIG.LEVELS[gameState.currentLevel];

    // Spawn targets
    if (timestamp - gameState.lastSpawn > level.spawnRate &&
        gameState.targets.length < level.maxTargets) {
        gameState.targets.push(new LixiTarget(level.targetSpeed));
        gameState.lastSpawn = timestamp;

        // Maybe spawn powerup
        if (Math.random() < CONFIG.POWERUP_CHANCE && !gameState.hasBlast) {
            gameState.powerups.push(new PowerUp());
        }
    }

    // Update fireworks
    for (const fw of gameState.fireworks) {
        fw.update();

        // Check collision with targets
        for (const target of gameState.targets) {
            if (!target.alive) continue;
            const dist = Math.hypot(fw.x - target.x, fw.y - target.y);
            const hitRadius = fw.isBlast ? CONFIG.BLAST_RADIUS : target.size;

            if (dist < hitRadius) {
                target.alive = false;
                fw.alive = !fw.isBlast; // Blast goes through

                // Score
                gameState.combo++;
                if (gameState.combo > gameState.maxCombo) gameState.maxCombo = gameState.combo;
                const comboMult = 1 + Math.min(gameState.combo, CONFIG.MAX_COMBO) * CONFIG.COMBO_MULTIPLIER;
                const points = Math.round(CONFIG.BASE_SCORE * comboMult);
                gameState.score += points;
                gameState.targetsHit++;

                // Effects
                spawnExplosion(target.x, target.y, 20);

                const comboText = gameState.combo > 1 ? ` x${gameState.combo}` : '';
                gameState.textPopups.push(
                    new TextPopup(target.x, target.y, `+${points}${comboText}`,
                        gameState.combo > 3 ? '#f472b6' : '#fbbf24')
                );

                updateUI();
                break;
            }
        }

        // Check collision with powerups
        for (const pu of gameState.powerups) {
            if (!pu.alive) continue;
            const dist = Math.hypot(fw.x - pu.x, fw.y - pu.y);
            if (dist < pu.size + fw.size) {
                pu.alive = false;
                fw.alive = false;
                gameState.hasBlast = true;

                spawnExplosion(pu.x, pu.y, 30, '#fbbf24');
                gameState.textPopups.push(
                    new TextPopup(pu.x, pu.y, '⭐ BLAST!', '#fbbf24')
                );

                // Update blast indicator
                document.getElementById('blast-indicator').classList.add('active');
            }
        }
    }

    // Clean up
    gameState.fireworks = gameState.fireworks.filter(f => f.alive);
    gameState.targets = gameState.targets.filter(t => t.alive);
    gameState.powerups = gameState.powerups.filter(p => p.alive);

    // Update particles
    for (const p of gameState.particles) p.update();
    gameState.particles = gameState.particles.filter(p => p.life > 0);

    // Update text popups
    for (const tp of gameState.textPopups) tp.update();
    gameState.textPopups = gameState.textPopups.filter(tp => tp.life > 0);
}

function render() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    renderBackground(ctx);

    // Draw targets
    for (const target of gameState.targets) target.draw(ctx);

    // Draw powerups
    for (const pu of gameState.powerups) pu.draw(ctx);

    // Draw fireworks
    for (const fw of gameState.fireworks) fw.draw(ctx);

    // Draw particles
    for (const p of gameState.particles) p.draw(ctx);

    // Draw text popups
    for (const tp of gameState.textPopups) tp.draw(ctx);

    // Draw crosshair
    drawCrosshair(ctx);

    // Draw cannon
    drawCannon(ctx);

    // Draw combo indicator
    if (gameState.combo > 1) {
        drawComboIndicator(ctx);
    }

    // Draw blast indicator on canvas
    if (gameState.hasBlast) {
        drawBlastReady(ctx);
    }
}

function renderBackground(ctx) {
    // Night sky gradient
    const grad = ctx.createLinearGradient(0, 0, 0, CONFIG.CANVAS_HEIGHT);
    grad.addColorStop(0, '#0c0a1a');
    grad.addColorStop(0.4, '#1a103d');
    grad.addColorStop(0.7, '#2e1065');
    grad.addColorStop(1, '#1e1b4b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Stars
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    const starSeed = 42;
    for (let i = 0; i < 60; i++) {
        const px = ((starSeed * (i + 1) * 7919) % CONFIG.CANVAS_WIDTH);
        const py = ((starSeed * (i + 1) * 6271) % (CONFIG.CANVAS_HEIGHT * 0.6));
        const sz = ((i * 3) % 3) * 0.5 + 0.5;
        const twinkle = Math.sin(performance.now() / 1000 + i) * 0.3 + 0.7;
        ctx.globalAlpha = twinkle * 0.5;
        ctx.beginPath();
        ctx.arc(px, py, sz, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Ground
    const groundGrad = ctx.createLinearGradient(0, CONFIG.CANVAS_HEIGHT - 60, 0, CONFIG.CANVAS_HEIGHT);
    groundGrad.addColorStop(0, 'rgba(30, 27, 75, 0)');
    groundGrad.addColorStop(1, 'rgba(30, 27, 75, 0.8)');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, CONFIG.CANVAS_HEIGHT - 60, CONFIG.CANVAS_WIDTH, 60);
}

function drawCannon(ctx) {
    const cx = CONFIG.CANVAS_WIDTH / 2;
    const cy = CONFIG.CANVAS_HEIGHT - 15;

    // Aim towards mouse
    const angle = Math.atan2(gameState.mouseY - cy, gameState.mouseX - cx);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Barrel
    ctx.fillStyle = '#bef264';
    ctx.fillRect(0, -5, 35, 10);
    ctx.strokeStyle = '#0d0d1a';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, -5, 35, 10);

    // Barrel tip glow
    if (gameState.hasBlast) {
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(35, 0, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }

    ctx.restore();

    // Base
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.arc(cx, cy, 18, Math.PI, 0);
    ctx.fill();
    ctx.strokeStyle = '#0d0d1a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, 18, Math.PI, 0);
    ctx.stroke();
}

function drawCrosshair(ctx) {
    const x = gameState.mouseX;
    const y = gameState.mouseY;

    ctx.strokeStyle = gameState.hasBlast ? '#fbbf24' : 'rgba(190, 242, 100, 0.6)';
    ctx.lineWidth = 1.5;

    // Outer circle
    ctx.beginPath();
    ctx.arc(x, y, 15, 0, Math.PI * 2);
    ctx.stroke();

    // Cross lines
    ctx.beginPath();
    ctx.moveTo(x - 20, y);
    ctx.lineTo(x - 8, y);
    ctx.moveTo(x + 8, y);
    ctx.lineTo(x + 20, y);
    ctx.moveTo(x, y - 20);
    ctx.lineTo(x, y - 8);
    ctx.moveTo(x, y + 8);
    ctx.lineTo(x, y + 20);
    ctx.stroke();

    // Center dot
    ctx.fillStyle = gameState.hasBlast ? '#fbbf24' : '#bef264';
    ctx.beginPath();
    ctx.arc(x, y, 2, 0, Math.PI * 2);
    ctx.fill();
}

function drawComboIndicator(ctx) {
    const combo = Math.min(gameState.combo, CONFIG.MAX_COMBO);
    const text = `COMBO x${combo}`;
    const pulse = Math.sin(performance.now() / 200) * 0.1 + 1;

    ctx.save();
    ctx.globalAlpha = 0.9;
    ctx.font = `bold ${24 * pulse}px "Baloo 2", Arial`;
    ctx.textAlign = 'center';

    // Background
    ctx.fillStyle = combo >= 5 ? '#f472b6' : '#bef264';
    ctx.fillText(text, CONFIG.CANVAS_WIDTH / 2, 40);

    // Shadow for readability
    ctx.strokeStyle = '#0d0d1a';
    ctx.lineWidth = 3;
    ctx.strokeText(text, CONFIG.CANVAS_WIDTH / 2, 40);
    ctx.fillText(text, CONFIG.CANVAS_WIDTH / 2, 40);

    ctx.restore();
}

function drawBlastReady(ctx) {
    const pulse = Math.sin(performance.now() / 300) * 0.2 + 0.8;
    ctx.save();
    ctx.globalAlpha = pulse;
    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 14px "Baloo 2", Arial';
    ctx.textAlign = 'center';
    ctx.fillText('⭐ BLAST READY - Click to fire!', CONFIG.CANVAS_WIDTH / 2, CONFIG.CANVAS_HEIGHT - 40);
    ctx.restore();
}

function updateUI() {
    document.getElementById('score-value').textContent = gameState.score;
    document.getElementById('targets-hit').textContent = gameState.targetsHit;
}

// ============ EVENT HANDLERS ============

function setupEventListeners() {
    const canvas = document.getElementById('game-canvas');

    // Mouse move for aiming
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        gameState.mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        gameState.mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });

    // Click to shoot
    canvas.addEventListener('click', (e) => {
        if (!gameState.isRunning || gameState.isPaused) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        const cannonX = CONFIG.CANVAS_WIDTH / 2;
        const cannonY = CONFIG.CANVAS_HEIGHT - 15;

        const isBlast = gameState.hasBlast;
        if (isBlast) {
            gameState.hasBlast = false;
            document.getElementById('blast-indicator').classList.remove('active');
        }

        const fw = new Firework(cannonX, cannonY, x, y, isBlast);
        gameState.fireworks.push(fw);
        gameState.totalShots++;
    });

    // Hide cursor over canvas
    canvas.style.cursor = 'none';

    // Start button
    document.getElementById('start-btn').addEventListener('click', startGame);

    // Pause button
    document.getElementById('pause-btn').addEventListener('click', () => {
        gameState.isPaused = !gameState.isPaused;
        document.getElementById('pause-btn').textContent =
            gameState.isPaused ? '▶ Tiếp tục' : '⏸ Tạm dừng';
    });

    // Play again / retry
    document.getElementById('play-again-btn')?.addEventListener('click', restartGame);
    document.getElementById('retry-btn')?.addEventListener('click', restartGame);

    // Level selector
    document.querySelectorAll('.level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            gameState.currentLevel = parseInt(btn.dataset.level);
            initGame();
        });
    });

    // Fullscreen
    document.getElementById('fullscreen-btn')?.addEventListener('click', () => {
        const wrapper = document.getElementById('game-wrapper');
        if (!document.fullscreenElement) {
            wrapper.requestFullscreen?.() || wrapper.webkitRequestFullscreen?.();
        } else {
            document.exitFullscreen?.() || document.webkitExitFullscreen?.();
        }
    });
}

// ============ INIT ============
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    canvas.width = CONFIG.CANVAS_WIDTH;
    canvas.height = CONFIG.CANVAS_HEIGHT;

    initGame();
    setupEventListeners();

    // Render initial background
    const ctx = canvas.getContext('2d');
    renderBackground(ctx);
});
