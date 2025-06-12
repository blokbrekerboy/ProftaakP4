/**
 * Enemy Class - Vijand object
 * Beheert vijand logica, AI en beweging
 */
class Enemy {
    constructor(x, y, type = 'basic', level = 1) {
        this.x = x;
        this.y = y;
        this.width = 35;
        this.height = 35;
        this.speed = 2;
        this.health = 20;
        this.type = type;
        this.level = level; // Game level for scaling difficulty
        this.damage = 10; // Damage dealt to player
        this.isBoss = false;
        
        // Movement pattern
        this.direction = Math.random() > 0.5 ? 1 : -1;
        this.movePattern = 'straight'; // 'straight', 'zigzag', 'circular'
        
        // Animation
        this.animationFrame = 0;
        this.color = '#ff0000';
        
        // Shooting (for advanced enemies)
        this.canShoot = false;
        this.lastShot = 0;
        this.shootCooldown = 2000;
        
        this.setupByType();
        this.applyLevelScaling();
    }
      /**
     * Setup eigenschappen gebaseerd op enemy type
     */
    setupByType() {
        switch(this.type) {
            case 'fast':
                this.speed = 4;
                this.health = 10;
                this.damage = 8;
                this.color = '#ff8800';
                this.movePattern = 'zigzag';
                break;
            case 'tank':
                this.speed = 1;
                this.health = 50;
                this.damage = 15;
                this.width = 45;
                this.height = 45;
                this.color = '#8800ff';
                break;
            case 'shooter':
                this.speed = 1.5;
                this.health = 15;
                this.damage = 12;
                this.color = '#ff0088';
                this.canShoot = true;
                break;
            case 'boss_heavy':
                this.speed = 0.5;
                this.health = 200;
                this.damage = 25;
                this.width = 80;
                this.height = 80;
                this.color = '#ff0000';
                this.canShoot = true;
                this.shootCooldown = 1000;
                this.isBoss = true;
                this.movePattern = 'circular';
                break;
            case 'boss_fast':
                this.speed = 2;
                this.health = 120;
                this.damage = 20;
                this.width = 60;
                this.height = 60;
                this.color = '#ff4400';
                this.canShoot = true;
                this.shootCooldown = 800;
                this.isBoss = true;
                this.movePattern = 'zigzag';
                break;
            case 'boss_mega':
                this.speed = 0.3;
                this.health = 500;
                this.damage = 35;
                this.width = 120;
                this.height = 120;
                this.color = '#880000';
                this.canShoot = true;
                this.shootCooldown = 600;
                this.isBoss = true;
                this.movePattern = 'circular';
                break;
            default: // 'basic'
                this.damage = 10;
                this.color = '#ff0000';
                break;
        }
    }
    
    /**
     * Apply level-based scaling to enemy stats
     */
    applyLevelScaling() {
        // Scale health based on level
        this.health = Math.floor(this.health * (1 + (this.level - 1) * 0.3));
        
        // Scale damage based on level
        this.damage = Math.floor(this.damage * (1 + (this.level - 1) * 0.2));
        
        // Slightly increase speed for higher levels
        if (this.level > 3) {
            this.speed *= (1 + (this.level - 3) * 0.1);
        }
        
        // Reduce shooting cooldown for shooter enemies at higher levels
        if (this.canShoot && this.level > 2) {
            this.shootCooldown = Math.max(500, this.shootCooldown * (1 - (this.level - 2) * 0.1));
        }
    }
      /**
     * Update vijand logica
     */
    update() {
        this.move();
        this.animate();
        
        // Boss-specific epic mechanics
        if (this.isBoss) {
            this.updateBossMechanics();
        }
        
        // Shooting logic
        if (this.canShoot && Date.now() - this.lastShot > this.shootCooldown) {
            this.shoot();
        }
    }
    
    /**
     * Epic boss mechanics for unique battle experiences
     */
    updateBossMechanics() {
        switch(this.type) {
            case 'boss_heavy':
                // Heavy boss: Multi-directional shooting burst
                if (this.canShoot && Date.now() - this.lastShot > this.shootCooldown) {
                    this.heavyBossAttack();
                    this.lastShot = Date.now();
                }
                break;
                
            case 'boss_fast':
                // Fast boss: Rapid dash attacks and speed bursts
                if (this.animationFrame % 120 === 0) {
                    this.fastBossSpeedBurst();
                }
                if (this.canShoot && this.animationFrame % 60 === 0) {
                    this.fastBossRapidFire();
                }
                break;
                
            case 'boss_mega':
                // Mega boss: Devastating laser sweeps and projectile storms
                if (this.animationFrame % 150 === 0) {
                    this.megaBossLaserSweep();
                }
                if (this.animationFrame % 90 === 0) {
                    this.megaBossProjectileStorm();
                }
                break;
        }
    }
    
    /**
     * Heavy boss multi-directional attack
     */
    heavyBossAttack() {
        if (window.game) {
            // Shoot in 5 directions
            const directions = [
                { x: 0, y: 1 },      // Down
                { x: -0.5, y: 1 },   // Down-left
                { x: 0.5, y: 1 },    // Down-right
                { x: -1, y: 0.5 },   // Left-down
                { x: 1, y: 0.5 }     // Right-down
            ];
            
            directions.forEach(dir => {
                // Create custom projectiles with different trajectories
                const projectile = {
                    x: this.x + this.width / 2,
                    y: this.y + this.height,
                    width: 6,
                    height: 12,
                    velocityX: dir.x * 4,
                    velocityY: dir.y * 4,
                    color: '#ff0000',
                    isBossProjectile: true,
                    
                    update() {
                        this.x += this.velocityX;
                        this.y += this.velocityY;
                    },
                    
                    draw(ctx) {
                        ctx.fillStyle = this.color;
                        ctx.fillRect(this.x, this.y, this.width, this.height);
                        
                        // Boss projectile glow effect
                        ctx.shadowColor = this.color;
                        ctx.shadowBlur = 5;
                    },
                    
                    collidesWith(other) {
                        return this.x < other.x + other.width &&
                               this.x + this.width > other.x &&
                               this.y < other.y + other.height &&
                               this.y + this.height > other.y;
                    }
                };
                
                window.game.bossProjectiles = window.game.bossProjectiles || [];
                window.game.bossProjectiles.push(projectile);
            });
        }
    }
    
    /**
     * Fast boss speed burst ability
     */
    fastBossSpeedBurst() {
        // Temporary speed boost
        this.originalSpeed = this.originalSpeed || this.speed;
        this.speed = this.originalSpeed * 3;
        
        // Reset speed after burst
        setTimeout(() => {
            this.speed = this.originalSpeed;
        }, 1000);
    }
    
    /**
     * Fast boss rapid fire attack
     */
    fastBossRapidFire() {
        if (window.game) {
            // Rapid 3-shot burst
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    if (this.health > 0) {
                        window.game.addProjectile(
                            this.x + this.width / 2 + (Math.random() - 0.5) * 20,
                            this.y + this.height,
                            'down'
                        );
                    }
                }, i * 100);
            }
        }
    }
    
    /**
     * Mega boss laser sweep attack
     */
    megaBossLaserSweep() {
        if (window.game) {
            // Create a sweeping laser effect
            const canvas = document.getElementById('gameCanvas');
            const laserWidth = 8;
            
            for (let x = 0; x < canvas.width; x += 30) {
                const laser = {
                    x: x,
                    y: this.y + this.height,
                    width: laserWidth,
                    height: canvas.height,
                    color: '#ff00ff',
                    isLaser: true,
                    lifetime: 60, // frames
                    currentLife: 0,
                    
                    update() {
                        this.currentLife++;
                        return this.currentLife < this.lifetime;
                    },
                    
                    draw(ctx) {
                        const alpha = 1 - (this.currentLife / this.lifetime);
                        ctx.fillStyle = `rgba(255, 0, 255, ${alpha})`;
                        ctx.fillRect(this.x, this.y, this.width, this.height);
                        
                        // Laser glow
                        ctx.shadowColor = this.color;
                        ctx.shadowBlur = 10;
                    },
                    
                    collidesWith(other) {
                        return this.x < other.x + other.width &&
                               this.x + this.width > other.x &&
                               this.y < other.y + other.height &&
                               this.y + this.height > other.y;
                    }
                };
                
                window.game.bossProjectiles = window.game.bossProjectiles || [];
                window.game.bossProjectiles.push(laser);
            }
        }
    }
    
    /**
     * Mega boss projectile storm
     */
    megaBossProjectileStorm() {
        if (window.game) {
            // Rain of projectiles
            for (let i = 0; i < 8; i++) {
                setTimeout(() => {
                    if (this.health > 0) {
                        const canvas = document.getElementById('gameCanvas');
                        window.game.addProjectile(
                            Math.random() * canvas.width,
                            this.y + this.height,
                            'down'
                        );
                    }
                }, i * 50);
            }
        }
    }
      /**
     * Beweeg de vijand
     */
    move() {
        // Enhanced movement patterns for wave-based bosses
        if (this.enhancedMovement) {
            this.enhancedMovementUpdate();
        } else {
            // Standard movement patterns
            this.standardMovementUpdate();
        }
        
        // Keep within canvas bounds (horizontally)
        const canvas = document.getElementById('gameCanvas');
        if (this.x < 0) this.x = 0;
        if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    }
    
    /**
     * Standard movement patterns for regular enemies and normal bosses
     */
    standardMovementUpdate() {
        switch(this.movePattern) {
            case 'straight':
                this.y += this.speed;
                break;
            case 'zigzag':
                this.y += this.speed;
                this.x += Math.sin(this.animationFrame * 0.1) * 2;
                break;
            case 'circular':
                this.y += this.speed * 0.5;
                this.x += Math.cos(this.animationFrame * 0.05) * 3;
                break;
        }
    }
    
    /**
     * Enhanced movement patterns for wave-based bosses
     */
    enhancedMovementUpdate() {
        switch(this.movePattern) {
            case 'circular':
                // Enhanced circular with variable radius
                this.y += this.speed * 0.4;
                const circularRadius = 80 + Math.sin(this.animationFrame * 0.02) * 30;
                this.x += Math.cos(this.animationFrame * 0.06) * circularRadius * 0.05;
                break;
                
            case 'zigzag':
                // Enhanced zigzag with speed bursts
                this.y += this.speed * (1 + Math.sin(this.animationFrame * 0.05) * 0.5);
                const zigzagAmplitude = 4 + Math.cos(this.animationFrame * 0.03) * 2;
                this.x += Math.sin(this.animationFrame * 0.15) * zigzagAmplitude;
                break;
                  case 'spiral':
                // Spiral inward movement
                this.spiralRadius = Math.max(5, this.spiralRadius + 0.3);
                this.spiralAngle += 0.1;
                
                const canvas = document.getElementById('gameCanvas');
                const spiralCenterX = canvas.width / 2;
                const spiralX = spiralCenterX + Math.cos(this.spiralAngle) * this.spiralRadius;
                
                this.x = spiralX - this.width / 2;
                this.y += this.speed * 0.6;
                break;
                
            case 'weaving':
                // Complex weaving pattern
                this.y += this.speed * 0.7;
                const waveA = Math.sin(this.animationFrame * this.weavingSpeed) * this.weavingAmplitude;
                const waveB = Math.cos(this.animationFrame * this.weavingSpeed * 1.7) * (this.weavingAmplitude * 0.6);
                this.x += (waveA + waveB) * 0.02;
                break;
                
            default:
                this.standardMovementUpdate();
                break;
        }
    }
    
    /**
     * Schiet projectiel (voor shooter enemies)
     */
    shoot() {
        if (window.game) {
            // Shoot towards player or straight down
            window.game.addProjectile(
                this.x + this.width / 2,
                this.y + this.height,
                'down'
            );
        }
        this.lastShot = Date.now();
    }
      /**
     * Neem schade
     */
    takeDamage(damage = 10) {
        this.health -= damage;
        
        // Visual feedback
        const originalColor = this.color;
        this.color = '#ffffff';
        setTimeout(() => {
            this.color = originalColor;
        }, 100);
        
        // Check if enemy is destroyed
        if (this.health <= 0) {
            // Chance to drop powerup
            this.shouldDropPowerUp = Math.random() < 0.15; // 15% chance
            return true;
        }
        return false;
    }    /**
     * Get random powerup type to drop
     */
    getRandomPowerUpType() {
        const powerUpTypes = ['speed', 'rapidfire', 'health', 'shield', 'multishot', 'diagonal'];
        
        // Bounce upgrade ONLY drops from boss_fast (the second boss)
        if (this.type === 'boss_fast') {
            // Check if bounce has already been dropped this game
            if (window.game && !window.game.bounceUpgradeDropped) {
                // Guarantee bounce upgrade drop on first Boss Fast defeat
                window.game.bounceUpgradeDropped = true;
                console.log('Boss Fast defeated! Guaranteed bounce upgrade dropped!');
                return 'bounce';
            }
            
            // If bounce already dropped, give other boss-tier powerups
            const bossTypes = ['shield', 'multishot', 'diagonal', 'bomb'];
            return bossTypes[Math.floor(Math.random() * bossTypes.length)];
        }
        
        // All other bosses drop high-tier powerups but NO bounce
        if (this.isBoss) {
            const bossTypes = ['shield', 'multishot', 'diagonal', 'bomb'];
            return bossTypes[Math.floor(Math.random() * bossTypes.length)];
        }
        
        // Tank enemies have higher chance for better powerups (no bounce)
        if (this.type === 'tank') {
            const betterTypes = ['shield', 'multishot', 'diagonal', 'bomb'];
            return betterTypes[Math.floor(Math.random() * betterTypes.length)];
        }
        
        // No other enemy types can drop bounce upgrade
        return powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    }
    
    /**
     * Animatie update
     */
    animate() {
        this.animationFrame++;
    }
    
    /**
     * Check botsing met ander object
     */
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
      /**
     * Teken de vijand met pixelated stijl
     */
    draw(ctx) {
        ctx.save();
        ctx.imageSmoothingEnabled = false; // Pixelated rendering
        
        // Main body
        ctx.fillStyle = this.color;
          switch(this.type) {
            case 'basic':
                this.drawPixelatedBasicEnemy(ctx);
                break;
            case 'fast':
                this.drawPixelatedFastEnemy(ctx);
                break;
            case 'tank':
                this.drawPixelatedTankEnemy(ctx);
                break;
            case 'shooter':
                this.drawPixelatedShooterEnemy(ctx);
                break;
            case 'boss_heavy':
                this.drawPixelatedBossHeavy(ctx);
                break;
            case 'boss_fast':
                this.drawPixelatedBossFast(ctx);
                break;
            case 'boss_mega':
                this.drawPixelatedBossMega(ctx);
                break;
        }
        
        // Health indicator for stronger enemies and all bosses
        if (this.health > 20 || this.isBoss) {
            this.drawHealthBar(ctx);
        }
        
        ctx.restore();
    }
      /**
     * Teken pixelated basic enemy
     */
    drawPixelatedBasicEnemy(ctx) {
        const pixelSize = 2;
        const pattern = [
            [0,0,0,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,0,0],
            [0,1,1,0,1,0,1,1,0],
            [1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,1,0,1],
            [0,0,1,1,0,1,1,0,0],
            [0,0,0,1,1,1,0,0,0]
        ];
        
        ctx.fillStyle = this.color;
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize * 2,
                        this.y + row * pixelSize * 2,
                        pixelSize * 2,
                        pixelSize * 2
                    );
                }
            }
        }
        
        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 8, this.y + 8, 4, 4);
        ctx.fillRect(this.x + this.width - 12, this.y + 8, 4, 4);
    }
    
    /**
     * Teken pixelated fast enemy
     */
    drawPixelatedFastEnemy(ctx) {
        const pixelSize = 2;
        const pattern = [
            [0,0,0,1,1,0,0,0],
            [0,0,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0],
            [1,1,0,1,1,0,1,1],
            [1,1,0,1,1,0,1,1],
            [0,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,0,0],
            [0,0,0,1,1,0,0,0]
        ];
        
        ctx.fillStyle = this.color;
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize * 2,
                        this.y + row * pixelSize * 2,
                        pixelSize * 2,
                        pixelSize * 2
                    );
                }
            }
        }
        
        // Speed trails
        if (this.animationFrame % 10 < 5) {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x - 8, this.y + 12, pixelSize * 2, pixelSize);
            ctx.fillRect(this.x + this.width + 4, this.y + 12, pixelSize * 2, pixelSize);
        }
    }
    
    /**
     * Teken pixelated tank enemy
     */
    drawPixelatedTankEnemy(ctx) {
        const pixelSize = 2;
        const pattern = [
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,1,1,1,1,1,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,1,1,1,1,1,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1]
        ];
        
        ctx.fillStyle = this.color;
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize * 2,
                        this.y + row * pixelSize * 2,
                        pixelSize * 2,
                        pixelSize * 2
                    );
                }
            }
        }
        
        // Armor highlights
        ctx.fillStyle = '#cccccc';
        ctx.fillRect(this.x + 4, this.y + 4, this.width - 8, 4);
        ctx.fillRect(this.x + 4, this.y + 16, this.width - 8, 4);
        ctx.fillRect(this.x + 4, this.y + 28, this.width - 8, 4);
    }
    
    /**
     * Teken pixelated shooter enemy
     */
    drawPixelatedShooterEnemy(ctx) {
        const pixelSize = 2;
        const pattern = [
            [0,0,1,1,1,1,1,0,0],
            [0,1,1,0,1,0,1,1,0],
            [1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,0,1],
            [1,1,1,0,0,0,1,1,1],
            [0,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,0,0,0]
        ];
        
        ctx.fillStyle = this.color;
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize * 2,
                        this.y + row * pixelSize * 2,
                        pixelSize * 2,
                        pixelSize * 2
                    );
                }
            }
        }
          // Weapon
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + this.width / 2 - 2, this.y + this.height, 4, 8);
        
        // Charging indicator
        if (Date.now() - this.lastShot > this.shootCooldown - 500) {
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(this.x + this.width / 2 - 1, this.y + this.height + 8, 2, 4);
        }
    }
    
    /**
     * Teken pixelated heavy boss
     */
    drawPixelatedBossHeavy(ctx) {
        const pixelSize = 3;
        const pattern = [
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,0,0,0,0,1,1,1,1,0,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0]
        ];
        
        ctx.fillStyle = this.color;
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize,
                        this.y + row * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
        
        // Boss armor plating
        ctx.fillStyle = '#666666';
        ctx.fillRect(this.x + 10, this.y + 10, this.width - 20, 8);
        ctx.fillRect(this.x + 10, this.y + 25, this.width - 20, 8);
        ctx.fillRect(this.x + 10, this.y + 40, this.width - 20, 8);
        
        // Boss weapons
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 5, this.y + this.height, 6, 12);
        ctx.fillRect(this.x + this.width - 11, this.y + this.height, 6, 12);
    }
    
    /**
     * Teken pixelated fast boss
     */
    drawPixelatedBossFast(ctx) {
        const pixelSize = 2;
        const pattern = [
            [0,0,0,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,1,1,0,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,0,0,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,0,0,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,1,1,0,0,0]
        ];
        
        ctx.fillStyle = this.color;
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize * 2,
                        this.y + row * pixelSize * 2,
                        pixelSize * 2,
                        pixelSize * 2
                    );
                }
            }
        }
        
        // Speed boost effects
        if (this.animationFrame % 8 < 4) {
            ctx.fillStyle = '#ffff00';
            ctx.fillRect(this.x - 15, this.y + 20, 8, 4);
            ctx.fillRect(this.x + this.width + 7, this.y + 20, 8, 4);
        }
    }
    
    /**
     * Teken pixelated mega boss
     */
    drawPixelatedBossMega(ctx) {
        const pixelSize = 4;
        const pattern = [
            [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
            [0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,1,1,0,0,1,1,1,1,1,1,0,0,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,0,0,0,0,1,1,1,1,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0]
        ];
        
        ctx.fillStyle = this.color;
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    ctx.fillRect(
                        this.x + col * pixelSize / 2,
                        this.y + row * pixelSize / 2,
                        pixelSize / 2,
                        pixelSize / 2
                    );
                }
            }
        }
        
        // Mega boss effects
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(this.x + 15, this.y + 15, this.width - 30, 6);
        ctx.fillRect(this.x + 15, this.y + 30, this.width - 30, 6);
        ctx.fillRect(this.x + 15, this.y + 45, this.width - 30, 6);
        ctx.fillRect(this.x + 15, this.y + 60, this.width - 30, 6);
        
        // Multiple weapons
        ctx.fillStyle = '#ffffff';
        for (let i = 0; i < 5; i++) {
            ctx.fillRect(this.x + 10 + i * 20, this.y + this.height, 4, 15);
        }
    }
      /**
     * Teken health bar
     */
    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = this.isBoss ? 8 : 3;
        const barX = this.x;
        const barY = this.y - (this.isBoss ? 15 : 8);
        
        // Background
        ctx.fillStyle = '#333333';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health - calculate max health based on type and level
        let maxHealth = 20;
        switch(this.type) {
            case 'tank': maxHealth = 50; break;
            case 'boss_heavy': maxHealth = 200; break;
            case 'boss_fast': maxHealth = 120; break;
            case 'boss_mega': maxHealth = 500; break;
        }
        
        // Apply level scaling to max health
        maxHealth = Math.floor(maxHealth * (1 + (this.level - 1) * 0.3));
        
        const healthPercent = this.health / maxHealth;
        ctx.fillStyle = this.isBoss ? 
            (healthPercent > 0.7 ? '#ff0000' : healthPercent > 0.3 ? '#ff8800' : '#ffff00') :
            (healthPercent > 0.5 ? '#00ff00' : '#ff0000');
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        // Boss name indicator
        if (this.isBoss) {
            ctx.fillStyle = '#ffffff';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.fillText('BOSS', this.x + this.width / 2, this.y - 20);
        }
    }
}

/**
 * EnemySpawner Class - Beheert het spawnen van vijanden
 */
class EnemySpawner {
    constructor(canvas) {
        this.canvas = canvas;
        this.spawnRate = 0.008; // Base spawn rate (reduced from 0.02)
        this.lastSpawn = 0;
        this.waveNumber = 1;
        this.enemiesInWave = 0;
        this.maxEnemiesPerWave = 6; // Reduced from 10
    }
      /**
     * Update spawner logica
     */
    update(level, enemies) {
        // Increase difficulty based on level (reduced scaling)
        const adjustedSpawnRate = this.spawnRate + (level * 0.002); // Reduced from 0.005
        
        if (Math.random() < adjustedSpawnRate) {
            this.spawnEnemy(level, enemies);
        }
        
        // Wave system
        if (enemies.length === 0 && this.enemiesInWave >= this.maxEnemiesPerWave) {
            this.nextWave();
        }
    }/**
     * Spawn een nieuwe vijand
     */
    spawnEnemy(level, enemies) {
        const x = Math.random() * (this.canvas.width - 50);
        const y = -50;
        
        // WAVE-BASED BOSS SYSTEM: Guaranteed boss every 10 waves
        if (this.waveNumber % 10 === 0) {
            let bossType = 'boss_heavy';
            
            // Select boss type based on level for progression
            if (level >= 8) {
                const bossRand = Math.random();
                if (bossRand < 0.4) bossType = 'boss_heavy';
                else if (bossRand < 0.8) bossType = 'boss_fast';
                else bossType = 'boss_mega';
            } else if (level >= 6) {
                bossType = Math.random() < 0.6 ? 'boss_heavy' : 'boss_fast';
            }
            
            // Center boss spawn with special movement patterns
            const bossX = this.canvas.width / 2 - 60;
            const boss = new Enemy(bossX, y, bossType, level);
            
            // Enhanced boss movement patterns for wave bosses
            this.enhanceBossMovement(boss, this.waveNumber);
            
            enemies.push(boss);
            this.enemiesInWave++;
            
            console.log(`Wave ${this.waveNumber}: Guaranteed ${bossType} boss spawned!`);
            return;
        }
          // Regular enemy spawning with progressive difficulty (reduced rates)
        let type = 'basic';
        const rand = Math.random();
        
        if (level >= 2) {
            if (rand < 0.15 + level * 0.03) type = 'fast'; // Reduced from 0.2 + level * 0.05
            else if (rand < 0.25 + level * 0.03) type = 'shooter'; // Reduced from 0.4 + level * 0.05
        }
        
        if (level >= 3) {
            if (rand < 0.03 + level * 0.01) type = 'tank'; // Reduced from 0.05 + level * 0.02
        }
        
        // Advanced enemy types at higher levels (reduced chance)
        if (level >= 4) {
            if (rand < 0.5) { // Reduced from 0.7
                const advancedTypes = ['fast', 'shooter', 'tank'];
                type = advancedTypes[Math.floor(Math.random() * advancedTypes.length)];
            }
        }
        
        enemies.push(new Enemy(x, y, type, level));
        this.enemiesInWave++;
    }
    
    /**
     * Enhance boss movement patterns for wave-based spawns
     */
    enhanceBossMovement(boss, waveNumber) {
        // Special movement patterns based on wave number
        const movementPatterns = ['circular', 'zigzag', 'spiral', 'weaving'];
        const patternIndex = Math.floor(waveNumber / 10) % movementPatterns.length;
        
        boss.movePattern = movementPatterns[patternIndex];
        
        // Add special properties for enhanced movement
        boss.waveSpawnNumber = waveNumber;
        boss.enhancedMovement = true;
        
        // Special movement parameters
        switch(boss.movePattern) {
            case 'spiral':
                boss.spiralRadius = 0;
                boss.spiralAngle = 0;
                break;
            case 'weaving':
                boss.weavingAmplitude = 100;
                boss.weavingSpeed = 0.1;
                break;
        }
    }
      /**
     * Start volgende wave
     */
    nextWave() {
        this.waveNumber++;
        this.enemiesInWave = 0;
        this.maxEnemiesPerWave += 2; // Reduced from 3
        
        // Bonus voor speler
        console.log(`Wave ${this.waveNumber} starting!`);
    }
}
