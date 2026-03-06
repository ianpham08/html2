const canvas = document.getElementById('invadersCanvas');
const ctx = canvas.getContext('2d');
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('start-btn');
const statusText = document.getElementById('status-text');

let player, bullets, enemies, enemyBullets, score, gameActive, direction;

function init() {
    player = { x: canvas.width / 2 - 25, y: canvas.height - 40, w: 50, h: 20, speed: 7 };
    bullets = [];
    enemies = [];
    enemyBullets = [];
    score = 0;
    direction = 1;
    gameActive = true;

    // Create enemy grid
    for (let r = 0; r < 4; r++) {
        for (let c = 0; c < 8; c++) {
            enemies.push({ x: c * 70 + 100, y: r * 50 + 50, w: 40, h: 30 });
        }
    }

    overlay.style.display = 'none';
    canvas.style.display = 'block';
    update();
}

// Input Handling
const keys = {};
window.addEventListener('keydown', (e) => { keys[e.code] = true; if(e.code === 'Space') e.preventDefault(); });
window.addEventListener('keyup', (e) => { keys[e.code] = false; });

startBtn.addEventListener('click', init);

function update() {
    if (!gameActive) return;

    // Move Player
    if (keys['ArrowLeft'] && player.x > 0) player.x -= player.speed;
    if (keys['ArrowRight'] && player.x < canvas.width - player.w) player.x += player.speed;
    
    // Shoot
    if (keys['Space']) {
        if (bullets.length === 0 || bullets[bullets.length - 1].y < player.y - 100) {
            bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 15 });
        }
    }

    // Clear Canvas
    ctx.fillStyle = '#2d3436';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Player (The "Camera")
    ctx.fillStyle = '#7da47d';
    ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillRect(player.x + 15, player.y - 10, 20, 10); // Viewfinder

    // Move & Draw Bullets
    ctx.fillStyle = '#f4d3d3';
    bullets.forEach((b, i) => {
        b.y -= 10;
        ctx.fillRect(b.x, b.y, b.w, b.h);
        if (b.y < 0) bullets.splice(i, 1);
    });

    // Move & Draw Enemies
    let hitWall = false;
    enemies.forEach((enemy, i) => {
        enemy.x += 1.5 * direction;
        if (enemy.x + enemy.w > canvas.width || enemy.x < 0) hitWall = true;

        ctx.fillStyle = '#e8f0e8';
        ctx.fillRect(enemy.x, enemy.y, enemy.w, enemy.h);

        // Check Collision with Player Bullets
        bullets.forEach((bullet, bi) => {
            if (bullet.x < enemy.x + enemy.w && bullet.x + bullet.w > enemy.x &&
                bullet.y < enemy.y + enemy.h && bullet.y + bullet.h > enemy.y) {
                enemies.splice(i, 1);
                bullets.splice(bi, 1);
                score += 10;
            }
        });

        // Check Game Over (Enemies reach bottom)
        if (enemy.y + enemy.h > player.y) end('Game Over! They reached you.');
    });

    if (hitWall) {
        direction *= -1;
        enemies.forEach(e => e.y += 20);
    }

    if (enemies.length === 0) end('Portfolio Secured! Score: ' + score);

    // Score Display
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Cleaned: ' + score, 20, 30);

    requestAnimationFrame(update);
}

function end(msg) {
    gameActive = false;
    statusText.innerText = msg;
    startBtn.innerText = "Restart System";
    overlay.style.display = 'flex';
}