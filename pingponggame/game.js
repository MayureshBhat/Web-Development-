const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 20;
const BALL_SIZE = 16;
const BALL_SPEED = 6;
const AI_SPEED = 4;

// Paddle objects
const player = {
    x: PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#29e",
};

const ai = {
    x: canvas.width - PADDLE_WIDTH - PADDLE_MARGIN,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    color: "#e92",
};

// Ball object
const ball = {
    x: canvas.width / 2 - BALL_SIZE / 2,
    y: canvas.height / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    speedX: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    speedY: BALL_SPEED * (Math.random() * 2 - 1),
    color: "#fff",
};

// Draw functions
function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Main render function
function render() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, "#222");
    // Draw middle line
    for (let i = 15; i < canvas.height; i += 40) {
        drawRect(canvas.width/2 - 2, i, 4, 20, "#444");
    }
    // Draw paddles and ball
    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(ai.x, ai.y, ai.width, ai.height, ai.color);
    drawBall(ball.x, ball.y, ball.size, ball.color);
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    player.y = mouseY - player.height / 2;
    // Clamp within canvas
    if (player.y < 0) player.y = 0;
    if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
});

// AI paddle movement
function moveAI() {
    // Simple logic: move towards ball's y position
    const target = ball.y + ball.size / 2;
    const aiCenter = ai.y + ai.height / 2;
    if (target < aiCenter - 10) {
        ai.y -= AI_SPEED;
    } else if (target > aiCenter + 10) {
        ai.y += AI_SPEED;
    }
    // Clamp within canvas
    if (ai.y < 0) ai.y = 0;
    if (ai.y + ai.height > canvas.height) ai.y = canvas.height - ai.height;
}

// Ball movement and collision
function moveBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Top and bottom wall collision
    if (ball.y <= 0) {
        ball.y = 0;
        ball.speedY *= -1;
    }
    if (ball.y + ball.size >= canvas.height) {
        ball.y = canvas.height - ball.size;
        ball.speedY *= -1;
    }

    // Left paddle collision
    if (
        ball.x <= player.x + player.width &&
        ball.x >= player.x &&
        ball.y + ball.size >= player.y &&
        ball.y <= player.y + player.height
    ) {
        ball.x = player.x + player.width;
        ball.speedX *= -1;
        // Add some "spin" based on where it hits the paddle
        let collidePoint = (ball.y + ball.size/2) - (player.y + player.height/2);
        collidePoint = collidePoint / (player.height / 2);
        ball.speedY = BALL_SPEED * collidePoint;
    }

    // Right paddle collision
    if (
        ball.x + ball.size >= ai.x &&
        ball.x + ball.size <= ai.x + ai.width &&
        ball.y + ball.size >= ai.y &&
        ball.y <= ai.y + ai.height
    ) {
        ball.x = ai.x - ball.size;
        ball.speedX *= -1;
        // Add "spin" for realism
        let collidePoint = (ball.y + ball.size/2) - (ai.y + ai.height/2);
        collidePoint = collidePoint / (ai.height / 2);
        ball.speedY = BALL_SPEED * collidePoint;
    }

    // Reset if out of bounds
    if (ball.x < 0 || ball.x > canvas.width) {
        resetBall();
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2 - BALL_SIZE / 2;
    ball.y = canvas.height / 2 - BALL_SIZE / 2;
    ball.speedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.speedY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main game loop
function gameLoop() {
    moveAI();
    moveBall();
    render();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();