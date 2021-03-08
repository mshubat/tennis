// globals
var canvas;
var ctx;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
var paddle1Y;
var paddle2Y;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

const BALL_SIZE = 10;
var ballX = 50;
var ballY = 100;
var ballSpeedX = 2;
var ballSpeedY = 1;

const calculateMousePos = (evt) => {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  }
}

const handleMouseClick = () => {
  if (showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
};

window.onload = () => {
  // board setup
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  paddle2Y = canvas.height/2-PADDLE_HEIGHT/2;
  paddle1Y = canvas.height/2-PADDLE_HEIGHT/2;
  const fps = 144;
  setInterval(() => {
    updateEverything();
    drawEverything();
  }, 1000 / fps);

  canvas.addEventListener('mousemove', (evt) => {
    var mousePos = calculateMousePos(evt);
    paddle1Y = mousePos.y;
  });

  canvas.addEventListener('mousedown', handleMouseClick);
};

const ballReset = () => {

  if (player1Score === WINNING_SCORE || player2Score === WINNING_SCORE) {
    showingWinScreen = true;
  }


  ballSpeedX = ballSpeedX/ballSpeedX;
  ballSpeedY = ballSpeedY/ballSpeedY
  ballX = canvas.width/2;
  ballY = canvas.height/2;
};

const computerMovement = () => {

  if (paddle2Y-4 < ballY-4) {
    paddle2Y += 2;
  } else if (paddle2Y-4 > ballY+4) {
    paddle2Y -= 2;
  }
}

const increaseBallSpeedX = () => {
  const SPEED_LIMIT = 4;

  if (ballSpeedX > -SPEED_LIMIT && ballSpeedX < SPEED_LIMIT) {
    if (ballSpeedX < 0) {
      ballSpeedX--;
    } else {
      ballSpeedX++;
    }
  }
}

const updateEverything = () => {
  console.log("ball", {ballX, ballY});

  if (showingWinScreen) {
    colorRect(0, 0, canvas.width, canvas.height, "black");
    ctx.font = "15px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Player " + (player1Score === WINNING_SCORE ? "1" : "2") + " Wins!", canvas.width/2, 60);
    ctx.fillText("Click to Continue.", canvas.width/2, 80);
    return;
  }

  // ball direction
  if (ballX <= -BALL_SIZE/2) {
    player2Score += 1;
    ballReset();
  } else if (ballX >= canvas.width+BALL_SIZE/2) {
    player1Score += 1;
    drawScores();
    ballReset();
  }

  // hits left paddle
  if (ballX === PADDLE_WIDTH && 
      ballY >= paddle1Y-PADDLE_HEIGHT/2 &&
      ballY <= paddle1Y+PADDLE_HEIGHT/2) {
    ballSpeedX = -ballSpeedX
    ballSpeedY = (ballY - paddle1Y) * 0.07
    increaseBallSpeedX();
  }

  // hit right paddle
  if (ballX === canvas.width-PADDLE_WIDTH &&
      ballY >= paddle2Y-PADDLE_HEIGHT/2 &&
      ballY <= paddle2Y+PADDLE_HEIGHT/2) {
    ballSpeedX = -ballSpeedX;
    ballSpeedY = (ballY - paddle2Y) * 0.07
    increaseBallSpeedX();
  }

  // bounce off top and bottom
  if (ballY <= BALL_SIZE/2 || ballY >= canvas.height-BALL_SIZE/2) {
    ballSpeedY *= -1;
  }

  computerMovement();

  // update
  ballX += ballSpeedX;
  ballY += ballSpeedY;
};

const drawEverything = () => {
  if (showingWinScreen) {
    return;
  }

  // board
  colorRect(0, 0, canvas.width, canvas.height, "black");
  drawNet();

  // scores
  drawScores();

  // left player
  colorRect(0, paddle1Y-PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
  
  // right player
  colorRect(canvas.width-PADDLE_WIDTH, paddle2Y-PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
  
  // ball
  colorCircle(ballX, ballY, BALL_SIZE, "white");
};

const colorRect = (leftX, topY, width, height, color) => {
  ctx.fillStyle = color;
  ctx.fillRect(leftX, topY, width, height);
}

const colorCircle = (centerX, centerY, radius, color) => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  ctx.fill();
};

const drawScores = () => {
  ctx.font = "15px Arial";
  ctx.fillStyle = "white";
  ctx.fillText(player1Score, 100, 30);
  ctx.fillText(player2Score, canvas.width - 110, 30);
};

const drawNet = () => {
  const leftX = 400;
  const topY = 80;

  ctx.fillStyle = "white";

  for (i = 5 ; i < canvas.height; i+=30) {
    ctx.fillRect((canvas.width/2) - 1, i, 2, 20);
  } 
};

