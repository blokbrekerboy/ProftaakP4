/**
 * Main Game Class - Oldskool Game
 * Deze class beheert de hoofdlogica van het spel
 */
class Game {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');        // Game state
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;
        this.level = 1;
        
        // Wave-based boss system tracking
        this.bounceUpgradeDropped = false; // Track if bounce has been dropped this game        // Game objects
        this.player = null;
        this.enemies = [];
        this.projectiles = [];
        this.diagonalProjectiles = [];
        this.bounceProjectiles = [];
        this.bossProjectiles = []; // Epic boss projectiles
        this.powerUps = [];
        
        // Wave-based enemy spawning system
        this.enemySpawner = new EnemySpawner(this.canvas);
        
        // Game settings
        this.gameSpeed = 60; // FPS
        this.lastTime = 0;
        
        // Input handling
        this.keys = {};
        
        this.init();
    }
    
    /**
     * Initialiseer het spel
     */
    init() {
        this.setupEventListeners();
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 50);
        this.updateUI();
    }
    
    /**
     * Setup event listeners voor input en UI
     */
    setupEventListeners() {
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // UI buttons
        document.getElementById('startBtn').addEventListener('click', () => {
            this.start();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.reset();
        });
    }
    
    /**
     * Start het spel
     */
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            this.gameLoop();
        }
    }
    
    /**
     * Pauzeer/hervat het spel
     */
    togglePause() {
        if (this.isRunning) {
            this.isPaused = !this.isPaused;
            if (!this.isPaused) {
                this.gameLoop();
            }
        }
    }
    
    /**
     * Reset het spel
     */    reset() {
        this.isRunning = false;
        this.isPaused = false;
        this.score = 0;        this.level = 1;        this.enemies = [];
        this.projectiles = [];
        this.diagonalProjectiles = [];
        this.bounceProjectiles = [];
        this.bossProjectiles = [];
        this.powerUps = [];
        this.player = new Player(this.canvas.width / 2, this.canvas.height - 50);
        this.updateUI();
        this.clearCanvas();
        this.draw();
    }
    
    /**
     * Hoofdgame loop
     */
    gameLoop(currentTime = 0) {
        if (!this.isRunning || this.isPaused) return;
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.draw();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
      /**
     * Update alle game objecten
     */
    update(deltaTime) {
        // Update player
        this.player.update(this.keys);
        
        // Update enemies
        this.enemies.forEach(enemy => enemy.update());
          // Update projectiles
        this.projectiles.forEach(projectile => projectile.update());
          // Update diagonal projectiles
        this.diagonalProjectiles.forEach(projectile => projectile.update());
          // Update bounce projectiles
        this.bounceProjectiles.forEach(projectile => projectile.update());
        
        // Update boss projectiles (epic boss attacks)
        this.bossProjectiles.forEach((projectile, index) => {
            if (projectile.isLaser) {
                // Laser projectiles have lifetime
                if (!projectile.update()) {
                    this.bossProjectiles.splice(index, 1);
                }
            } else {
                projectile.update();
            }
        });
        
        // Update powerups
        this.powerUps.forEach(powerUp => powerUp.update());
          // Collision detection
        this.checkCollisions();
        
        // Wave-based enemy spawning system
        this.enemySpawner.update(this.level, this.enemies);
        
        // Clean up objects that are off-screen
        this.cleanup();
        
        // Check win/lose conditions
        this.checkGameState();
    }
      /**
     * Render alle game objecten
     */
    draw() {
        this.clearCanvas();
        
        // Draw player
        this.player.draw(this.ctx);
        
        // Draw enemies
        this.enemies.forEach(enemy => enemy.draw(this.ctx));
          // Draw projectiles
        this.projectiles.forEach(projectile => projectile.draw(this.ctx));
          // Draw diagonal projectiles
        this.diagonalProjectiles.forEach(projectile => projectile.draw(this.ctx));
          // Draw bounce projectiles
        this.bounceProjectiles.forEach(projectile => projectile.draw(this.ctx));
        
        // Draw boss projectiles (epic boss attacks)
        this.bossProjectiles.forEach(projectile => projectile.draw(this.ctx));
        
        // Draw power-ups
        this.powerUps.forEach(powerUp => powerUp.draw(this.ctx));
    }
    
    /**
     * Clear the canvas
     */
    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    /**
     * Spawn een nieuwe vijand
     */
    spawnEnemy() {
        const x = Math.random() * (this.canvas.width - 40);
        const y = -40;
        this.enemies.push(new Enemy(x, y));
    }
      /**
     * Check botsingen tussen objecten
     */
    checkCollisions() {        // Player vs Enemies
        this.enemies.forEach((enemy, enemyIndex) => {
            if (this.player.collidesWith(enemy)) {
                this.player.takeDamage(enemy.damage);
                this.enemies.splice(enemyIndex, 1);
            }
        });
        
        // Projectiles vs Enemies
        this.projectiles.forEach((projectile, projectileIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (projectile.collidesWith(enemy)) {
                    // Check if enemy is destroyed
                    const isDestroyed = enemy.takeDamage();
                    
                    if (isDestroyed) {
                        // Drop powerup if applicable
                        if (enemy.shouldDropPowerUp) {
                            const powerUpType = enemy.getRandomPowerUpType();
                            this.powerUps.push(new PowerUp(enemy.x, enemy.y, powerUpType));
                        }
                        
                        this.enemies.splice(enemyIndex, 1);
                        this.score += 10;
                        this.updateUI();
                    }
                    
                    this.projectiles.splice(projectileIndex, 1);                }
            });
        });
        
        // Diagonal Projectiles vs Enemies
        this.diagonalProjectiles.forEach((projectile, projectileIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (projectile.collidesWith(enemy)) {
                    // Check if enemy is destroyed
                    const isDestroyed = enemy.takeDamage();
                    
                    if (isDestroyed) {
                        // Drop powerup if applicable
                        if (enemy.shouldDropPowerUp) {
                            const powerUpType = enemy.getRandomPowerUpType();
                            this.powerUps.push(new PowerUp(enemy.x, enemy.y, powerUpType));
                        }
                        
                        this.enemies.splice(enemyIndex, 1);
                        this.score += 10;
                        this.updateUI();
                    }
                    
                    this.diagonalProjectiles.splice(projectileIndex, 1);
                }
            });        });
        
        // Bounce Projectiles vs Enemies
        this.bounceProjectiles.forEach((projectile, projectileIndex) => {
            this.enemies.forEach((enemy, enemyIndex) => {
                if (projectile.collidesWith(enemy)) {
                    // Check if enemy is destroyed
                    const isDestroyed = enemy.takeDamage();
                    
                    if (isDestroyed) {
                        // Drop powerup if applicable
                        if (enemy.shouldDropPowerUp) {
                            const powerUpType = enemy.getRandomPowerUpType();
                            this.powerUps.push(new PowerUp(enemy.x, enemy.y, powerUpType));
                        }
                        
                        this.enemies.splice(enemyIndex, 1);
                        this.score += 15; // Bonus points for bounce projectile kills
                        this.updateUI();
                    }
                    
                    this.bounceProjectiles.splice(projectileIndex, 1);
                }
            });
        });
          // Player vs PowerUps
        this.powerUps.forEach((powerUp, powerUpIndex) => {
            if (this.player.collidesWith(powerUp)) {
                const effect = powerUp.applyEffect(this.player);
                
                // Handle bomb effect
                if (effect === 'bomb') {
                    this.activateBombEffect();
                }
                
                this.powerUps.splice(powerUpIndex, 1);
                this.score += 5; // Bonus points for collecting powerups
                this.updateUI();
            }
        });
        
        // Boss Projectiles vs Player (epic boss attacks)
        this.bossProjectiles.forEach((projectile, projectileIndex) => {
            if (this.player.collidesWith(projectile)) {
                // Boss projectiles deal more damage
                const damage = projectile.isLaser ? 20 : 15;
                this.player.takeDamage(damage);
                
                // Remove boss projectile after hit (except lasers)
                if (!projectile.isLaser) {
                    this.bossProjectiles.splice(projectileIndex, 1);
                }
            }
        });
    }
      /**
     * Ruim objecten op die buiten het scherm zijn
     */
    cleanup() {
        this.enemies = this.enemies.filter(enemy => enemy.y < this.canvas.height + 50);        this.projectiles = this.projectiles.filter(projectile => 
            projectile.y > -50 && projectile.y < this.canvas.height + 50
        );        this.diagonalProjectiles = this.diagonalProjectiles.filter(projectile => 
            projectile.y > -50 && projectile.y < this.canvas.height + 50 &&
            projectile.x > -50 && projectile.x < this.canvas.width + 50
        );        this.bounceProjectiles = this.bounceProjectiles.filter(projectile => 
            !projectile.shouldRemove(this.canvas.height)
        );
        this.bossProjectiles = this.bossProjectiles.filter(projectile => 
            projectile.y > -50 && projectile.y < this.canvas.height + 50 &&
            projectile.x > -50 && projectile.x < this.canvas.width + 50
        );
        this.powerUps = this.powerUps.filter(powerUp => 
            powerUp.y < this.canvas.height + 50
        );
    }
    
    /**
     * Check win/lose condities
     */
    checkGameState() {
        if (this.player.health <= 0) {
            this.gameOver();
        }
        
        // Level progression
        if (this.score > this.level * 100) {
            this.level++;
            this.updateUI();
        }
    }
    
    /**
     * Game over
     */
    gameOver() {
        this.isRunning = false;
        alert(`Game Over! Score: ${this.score}`);
    }
      /**
     * Update UI elementen met retro formatting
     */
    updateUI() {
        // Format score with leading zeros (6 digits)
        const formattedScore = this.score.toString().padStart(6, '0');
        document.getElementById('score').textContent = formattedScore;
        
        // Format level with leading zero (2 digits)
        const formattedLevel = this.level.toString().padStart(2, '0');
        document.getElementById('level').textContent = formattedLevel;
    }
      /**
     * Voeg projectiel toe
     */
    addProjectile(x, y, direction) {
        this.projectiles.push(new Projectile(x, y, direction));
    }
      /**
     * Voeg diagonal projectiel toe
     */
    addDiagonalProjectile(x, y, velocityX, velocityY) {
        this.diagonalProjectiles.push(new DiagonalProjectile(x, y, velocityX, velocityY));
    }
    
    /**
     * Voeg bounce projectiel toe
     */
    addBounceProjectile(x, y, velocityX, velocityY) {
        this.bounceProjectiles.push(new BounceProjectile(x, y, velocityX, velocityY));
    }
      /**
     * Activate bomb effect - destroy all enemies with retro visual
     */
    activateBombEffect() {
        // Create retro screen flash effect
        const flashOverlay = document.createElement('div');
        flashOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #ffffff;
            z-index: 9999;
            pointer-events: none;
            animation: bombFlash 0.5s ease-out;
        `;
        
        // Add flash animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bombFlash {
                0% { opacity: 0; }
                20% { opacity: 0.9; }
                40% { opacity: 0.2; }
                60% { opacity: 0.7; }
                80% { opacity: 0.1; }
                100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(flashOverlay);
        
        // Remove flash effect after animation
        setTimeout(() => {
            document.body.removeChild(flashOverlay);
            document.head.removeChild(style);
        }, 500);
        
        // Destroy all enemies and give points
        const enemiesDestroyed = this.enemies.length;
        this.enemies = [];
        this.score += enemiesDestroyed * 20; // Bonus points for bomb
        this.updateUI();
        
        // Retro console message
        console.log(`>>> BOMB ACTIVATED! ${enemiesDestroyed} ENEMIES DESTROYED! <<<`);
        
        // Show notification
        if (window.PowerUpNotification) {
            window.PowerUpNotification.show(
                `SCREEN CLEARED! ${enemiesDestroyed} ENEMIES DESTROYED!`, 
                'bomb'
            );
        }
    }
}
