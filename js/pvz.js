/**
 * 🌻 CÂY VS ZOMBIE TẾT - GAME ENGINE
 * Plants vs Zombies Mini-Game for Happy New Year 2026
 */

// ============ GAME CONFIGURATION ============
const CONFIG = {
    GRID_ROWS: 5,
    GRID_COLS: 9,
    CELL_WIDTH: 90,
    CELL_HEIGHT: 90,
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 500,

    // Starting resources
    START_LIXI: 50,

    // Plant costs
    PLANT_COSTS: {
        sunflower: 50,
        peashooter: 100,
        wallnut: 50
    },

    // Plant stats
    PLANTS: {
        sunflower: { health: 100, sunInterval: 8000, sunAmount: 25 },
        peashooter: { health: 100, shootInterval: 1500, damage: 25 },
        wallnut: { health: 400 }
    },

    // Zombie stats (speed reduced for better gameplay)
    ZOMBIES: {
        basic: { health: 100, speed: 0.08, damage: 10, points: 10 },
        bucket: { health: 300, speed: 0.06, damage: 15, points: 25 },
        runner: { health: 75, speed: 0.15, damage: 8, points: 15 }
    },

    // Wave configuration
    WAVES: [
        { zombies: ['basic', 'basic', 'basic'], interval: 6000 },
        { zombies: ['basic', 'basic', 'bucket', 'basic'], interval: 5000 },
        { zombies: ['basic', 'runner', 'bucket', 'basic', 'runner'], interval: 4500 },
        { zombies: ['bucket', 'runner', 'basic', 'bucket', 'runner', 'basic'], interval: 4000 },
        { zombies: ['bucket', 'bucket', 'runner', 'runner', 'basic', 'basic', 'bucket'], interval: 3500 }
    ]
};

// ============ ASSET LOADING ============
const ASSETS = {
    plants: {
        sunflower: new Image(),
        peashooter: new Image(),
        wallnut: new Image()
    },
    zombies: {
        basic: new Image(),
        bucket: new Image(),
        runner: new Image()
    },
    projectiles: {
        pea: new Image()
    },
    collectibles: {
        lixi: new Image()
    },
    background: new Image()
};

function loadAssets() {
    ASSETS.plants.sunflower.src = 'img/pvz/plants/sunflower.png';
    ASSETS.plants.peashooter.src = 'img/pvz/plants/peashooter.png';
    ASSETS.plants.wallnut.src = 'img/pvz/plants/wallnut.png';
    ASSETS.zombies.basic.src = 'img/pvz/zombies/zombie-basic.png';
    ASSETS.zombies.bucket.src = 'img/pvz/zombies/zombie-bucket.png';
    ASSETS.zombies.runner.src = 'img/pvz/zombies/zombie-runner.png';
    ASSETS.projectiles.pea.src = 'img/pvz/projectiles/pea.png';
    ASSETS.collectibles.lixi.src = 'img/pvz/collectibles/lixi.png';
    ASSETS.background.src = 'img/pvz/background/lawn.png';
}

// ============ GAME STATE ============
const gameState = {
    isRunning: false,
    isPaused: false,
    lixi: CONFIG.START_LIXI,
    score: 0,
    kills: 0,
    currentWave: 0,
    selectedPlant: null,
    usingShovel: false,

    plants: [],
    zombies: [],
    projectiles: [],
    suns: [],

    grid: [],

    // Timing
    lastUpdate: 0,
    waveTimer: null,
    zombieIndex: 0
};

// ============ GAME CLASSES ============

class Plant {
    constructor(type, row, col) {
        this.type = type;
        this.row = row;
        this.col = col;
        this.x = col * CONFIG.CELL_WIDTH + 45;
        this.y = row * CONFIG.CELL_HEIGHT + 25;
        this.width = 70;
        this.height = 70;
        this.health = CONFIG.PLANTS[type].health;
        this.maxHealth = this.health;
        this.lastAction = Date.now();
        this.image = ASSETS.plants[type];
    }

    update() {
        const now = Date.now();

        if (this.type === 'sunflower') {
            if (now - this.lastAction > CONFIG.PLANTS.sunflower.sunInterval) {
                this.produceSun();
                this.lastAction = now;
            }
        } else if (this.type === 'peashooter') {
            // Check if zombie in same row
            const hasZombie = gameState.zombies.some(z =>
                z.row === this.row && z.x > this.x
            );
            if (hasZombie && now - this.lastAction > CONFIG.PLANTS.peashooter.shootInterval) {
                this.shoot();
                this.lastAction = now;
            }
        }
    }

    produceSun() {
        const sun = {
            x: this.x + Math.random() * 40 - 20,
            y: this.y - 20,
            targetX: this.x + Math.random() * 60 - 30,
            targetY: this.y + Math.random() * 40,
            amount: CONFIG.PLANTS.sunflower.sunAmount,
            createdAt: Date.now(),
            lifespan: 8000
        };
        gameState.suns.push(sun);
    }

    shoot() {
        const projectile = new Projectile(this.x + 40, this.y + 30, this.row);
        gameState.projectiles.push(projectile);
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        const index = gameState.plants.indexOf(this);
        if (index > -1) {
            gameState.plants.splice(index, 1);
            gameState.grid[this.row][this.col] = null;
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - 35, this.y - 35, this.width, this.height);

        // Health bar
        if (this.health < this.maxHealth) {
            const barWidth = 50;
            const barHeight = 6;
            const healthPercent = this.health / this.maxHealth;

            ctx.fillStyle = '#333';
            ctx.fillRect(this.x - barWidth / 2, this.y - 40, barWidth, barHeight);

            ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#dc2626';
            ctx.fillRect(this.x - barWidth / 2, this.y - 40, barWidth * healthPercent, barHeight);
        }
    }
}

class Zombie {
    constructor(type, row) {
        this.type = type;
        this.row = row;
        this.x = CONFIG.CANVAS_WIDTH + 50;
        this.y = row * CONFIG.CELL_HEIGHT + 25;
        this.width = 70;
        this.height = 80;
        this.health = CONFIG.ZOMBIES[type].health;
        this.maxHealth = this.health;
        this.speed = CONFIG.ZOMBIES[type].speed;
        this.damage = CONFIG.ZOMBIES[type].damage;
        this.points = CONFIG.ZOMBIES[type].points;
        this.image = ASSETS.zombies[type];
        this.isEating = false;
        this.lastBite = 0;
    }

    update(deltaTime) {
        const plantInFront = this.getPlantInFront();

        if (plantInFront) {
            this.isEating = true;
            const now = Date.now();
            if (now - this.lastBite > 500) {
                plantInFront.takeDamage(this.damage);
                this.lastBite = now;
            }
        } else {
            this.isEating = false;
            this.x -= this.speed * deltaTime;
        }

        // Check if reached end
        if (this.x < 0) {
            return 'gameover';
        }
        return null;
    }

    getPlantInFront() {
        return gameState.plants.find(p =>
            p.row === this.row &&
            Math.abs(p.x - this.x) < 40
        );
    }

    takeDamage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.die();
        }
    }

    die() {
        const index = gameState.zombies.indexOf(this);
        if (index > -1) {
            gameState.zombies.splice(index, 1);
            gameState.score += this.points;
            gameState.kills++;
            updateUI();
        }
    }

    draw(ctx) {
        // Walking animation - bobble up and down when moving
        const walkCycle = Math.sin(Date.now() / 150 + this.row) * 3;
        // Eating wobble animation
        const wobble = this.isEating ? Math.sin(Date.now() / 100) * 4 : 0;
        // Combined animation offset
        const verticalOffset = this.isEating ? wobble : walkCycle;

        ctx.save();
        ctx.translate(this.x, this.y + verticalOffset);
        ctx.scale(-1, 1); // Flip to face left
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        ctx.restore();

        // Health bar
        const barWidth = 50;
        const barHeight = 6;
        const healthPercent = this.health / this.maxHealth;

        ctx.fillStyle = '#333';
        ctx.fillRect(this.x - barWidth / 2, this.y - 50, barWidth, barHeight);

        ctx.fillStyle = healthPercent > 0.5 ? '#22c55e' : healthPercent > 0.25 ? '#eab308' : '#dc2626';
        ctx.fillRect(this.x - barWidth / 2, this.y - 50, barWidth * healthPercent, barHeight);
    }
}

class Projectile {
    constructor(x, y, row) {
        this.x = x;
        this.y = y;
        this.row = row;
        this.speed = 5;
        this.damage = CONFIG.PLANTS.peashooter.damage;
        this.width = 25;
        this.height = 25;
        this.image = ASSETS.projectiles.pea;
    }

    update() {
        this.x += this.speed;

        // Check collision with zombies
        for (const zombie of gameState.zombies) {
            if (zombie.row === this.row &&
                Math.abs(zombie.x - this.x) < 30) {
                zombie.takeDamage(this.damage);
                this.destroy();
                return;
            }
        }

        // Remove if off screen
        if (this.x > CONFIG.CANVAS_WIDTH + 50) {
            this.destroy();
        }
    }

    destroy() {
        const index = gameState.projectiles.indexOf(this);
        if (index > -1) {
            gameState.projectiles.splice(index, 1);
        }
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }
}

// ============ GAME FUNCTIONS ============

function initGame() {
    loadAssets();

    // Initialize grid
    gameState.grid = [];
    for (let r = 0; r < CONFIG.GRID_ROWS; r++) {
        gameState.grid[r] = [];
        for (let c = 0; c < CONFIG.GRID_COLS; c++) {
            gameState.grid[r][c] = null;
        }
    }

    // Reset state
    gameState.lixi = CONFIG.START_LIXI;
    gameState.score = 0;
    gameState.kills = 0;
    gameState.currentWave = 0;
    gameState.plants = [];
    gameState.zombies = [];
    gameState.projectiles = [];
    gameState.suns = [];
    gameState.selectedPlant = null;
    gameState.usingShovel = false;
    gameState.zombieIndex = 0;

    updateUI();
    setupEventListeners();
}

function startGame() {
    gameState.isRunning = true;
    gameState.isPaused = false;
    gameState.lastUpdate = Date.now();

    document.getElementById('start-overlay').classList.add('hidden');

    // Start first wave after delay
    setTimeout(() => startWave(), 10000);

    // Start game loop
    requestAnimationFrame(gameLoop);
}

function startWave() {
    if (gameState.currentWave >= CONFIG.WAVES.length) {
        winGame();
        return;
    }

    const wave = CONFIG.WAVES[gameState.currentWave];
    gameState.zombieIndex = 0;

    document.getElementById('wave-num').textContent = gameState.currentWave + 1;

    function spawnNextZombie() {
        if (gameState.zombieIndex >= wave.zombies.length) {
            // Wave complete, check if all zombies dead
            const checkWaveComplete = setInterval(() => {
                if (gameState.zombies.length === 0) {
                    clearInterval(checkWaveComplete);
                    gameState.currentWave++;
                    if (gameState.currentWave < CONFIG.WAVES.length) {
                        setTimeout(() => startWave(), 5000);
                    } else {
                        setTimeout(() => winGame(), 2000);
                    }
                }
            }, 500);
            return;
        }

        const zombieType = wave.zombies[gameState.zombieIndex];
        const row = Math.floor(Math.random() * CONFIG.GRID_ROWS);
        const zombie = new Zombie(zombieType, row);
        gameState.zombies.push(zombie);
        gameState.zombieIndex++;

        if (gameState.zombieIndex < wave.zombies.length) {
            setTimeout(spawnNextZombie, wave.interval);
        } else {
            // All zombies spawned, check completion
            const checkWaveComplete = setInterval(() => {
                if (gameState.zombies.length === 0) {
                    clearInterval(checkWaveComplete);
                    gameState.currentWave++;
                    if (gameState.currentWave < CONFIG.WAVES.length) {
                        setTimeout(() => startWave(), 5000);
                    } else {
                        setTimeout(() => winGame(), 2000);
                    }
                }
            }, 500);
        }
    }

    spawnNextZombie();
}

function gameLoop(timestamp) {
    if (!gameState.isRunning || gameState.isPaused) {
        if (gameState.isRunning) {
            requestAnimationFrame(gameLoop);
        }
        return;
    }

    const deltaTime = timestamp - gameState.lastUpdate || 16;
    gameState.lastUpdate = timestamp;

    update(deltaTime);
    render();

    requestAnimationFrame(gameLoop);
}

function update(deltaTime) {
    // Update plants
    for (const plant of gameState.plants) {
        plant.update();
    }

    // Update zombies
    for (const zombie of gameState.zombies) {
        const result = zombie.update(deltaTime);
        if (result === 'gameover') {
            loseGame();
            return;
        }
    }

    // Update projectiles
    for (const projectile of [...gameState.projectiles]) {
        projectile.update();
    }

    // Update suns
    const now = Date.now();
    gameState.suns = gameState.suns.filter(sun =>
        now - sun.createdAt < sun.lifespan
    );
}

function render() {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);

    // Draw background (handled by CSS)

    // Draw grid overlay (optional, for debugging)
    // drawGrid(ctx);

    // Draw plants
    for (const plant of gameState.plants) {
        plant.draw(ctx);
    }

    // Draw zombies
    for (const zombie of gameState.zombies) {
        zombie.draw(ctx);
    }

    // Draw projectiles
    for (const projectile of gameState.projectiles) {
        projectile.draw(ctx);
    }

    // Draw suns
    for (const sun of gameState.suns) {
        ctx.drawImage(ASSETS.collectibles.lixi, sun.x - 20, sun.y - 20, 40, 40);
    }

    // Draw placement preview
    if (gameState.selectedPlant && gameState.hoverCell) {
        const { row, col } = gameState.hoverCell;
        if (gameState.grid[row][col] === null) {
            ctx.globalAlpha = 0.5;
            ctx.drawImage(
                ASSETS.plants[gameState.selectedPlant],
                col * CONFIG.CELL_WIDTH + 10,
                row * CONFIG.CELL_HEIGHT - 5,
                70, 70
            );
            ctx.globalAlpha = 1;
        }
    }
}

function drawGrid(ctx) {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;

    for (let r = 0; r <= CONFIG.GRID_ROWS; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * CONFIG.CELL_HEIGHT);
        ctx.lineTo(CONFIG.CANVAS_WIDTH, r * CONFIG.CELL_HEIGHT);
        ctx.stroke();
    }

    for (let c = 0; c <= CONFIG.GRID_COLS; c++) {
        ctx.beginPath();
        ctx.moveTo(c * CONFIG.CELL_WIDTH, 0);
        ctx.lineTo(c * CONFIG.CELL_WIDTH, CONFIG.CANVAS_HEIGHT);
        ctx.stroke();
    }
}

// ============ EVENT HANDLERS ============

function setupEventListeners() {
    const canvas = document.getElementById('game-canvas');

    // Plant selection
    document.querySelectorAll('.plant-card').forEach(card => {
        card.addEventListener('click', () => {
            const plantType = card.dataset.plant;
            const cost = parseInt(card.dataset.cost);

            if (gameState.lixi >= cost) {
                document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                gameState.selectedPlant = plantType;
                gameState.usingShovel = false;
                document.getElementById('shovel-btn').classList.remove('active');
            }
        });
    });

    // Shovel
    document.getElementById('shovel-btn').addEventListener('click', () => {
        gameState.usingShovel = !gameState.usingShovel;
        document.getElementById('shovel-btn').classList.toggle('active');
        if (gameState.usingShovel) {
            gameState.selectedPlant = null;
            document.querySelectorAll('.plant-card').forEach(c => c.classList.remove('selected'));
        }
    });

    // Canvas click - place plant or collect sun
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        const col = Math.floor(x / CONFIG.CELL_WIDTH);
        const row = Math.floor(y / CONFIG.CELL_HEIGHT);

        // Check sun click first
        for (let i = gameState.suns.length - 1; i >= 0; i--) {
            const sun = gameState.suns[i];
            if (Math.abs(sun.x - x) < 30 && Math.abs(sun.y - y) < 30) {
                gameState.lixi += sun.amount;
                gameState.suns.splice(i, 1);
                updateUI();
                showFloatingLixi(e.clientX, e.clientY, sun.amount);
                return;
            }
        }

        // Validate cell
        if (row < 0 || row >= CONFIG.GRID_ROWS || col < 0 || col >= CONFIG.GRID_COLS) return;

        // Shovel
        if (gameState.usingShovel) {
            if (gameState.grid[row][col]) {
                const plant = gameState.grid[row][col];
                plant.die();
            }
            return;
        }

        // Place plant
        if (gameState.selectedPlant && gameState.grid[row][col] === null) {
            const cost = CONFIG.PLANT_COSTS[gameState.selectedPlant];
            if (gameState.lixi >= cost) {
                const plant = new Plant(gameState.selectedPlant, row, col);
                gameState.plants.push(plant);
                gameState.grid[row][col] = plant;
                gameState.lixi -= cost;
                updateUI();
            }
        }
    });

    // Canvas hover - show preview
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);

        const col = Math.floor(x / CONFIG.CELL_WIDTH);
        const row = Math.floor(y / CONFIG.CELL_HEIGHT);

        if (row >= 0 && row < CONFIG.GRID_ROWS && col >= 0 && col < CONFIG.GRID_COLS) {
            gameState.hoverCell = { row, col };
        } else {
            gameState.hoverCell = null;
        }
    });

    // Start button
    document.getElementById('start-btn').addEventListener('click', startGame);

    // Pause button
    document.getElementById('pause-btn').addEventListener('click', () => {
        gameState.isPaused = !gameState.isPaused;
        document.getElementById('pause-btn').textContent =
            gameState.isPaused ? '▶ Tiếp tục' : '⏸ Tạm dừng';
    });

    // Play again buttons
    document.getElementById('play-again-btn')?.addEventListener('click', restartGame);
    document.getElementById('retry-btn')?.addEventListener('click', restartGame);
}

function updateUI() {
    document.getElementById('lixi-amount').textContent = gameState.lixi;
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('kills').textContent = gameState.kills;

    // Update plant card states
    document.querySelectorAll('.plant-card').forEach(card => {
        const cost = parseInt(card.dataset.cost);
        card.classList.toggle('disabled', gameState.lixi < cost);
    });
}

function showFloatingLixi(x, y, amount) {
    const container = document.getElementById('lixi-container');
    const div = document.createElement('div');
    div.className = 'floating-lixi';
    div.style.left = x + 'px';
    div.style.top = y + 'px';
    div.innerHTML = `<span style="color: gold; font-weight: bold; font-size: 20px;">+${amount}🧧</span>`;
    container.appendChild(div);

    setTimeout(() => div.remove(), 2000);
}

function winGame() {
    gameState.isRunning = false;
    document.getElementById('win-overlay').classList.remove('hidden');

    // Grant extra lixi turn (API call would go here)
    console.log('Player won! Granting +1 lixi turn');
}

function loseGame() {
    gameState.isRunning = false;
    document.getElementById('lose-overlay').classList.remove('hidden');
}

function restartGame() {
    document.getElementById('win-overlay').classList.add('hidden');
    document.getElementById('lose-overlay').classList.add('hidden');
    document.getElementById('start-overlay').classList.remove('hidden');
    initGame();
}

// ============ INITIALIZE ============
document.addEventListener('DOMContentLoaded', initGame);
