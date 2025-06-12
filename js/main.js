/**
 * Main.js - Initialisatie en opstart van het spel
 * Dit bestand start het spel op wanneer de pagina geladen is
 */

// Global game instance
let game;

/**
 * Initialiseer het spel wanneer de DOM geladen is
 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Oldskool Game wordt opgestart...');
    
    // Maak nieuwe game instance
    game = new Game('gameCanvas');
    
    // Maak game globaal beschikbaar voor debugging
    window.game = game;
    
    // Extra event listeners
    setupAdditionalEventListeners();
    
    // Toon welkomstbericht
    showWelcomeMessage();
    
    console.log('Spel succesvol geïnitialiseerd!');
});

/**
 * Setup extra event listeners voor verbeterde gebruikerservaring
 */
function setupAdditionalEventListeners() {
    // Prevent arrow keys from scrolling the page
    window.addEventListener('keydown', function(e) {
        if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].indexOf(e.code) > -1) {
            e.preventDefault();
        }
    }, false);
    
    // Pause game when window loses focus
    window.addEventListener('blur', function() {
        if (game && game.isRunning && !game.isPaused) {
            game.togglePause();
        }
    });
    
    // Responsive canvas
    window.addEventListener('resize', function() {
        resizeCanvas();
    });
    
    // Touch controls voor mobile (basic implementatie)
    setupTouchControls();
}

/**
 * Resize canvas voor responsive design
 */
function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const container = document.querySelector('.game-container');
    
    // Behoud aspect ratio
    const maxWidth = Math.min(window.innerWidth - 40, 800);
    const maxHeight = Math.min(window.innerHeight - 200, 600);
    
    if (maxWidth < 800) {
        canvas.style.width = maxWidth + 'px';
        canvas.style.height = (maxWidth * 0.75) + 'px';
    }
}

/**
 * Setup basic touch controls voor mobile devices
 */
function setupTouchControls() {
    const canvas = document.getElementById('gameCanvas');
    
    let touchStartX = 0;
    let touchStartY = 0;
    
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        if (!game || !game.isRunning) return;
        
        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        // Simulate keyboard input based on touch movement
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal movement
            if (deltaX > 20) {
                game.keys['ArrowRight'] = true;
                game.keys['ArrowLeft'] = false;
            } else if (deltaX < -20) {
                game.keys['ArrowLeft'] = true;
                game.keys['ArrowRight'] = false;
            }
        } else {
            // Vertical movement
            if (deltaY > 20) {
                game.keys['ArrowDown'] = true;
                game.keys['ArrowUp'] = false;
            } else if (deltaY < -20) {
                game.keys['ArrowUp'] = true;
                game.keys['ArrowDown'] = false;
            }
        }
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        // Clear all movement keys
        if (game) {
            game.keys['ArrowLeft'] = false;
            game.keys['ArrowRight'] = false;
            game.keys['ArrowUp'] = false;
            game.keys['ArrowDown'] = false;
        }
    });
    
    // Tap to shoot
    canvas.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1 && game && game.isRunning) {
            game.keys['Space'] = true;
            setTimeout(() => {
                if (game) game.keys['Space'] = false;
            }, 100);
        }
    });
}

/**
 * Toon welkomstbericht
 */
function showWelcomeMessage() {
    const gameTitle = document.getElementById('game-title');
    
    // Animatie voor titel
    gameTitle.style.transform = 'scale(0)';
    setTimeout(() => {
        gameTitle.style.transition = 'transform 0.5s ease-out';
        gameTitle.style.transform = 'scale(1)';
    }, 100);
    
    // Console bericht voor ontwikkelaars
    console.log(`
    🎮 OLDSKOOL GAME 🎮
    
    Besturing:
    - Pijltjestoetsen of WASD voor beweging
    - Spatiebalk om te schieten
    - Start knop om te beginnen
    - Pause knop om te pauzeren
    
    Veel plezier met spelen!
    `);
}

/**
 * Utility functies voor game development en debugging
 */
const GameUtils = {
    /**
     * Toggle debug mode
     */
    toggleDebug: function() {
        if (game) {
            game.debugMode = !game.debugMode;
            console.log('Debug mode:', game.debugMode ? 'ON' : 'OFF');
        }
    },
    
    /**
     * Get game stats
     */
    getStats: function() {
        if (game) {
            return {
                score: game.score,
                level: game.level,
                enemies: game.enemies.length,
                projectiles: game.projectiles.length,
                playerHealth: game.player.health,
                isRunning: game.isRunning,
                isPaused: game.isPaused
            };
        }
        return null;
    },
    
    /**
     * Spawn enemy (voor testing)
     */
    spawnEnemy: function(type = 'basic') {
        if (game) {
            const canvas = document.getElementById('gameCanvas');
            const x = Math.random() * (canvas.width - 50);
            game.enemies.push(new Enemy(x, -50, type));
            console.log(`Spawned ${type} enemy`);
        }
    },
    
    /**
     * Set game speed (voor testing)
     */
    setGameSpeed: function(speed) {
        if (game) {
            game.gameSpeed = speed;
            console.log('Game speed set to:', speed);
        }
    },
    
    /**
     * Demo mode voor powerup testing
     */
    startDemo: function() {
        if (!game) return;
        
        console.log('Starting PowerUp Demo Mode...');
        
        // Spawn different powerups for testing
        const powerUpTypes = ['speed', 'rapidfire', 'health', 'shield', 'multishot', 'bomb'];
        let index = 0;
        
        const spawnInterval = setInterval(() => {
            if (index >= powerUpTypes.length) {
                clearInterval(spawnInterval);
                console.log('Demo completed!');
                return;
            }
            
            const canvas = document.getElementById('gameCanvas');
            const x = Math.random() * (canvas.width - 50);
            game.powerUps.push(new PowerUp(x, -20, powerUpTypes[index]));
            
            console.log(`Spawned ${powerUpTypes[index]} powerup`);
            index++;
        }, 2000);
    },
    
    /**
     * Force next wave (for testing wave-based boss system)
     */
    forceNextWave: function() {
        if (game && game.enemySpawner) {
            console.log(`Current wave: ${game.enemySpawner.waveNumber}`);
            game.enemySpawner.nextWave();
            console.log(`Advanced to wave: ${game.enemySpawner.waveNumber}`);
            
            // Clear existing enemies to trigger wave advance
            game.enemies = [];
            
            // Show wave info
            console.log(`Wave ${game.enemySpawner.waveNumber}: ${game.enemySpawner.waveNumber % 10 === 0 ? 'BOSS WAVE!' : 'Regular wave'}`);
        }
    },
    
    /**
     * Jump to specific wave (for testing)
     */
    jumpToWave: function(waveNumber) {
        if (game && game.enemySpawner) {
            game.enemySpawner.waveNumber = waveNumber;
            game.enemySpawner.enemiesInWave = 0;
            game.enemies = [];
            console.log(`Jumped to wave ${waveNumber}: ${waveNumber % 10 === 0 ? 'BOSS WAVE!' : 'Regular wave'}`);
        }
    },
    
    /**
     * Force spawn wave boss (for testing)
     */
    spawnWaveBoss: function(bossType = 'boss_heavy') {
        if (game && game.enemySpawner) {
            const canvas = document.getElementById('gameCanvas');
            const bossX = canvas.width / 2 - 60;
            const boss = new Enemy(bossX, -50, bossType, game.level);
            
            // Enhanced boss movement patterns for wave bosses
            game.enemySpawner.enhanceBossMovement(boss, game.enemySpawner.waveNumber);
            
            game.enemies.push(boss);
            console.log(`Spawned wave boss: ${bossType} with enhanced movement pattern: ${boss.movePattern}`);
        }
    },
    
    /**
     * Test bounce upgrade drop system
     */
    testBounceUpgrade: function() {
        if (game) {
            console.log(`Bounce upgrade dropped: ${game.bounceUpgradeDropped}`);
            
            // Reset bounce upgrade flag for testing
            game.bounceUpgradeDropped = false;
            console.log('Reset bounce upgrade flag for testing');
            
            // Spawn a Boss Fast to test bounce drop
            this.spawnEnemy('boss_fast');
            console.log('Spawned Boss Fast - defeat it to test bounce upgrade drop!');
        }
    },
    
    /**
     * Get wave system status
     */
    getWaveStatus: function() {
        if (game && game.enemySpawner) {
            const spawner = game.enemySpawner;
            return {
                currentWave: spawner.waveNumber,
                enemiesInWave: spawner.enemiesInWave,
                maxEnemiesPerWave: spawner.maxEnemiesPerWave,
                nextBossWave: Math.ceil(spawner.waveNumber / 10) * 10,
                isBossWave: spawner.waveNumber % 10 === 0,
                bounceUpgradeDropped: game.bounceUpgradeDropped
            };
        }
        return null;
    },
    
    /**
     * Adjust difficulty settings (for balancing)
     */
    setDifficulty: function(difficulty = 'normal') {
        if (!game || !game.enemySpawner) return;
        
        const spawner = game.enemySpawner;
        
        switch(difficulty.toLowerCase()) {
            case 'easy':
                spawner.spawnRate = 0.005;
                spawner.maxEnemiesPerWave = 4;
                console.log('Difficulty set to EASY');
                break;
            case 'normal':
                spawner.spawnRate = 0.008;
                spawner.maxEnemiesPerWave = 6;
                console.log('Difficulty set to NORMAL');
                break;
            case 'hard':
                spawner.spawnRate = 0.015;
                spawner.maxEnemiesPerWave = 10;
                console.log('Difficulty set to HARD');
                break;
            case 'insane':
                spawner.spawnRate = 0.025;
                spawner.maxEnemiesPerWave = 15;
                console.log('Difficulty set to INSANE');
                break;
            default:
                console.log('Available difficulties: easy, normal, hard, insane');
                return;
        }
        
        console.log(`Spawn rate: ${spawner.spawnRate}, Max enemies per wave: ${spawner.maxEnemiesPerWave}`);
    },
    
    /**
     * Get current difficulty settings
     */
    getDifficulty: function() {
        if (!game || !game.enemySpawner) return null;
        
        const spawner = game.enemySpawner;
        return {
            spawnRate: spawner.spawnRate,
            maxEnemiesPerWave: spawner.maxEnemiesPerWave,
            currentWave: spawner.waveNumber,
            enemiesInWave: spawner.enemiesInWave
        };
    },

    // ...existing code...
};

// Maak GameUtils globaal beschikbaar voor debugging
window.GameUtils = GameUtils;

/**
 * PowerUp notification system
 */
class PowerUpNotification {
    static show(message, type) {
        // Remove existing notifications
        const existing = document.querySelectorAll('.powerup-notification');
        existing.forEach(el => el.remove());
        
        // Create new notification
        const notification = document.createElement('div');
        notification.className = 'powerup-notification';
        notification.innerHTML = `
            <strong>PowerUp!</strong><br>
            ${message}
        `;
        
        // Set color based on type
        const colors = {
            speed: '#00ffff',
            rapidfire: '#ff8800',
            health: '#ff0080',
            shield: '#8800ff',
            multishot: '#ffff00',
            bomb: '#ff4400'
        };
        
        notification.style.borderColor = colors[type] || '#00ff00';
        notification.style.color = colors[type] || '#00ff00';
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    }
}

// Make PowerUpNotification globally available
window.PowerUpNotification = PowerUpNotification;
