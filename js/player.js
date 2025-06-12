/**
 * Player Class - Speler object
 * Beheert de speler logica, beweging en acties
 */
class Player {    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 40;
        this.speed = 5;
        this.baseSpeed = 5;
        this.health = 100;
        this.maxHealth = 100;
        
        // Shooting
        this.canShoot = true;
        this.shootCooldown = 250; // milliseconds
        this.baseShootCooldown = 250;
        this.lastShot = 0;
        
        // Animation
        this.color = '#00ff00';
        this.animationFrame = 0;          // PowerUp effects - now permanent upgrades
        this.upgrades = {
            speedLevel: 0,
            rapidFireLevel: 0,
            shieldLevel: 0,
            multiShotLevel: 0,
            diagonalShotLevel: 0,
            bounceLevel: 0
        };
        
        // Visual effects
        this.permanentShield = false;
    }    /**
     * Update speler logica
     */
    update(keys) {
        this.handleInput(keys);
        this.animate();
        this.updateUpgrades();
        
        // Update shooting cooldown
        if (!this.canShoot) {
            if (Date.now() - this.lastShot > this.shootCooldown) {
                this.canShoot = true;
            }
        }
    }
    
    /**
     * Handle input van de speler
     */
    handleInput(keys) {
        // Beweging links/rechts
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.moveLeft();
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.moveRight();
        }
        
        // Beweging omhoog/omlaag (voor bepaalde game types)
        if (keys['ArrowUp'] || keys['KeyW']) {
            this.moveUp();
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            this.moveDown();
        }
        
        // Schieten
        if (keys['Space'] && this.canShoot) {
            this.shoot();
        }
    }
    
    /**
     * Beweeg naar links
     */
    moveLeft() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = 0;
        }
    }
    
    /**
     * Beweeg naar rechts
     */
    moveRight() {
        const canvas = document.getElementById('gameCanvas');
        this.x += this.speed;
        if (this.x + this.width > canvas.width) {
            this.x = canvas.width - this.width;
        }
    }
    
    /**
     * Beweeg omhoog
     */
    moveUp() {
        this.y -= this.speed;
        if (this.y < 0) {
            this.y = 0;
        }
    }
    
    /**
     * Beweeg omlaag
     */
    moveDown() {
        const canvas = document.getElementById('gameCanvas');
        this.y += this.speed;
        if (this.y + this.height > canvas.height) {
            this.y = canvas.height - this.height;
        }
    }    /**
     * Schiet projectiel
     */
    shoot() {
        if (this.canShoot) {
            // Check for multishot upgrade
            const shotCount = Math.min(1 + this.upgrades.multiShotLevel, 5); // Max 5 shots
              // Main shots (forward or spread)
            if (shotCount > 1) {
                // Multi-shot spread with proper spacing
                const baseSpacing = 12; // Base spacing between shots
                const totalWidth = (shotCount - 1) * baseSpacing;
                const startX = this.x + this.width / 2 - totalWidth / 2;
                
                for (let i = 0; i < shotCount; i++) {
                    const shotX = startX + (i * baseSpacing);
                    
                    if (window.game) {
                        window.game.addProjectile(shotX, this.y, 'up');
                    }
                }
            } else {
                // Normal single shot
                if (window.game) {
                    window.game.addProjectile(
                        this.x + this.width / 2, 
                        this.y, 
                        'up'
                    );
                }
            }
            
            // Diagonal shots upgrade (increased limit to 5)
            if (this.upgrades.diagonalShotLevel > 0) {
                const diagonalCount = Math.min(this.upgrades.diagonalShotLevel, 5); // Max 5 levels
                
                for (let i = 1; i <= diagonalCount; i++) {
                    const strength = i * 0.25; // Diagonal strength increases with level
                    
                    if (window.game) {
                        // Left diagonal
                        window.game.addDiagonalProjectile(
                            this.x + this.width / 4, 
                            this.y, 
                            -strength, -1
                        );
                        
                        // Right diagonal
                        window.game.addDiagonalProjectile(
                            this.x + (this.width * 3/4), 
                            this.y, 
                            strength, -1
                        );                    }
                }
            }
            
            // Bounce projectiles (if bounce upgrade is active)
            if (this.upgrades.bounceLevel > 0) {
                const bounceCount = Math.min(this.upgrades.bounceLevel, 3); // Max 3 bounce projectiles
                
                for (let i = 0; i < bounceCount; i++) {
                    const angle = -90 + (i - 1) * 30; // Spread bounce shots
                    const radians = angle * Math.PI / 180;
                    const velocityX = Math.sin(radians) * 3;
                    const velocityY = Math.cos(radians) * -8;
                    
                    if (window.game) {
                        window.game.addBounceProjectile(
                            this.x + this.width / 2, 
                            this.y, 
                            velocityX, 
                            velocityY
                        );
                    }
                }
            }
            
            this.canShoot = false;
            this.lastShot = Date.now();
        }
    }/**
     * Neem schade
     */
    takeDamage(damage = 10) {
        // Check if shielded (reduces damage based on shield level)
        if (this.upgrades.shieldLevel > 0) {
            damage = Math.max(1, damage - (this.upgrades.shieldLevel * 2));
        }
        
        this.health -= damage;
        if (this.health < 0) {
            this.health = 0;
        }
        
        // Visual feedback
        this.color = '#ff0000';
        setTimeout(() => {
            this.color = '#00ff00';
        }, 200);
    }
    
    /**
     * Heal de speler
     */
    heal(amount = 20) {
        this.health += amount;
        if (this.health > this.maxHealth) {
            this.health = this.maxHealth;
        }
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
     * Teken de speler met pixelated stijl
     */
    draw(ctx) {
        ctx.save();
        ctx.imageSmoothingEnabled = false; // Pixelated rendering
          // Shield effect
        if (this.permanentShield) {
            this.drawShieldEffect(ctx);
        }
        
        // Main body (pixelated spaceship)
        this.drawPixelatedSpaceship(ctx);
        
        // Health bar
        this.drawHealthBar(ctx);
        
        // PowerUp indicators
        this.drawPowerUpIndicators(ctx);
        
        ctx.restore();
    }
    
    /**
     * Teken pixelated spaceship
     */
    drawPixelatedSpaceship(ctx) {
        const pixelSize = 2;
        
        // Spaceship pixel pattern
        const pattern = [
            [0,0,0,0,1,1,0,0,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,1,1,1,1,0,0],
            [0,1,1,0,1,1,0,1,1,0],
            [1,1,1,1,1,1,1,1,1,1],
            [1,0,1,1,1,1,1,1,0,1],
            [1,0,1,1,1,1,1,1,0,1],
            [0,0,1,1,1,1,1,1,0,0],
            [0,0,0,1,1,1,1,0,0,0],
            [0,0,0,0,1,1,0,0,0,0]
        ];
        
        // Draw main body
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
        
        // Cockpit (white pixels)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 16, this.y + 8, pixelSize * 4, pixelSize * 3);
          // Engine glow (animated)
        if (this.animationFrame % 20 < 10) {
            ctx.fillStyle = this.upgrades.speedLevel > 0 ? '#00ffff' : '#ffff00';
            ctx.fillRect(this.x + 14, this.y + 36, pixelSize * 6, pixelSize * 2);
        }
    }
    
    /**
     * Teken shield effect
     */
    drawShieldEffect(ctx) {
        const time = Date.now() * 0.01;
        ctx.strokeStyle = '#8800ff';
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.7;
        
        // Rotating shield
        ctx.beginPath();
        ctx.arc(
            this.x + this.width / 2,
            this.y + this.height / 2,
            this.width / 2 + 10 + Math.sin(time) * 3,
            0,
            Math.PI * 2
        );
        ctx.stroke();
        
        ctx.globalAlpha = 1;
    }
      /**
     * Teken permanent upgrade indicators
     */
    drawPowerUpIndicators(ctx) {
        let indicatorY = this.y - 25;
        const indicatorSize = 8;
        
        // Speed upgrade indicator
        if (this.upgrades.speedLevel > 0) {
            ctx.fillStyle = '#00ffff';
            for (let i = 0; i < Math.min(this.upgrades.speedLevel, 5); i++) {
                ctx.fillRect(this.x + (i * 10), indicatorY, indicatorSize, indicatorSize);
            }
            indicatorY -= 12;
        }
        
        // Rapid fire upgrade indicator
        if (this.upgrades.rapidFireLevel > 0) {
            ctx.fillStyle = '#ff8800';
            for (let i = 0; i < Math.min(this.upgrades.rapidFireLevel, 5); i++) {
                ctx.fillRect(this.x + (i * 10), indicatorY, indicatorSize, indicatorSize);
            }
            indicatorY -= 12;
        }
        
        // Multishot upgrade indicator
        if (this.upgrades.multiShotLevel > 0) {
            ctx.fillStyle = '#ffff00';
            for (let i = 0; i < Math.min(this.upgrades.multiShotLevel, 5); i++) {
                ctx.fillRect(this.x + (i * 10), indicatorY, indicatorSize, indicatorSize);
            }
            indicatorY -= 12;
        }
          // Shield upgrade indicator
        if (this.upgrades.shieldLevel > 0) {
            ctx.fillStyle = '#8800ff';
            for (let i = 0; i < Math.min(this.upgrades.shieldLevel, 5); i++) {
                ctx.fillRect(this.x + (i * 10), indicatorY, indicatorSize, indicatorSize);
            }
            indicatorY -= 12;
        }
          // Diagonal shot upgrade indicator
        if (this.upgrades.diagonalShotLevel > 0) {
            ctx.fillStyle = '#ff00ff';
            for (let i = 0; i < Math.min(this.upgrades.diagonalShotLevel, 5); i++) {
                ctx.fillRect(this.x + (i * 10), indicatorY, indicatorSize, indicatorSize);
            }
            indicatorY -= 12;
        }
        
        // Bounce upgrade indicator
        if (this.upgrades.bounceLevel > 0) {
            ctx.fillStyle = '#00ffff';
            for (let i = 0; i < Math.min(this.upgrades.bounceLevel, 3); i++) {
                ctx.fillRect(this.x + (i * 10), indicatorY, indicatorSize, indicatorSize);
            }
        }
    }
    
    /**
     * Teken health bar
     */
    drawHealthBar(ctx) {
        const barWidth = this.width;
        const barHeight = 4;
        const barX = this.x;
        const barY = this.y - 10;
        
        // Background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(barX, barY, barWidth, barHeight);
        
        // Health
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#00ff00' : '#ff0000';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    }    /**
     * Update permanent upgrades
     */
    updateUpgrades() {
        // Apply permanent speed upgrades (reduced from 1.5 to 0.8 per level)
        this.speed = this.baseSpeed + (this.upgrades.speedLevel * 0.8);
        
        // Apply permanent rapid fire upgrades
        this.shootCooldown = Math.max(50, this.baseShootCooldown - (this.upgrades.rapidFireLevel * 50));
        
        // Shield effect
        this.permanentShield = this.upgrades.shieldLevel > 0;
    }
    
    /**
     * Permanent speed upgrade
     */
    upgradePermanentSpeed() {
        this.upgrades.speedLevel++;
        console.log(`Speed upgraded to level ${this.upgrades.speedLevel}`);
    }
    
    /**
     * Permanent rapid fire upgrade
     */
    upgradePermanentRapidFire() {
        this.upgrades.rapidFireLevel++;
        console.log(`Rapid fire upgraded to level ${this.upgrades.rapidFireLevel}`);
    }
    
    /**
     * Permanent shield upgrade
     */
    upgradePermanentShield() {
        this.upgrades.shieldLevel++;
        console.log(`Shield upgraded to level ${this.upgrades.shieldLevel}`);
    }
      /**
     * Permanent multishot upgrade
     */
    upgradePermanentMultiShot() {
        this.upgrades.multiShotLevel++;
        console.log(`Multi-shot upgraded to level ${this.upgrades.multiShotLevel}`);
    }
      /**
     * Permanent diagonal shot upgrade
     */
    upgradePermanentDiagonalShot() {
        this.upgrades.diagonalShotLevel++;
        console.log(`Diagonal shot upgraded to level ${this.upgrades.diagonalShotLevel}`);
    }
    
    /**
     * Permanent bounce upgrade
     */
    upgradePermanentBounce() {
        this.upgrades.bounceLevel++;
        console.log(`Bounce upgraded to level ${this.upgrades.bounceLevel}`);
    }
    
    /**
     * Health upgrade - increases max health and heals
     */
    upgradeHealth() {
        this.maxHealth += 20;
        this.heal(50);
        console.log(`Max health increased to ${this.maxHealth}`);
    }
}

/**
 * Projectile Class - Kogel/projectiel object
 */
class Projectile {
    constructor(x, y, direction) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 10;
        this.speed = 8;
        this.direction = direction; // 'up', 'down', 'left', 'right'
        this.color = '#ffff00';
    }
    
    /**
     * Update projectiel positie
     */
    update() {
        switch(this.direction) {
            case 'up':
                this.y -= this.speed;
                break;
            case 'down':
                this.y += this.speed;
                break;
            case 'left':
                this.x -= this.speed;
                break;
            case 'right':
                this.x += this.speed;
                break;
        }
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
     * Teken het projectiel met pixelated stijl
     */
    draw(ctx) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        
        // Pixelated projectile
        const pixelSize = 2;
        const pattern = [
            [1,1],
            [1,1],
            [1,1],
            [1,1],
            [1,1]
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
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 3;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.restore();
    }
}

/**
 * DiagonalProjectile Class - Diagonal shooting projectile
 */
class DiagonalProjectile {
    constructor(x, y, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.width = 3;
        this.height = 6;
        this.velocityX = velocityX * 8; // Horizontal velocity
        this.velocityY = velocityY * 8; // Vertical velocity
        this.color = '#ff00ff'; // Magenta color for diagonal shots
    }
    
    /**
     * Update diagonal projectile position
     */
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
    
    /**
     * Check collision with other object
     */
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
    
    /**
     * Draw the diagonal projectile with pixelated style
     */
    draw(ctx) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        
        // Pixelated diagonal projectile (smaller)
        const pixelSize = 2;
        const pattern = [
            [1,1],
            [1,1],
            [1,1]
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
        
        // Glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 2;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        ctx.restore();
    }
}

/**
 * BounceProjectile Class - Projectiles that bounce off walls
 */
class BounceProjectile {
    constructor(x, y, velocityX, velocityY) {
        this.x = x;
        this.y = y;
        this.width = 4;
        this.height = 8;
        this.velocityX = velocityX || 0;
        this.velocityY = velocityY || -8;
        this.color = '#00ffff'; // Cyan color for bounce shots
        this.bounces = 0;
        this.maxBounces = 3; // Maximum number of bounces
    }
    
    /**
     * Update bounce projectile position with wall collision
     */
    update() {
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        // Get canvas bounds
        const canvas = document.getElementById('gameCanvas');
        
        // Bounce off left and right walls
        if (this.x <= 0 || this.x + this.width >= canvas.width) {
            if (this.bounces < this.maxBounces) {
                this.velocityX = -this.velocityX;
                this.bounces++;
                // Keep projectile in bounds
                if (this.x <= 0) this.x = 1;
                if (this.x + this.width >= canvas.width) this.x = canvas.width - this.width - 1;
            }
        }
        
        // Bounce off top wall (but not bottom to let projectiles exit)
        if (this.y <= 0) {
            if (this.bounces < this.maxBounces) {
                this.velocityY = -this.velocityY;
                this.bounces++;
                this.y = 1;
            }
        }
    }
    
    /**
     * Check collision with other object
     */
    collidesWith(other) {
        return this.x < other.x + other.width &&
               this.x + this.width > other.x &&
               this.y < other.y + other.height &&
               this.y + this.height > other.y;
    }
    
    /**
     * Check if projectile should be removed (too many bounces or off screen)
     */
    shouldRemove(canvasHeight) {
        return this.bounces >= this.maxBounces && this.y > canvasHeight + 50;
    }
    
    /**
     * Draw the bounce projectile with pixelated style
     */
    draw(ctx) {
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        
        // Pixelated bounce projectile
        const pixelSize = 2;
        const pattern = [
            [1,1],
            [1,1],
            [1,1],
            [1,1]
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
        
        // Special glow effect for bounce projectiles
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 4;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Draw bounce trail effect
        if (this.bounces > 0) {
            ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
            ctx.fillRect(this.x - 2, this.y - 2, this.width + 4, this.height + 4);
        }
        
        ctx.restore();
    }
}
