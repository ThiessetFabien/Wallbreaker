let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");

let pixelRatio = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * pixelRatio;

const heightRatio = 0.5;
    canvas.height = canvas.width * heightRatio * pixelRatio;
    ctx.scale(pixelRatio, pixelRatio);

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = canvas.width * 0.004;
let dy = canvas.width * 0.004;

const ballRadius = canvas.width * 0.01;

const paddleHeight = canvas.height * 0.02;
const paddleWidth = canvas.width * 0.15;
let paddleX = (canvas.width - paddleWidth) / 2;

let rightPressed = false;
let leftPressed = false;

let brickRowCount = 6;
let brickColumnCount = 10;
const brickWidth = canvas.width * 0.085;
const brickHeight = canvas.height * 0.05;
const brickPadding = canvas.width * 0.01;
const brickOffsetTop = canvas.width * 0.05;
const brickOffsetLeft = canvas.height * 0.05;

let score = 0;
let lives = 3;

let bricks = Array(brickColumnCount).fill().map(() => 
    Array(brickRowCount).fill().map(() => 
    ({ x: 0, y: 0, status: 1 }))
);

let currentLevel = 0;
let gameOver = false;

let levels = [{bricks: [], ballSpeed: 1},
            {bricks: [], ballSpeed: 2},
            {bricks: [], ballSpeed: 3},
            {bricks: [], ballSpeed: 4},
            {bricks: [], ballSpeed: 5},];

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("resize", CanvaRatio);

function keyDownHandler(e) {
    if (e.key === "ArrowRight") {
        rightPressed = true;
    } 
    else if (e.key === "ArrowLeft") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key === "ArrowRight") {
        rightPressed = false;
    } 
    else if (e.key === "ArrowLeft") {
        leftPressed = false;
    }
} 

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

function CanvaRatio() {
    canvas.width = window.innerWidth * 0.95;
    canvas.height = window.innerWidth * heightRatio;
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            let b = bricks[c][r];
            if (b.status !== 1) continue;
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score === brickRowCount * brickColumnCount) {
                        alert("C'est gagné, Bravo!");
                        document.location.reload();
                        clearInterval(interval);
                    }
                }
            }
        }        
    }

function drawBall() {
ctx.beginPath();
ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
ctx.fillStyle = "#F8F8F6";
ctx.fill();
ctx.closePath();
}

function drawPaddle() {
    paddleX = Math.max(Math.min(paddleX, canvas.width - paddleWidth), 0);
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#10535F";
    ctx.fill();
    ctx.closePath();
}

function drawBricks () {
    let colors = ["#E2DCCE", "#51757A", "#172D36"];
    for (let c =0; c < brickColumnCount; c++) {
            for (let r = 0; r < brickRowCount; r++) {
                let b = bricks[c][r];
                if (b.status === 1) {
                    b.x = c * (brickWidth + brickPadding) + brickOffsetLeft;
                    b.y = r * (brickHeight + brickPadding) + brickOffsetTop;
                    ctx.beginPath();
                    ctx.rect(b.x, b.y, brickWidth, brickHeight);
                    ctx.fillStyle = colors[r % colors.length];
                    ctx.fill();
                    ctx.closePath();
                }
                }
            }
        }

function drawScore () {
    ctx.font = (canvas.width * 0.02) + "px Arial";
    ctx.fillStyle ="#10535F";
    ctx.fillText("Score : " + score, canvas.width * 0.01, canvas.height * 0.05);
}

function drawLives () {
    ctx.font = (canvas.width * 0.02) + "px Arial";
    ctx.fillStyle = "#10535F";
    ctx.fillText("Lives: " + lives, canvas.width * 0.9, canvas.height * 0.05);
}

function loadLevel () {
    bricks = levels[level].bricks;
    ball.speed = levels[level].ballSpeed;
}

function update() {
    if (bricks.length === 0) {
        currentLevel++;
        if (currentLevel >= levels.length) {
            alert('Félicitations, vous avez terminé tous les niveaux !')
            gameOver = true;
        } else {
            loadLevel(currentLevel);
        }
    }
}

function draw()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    collisionDetection();
    drawScore();
    drawLives();

    if(x +dx > canvas.width - ballRadius || x +dx < ballRadius){
        dx = -dx;
    }

    if(y+ dy < ballRadius) {
        dy = -dy;
    }
    else if (y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth){
            dy = -dy;
        } else {
    lives--;
    if (!lives) {
        alert ("GAME OVER");
        document.location.reload();
        clearInterval(interval);
    } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 2;
        dy = -2;
        paddleX = (canvas.width - paddleWidth) / 2;
    }
       }
    }

    if(rightPressed && paddleX < canvas.width - paddleWidth) {
        paddleX += 7;
    }
    else if (leftPressed && paddleX >0) {
        paddleX -= 7;
    }

    x += dx;
    y += dy;
    requestAnimationFrame(draw);
}

draw();
console.log(currentLevel)