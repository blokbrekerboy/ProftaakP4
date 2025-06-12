/**
 * PowerUp Class - Upgrade items die van vijanden vallen
 */
class PowerUp {
    constructor(x, y, type = 'speed') {
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 20;
        this.speed = 2;
        this.type = type;
        this.collected = false;
        
        // Animation
        this.animationFrame = 0;
        this.floatOffset = 0;
        
        // Setup properties based on type
        this.setupByType();
    }
      /**
     * Setup eigenschappen gebaseerd op powerup type
     */
    setupByType() {
        switch(this.type) {
            case 'speed':
                this.color = '#00ffff'; // Cyan
                this.effect = 'Permanently increases movement speed';
                this.duration = 0; // Permanent
                break;
            case 'rapidfire':
                this.color = '#ff8800'; // Orange
                this.effect = 'Permanently faster shooting';
                this.duration = 0; // Permanent
                break;
            case 'health':
                this.color = '#ff0080'; // Pink
                this.effect = 'Restores health & increases max health';
                this.duration = 0; // Instant
                break;
            case 'shield':
                this.color = '#8800ff'; // Purple
                this.effect = 'Permanently stronger armor';
                this.duration = 0; // Permanent
                break;
            case 'multishot':
                this.color = '#ffff00'; // Yellow
                this.effect = 'Permanently shoots multiple projectiles';
                this.duration = 0; // Permanent
                break;            case 'bomb':
                this.color = '#ff4400'; // Red-Orange
                this.effect = 'Destroys all enemies on screen';
                this.duration = 0; // Instant
                break;            case 'diagonal':
                this.color = '#ff00ff'; // Magenta
                this.effect = 'Permanently shoots diagonal projectiles';
                this.duration = 0; // Permanent
                break;            case 'bounce':
                this.color = '#00ffff'; // Cyan
                this.effect = 'Projectiles bounce off walls (BOSS FAST EXCLUSIVE!)';
                this.duration = 0; // Permanent
                break;
        }
    }
    
    /**
     * Update powerup logica
     */
    update() {
        // Move down
        this.y += this.speed;
        
        // Floating animation
        this.animationFrame++;
        this.floatOffset = Math.sin(this.animationFrame * 0.1) * 2;
        
        // Rotate animation
        this.rotation = this.animationFrame * 0.05;
    }
    
    /**
     * Check botsing met speler
     */
    collidesWith(player) {
        return this.x < player.x + player.width &&
               this.x + this.width > player.x &&
               this.y < player.y + player.height &&
               this.y + this.height > player.y;
    }    /**
     * Apply powerup effect to player
     */
    applyEffect(player) {
        this.collected = true;
        
        // Show notification
        if (window.PowerUpNotification) {
            window.PowerUpNotification.show(this.effect, this.type);
        }
        
        switch(this.type) {
            case 'speed':
                player.upgradePermanentSpeed();
                break;
            case 'rapidfire':
                player.upgradePermanentRapidFire();
                break;
            case 'health':
                player.upgradeHealth();
                break;
            case 'shield':
                player.upgradePermanentShield();
                break;
            case 'multishot':
                player.upgradePermanentMultiShot();
                break;            case 'bomb':
                // Handle in game logic
                return 'bomb';            case 'diagonal':
                player.upgradePermanentDiagonalShot();
                break;
            case 'bounce':
                player.upgradePermanentBounce();
                break;
        }
        
        return this.type;
    }
    
    /**
     * Teken de powerup met pixelated stijl
     */
    draw(ctx) {
        ctx.save();
        
        // Apply floating offset
        const drawY = this.y + this.floatOffset;
        
        // Pixelated rendering
        ctx.imageSmoothingEnabled = false;
        
        // Outer glow
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 8;
        
        // Main body (pixelated cube)
        ctx.fillStyle = this.color;
        this.drawPixelatedCube(ctx, this.x, drawY);
        
        // Inner bright core
        ctx.fillStyle = '#ffffff';
        this.drawPixelatedCore(ctx, this.x + 6, drawY + 6);
        
        // Type indicator
        this.drawTypeIndicator(ctx, this.x, drawY);
        
        ctx.shadowBlur = 0;
        ctx.restore();
    }
    
    /**
     * Teken pixelated cube
     */
    drawPixelatedCube(ctx, x, y) {
        const pixelSize = 2;
        const pattern = [
            [1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,0,1],
            [1,0,1,0,0,0,0,1,0,1],
            [1,0,1,0,1,1,0,1,0,1],
            [1,0,1,0,1,1,0,1,0,1],
            [1,0,1,0,0,0,0,1,0,1],
            [1,0,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1]
        ];
        
        for (let row = 0; row < pattern.length; row++) {
            for (let col = 0; col < pattern[row].length; col++) {
                if (pattern[row][col] === 1) {
                    ctx.fillRect(
                        x + col * pixelSize,
                        y + row * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
    }
    
    /**
     * Teken bright core
     */
    drawPixelatedCore(ctx, x, y) {
        const pixelSize = 2;
        ctx.fillRect(x, y, pixelSize * 4, pixelSize * 4);
    }
      /**
     * Teken type indicator
     */
    drawTypeIndicator(ctx, x, y) {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.textAlign = 'center';
        
        let symbol = '';
        switch(this.type) {
            case 'speed': symbol = '>'; break;
            case 'rapidfire': symbol = '*'; break;
            case 'health': symbol = '+'; break;
            case 'shield': symbol = 'O'; break;            case 'multishot': symbol = '#'; break;            case 'bomb': symbol = 'X'; break;
            case 'diagonal': symbol = '/'; break;
            case 'bounce': symbol = '~'; break;
        }
        
        ctx.fillText(symbol, x + this.width / 2, y - 5);
    }
}
