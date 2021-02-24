// globals
var canvas;
var canvasContext;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
var paddle1Y;
var paddle2Y;

const BALL_SIZE = 10;
var ballX = 50;
var ballY = 100;
var ballSpeedX = 1;
var ballSpeedY = 1;

const calculateMousePos = (evt) => {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  let posObj = {
    "clientX": evt.clientX,
    "rect.left": rect.left,
    "root.scrollLeft": root.scrollLeft
  }
  console.log(posObj);

  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;

  return {
    x: mouseX,
    y: mouseY
  }
}

window.onload = () => {
  // board setup
  canvas = document.getElementById("gameCanvas");
  canvasContext = canvas.getContext("2d");

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
  })
};

const ballReset = () => {
  ballSpeedX = ballSpeedX*-1;
  ballX = canvas.width/2;
  ballY = canvas.height/2;
};

const computerMovement = () => {
  const paddleTop = paddle2Y-PADDLE_HEIGHT/2;
  const paddleBottom = paddle2Y+PADDLE_HEIGHT/2;

  if (paddleTop > ballY) {
    paddle2Y -= 1;
  } else if (paddleBottom < ballY) {
    paddle2Y += 1;
  }
}

const updateEverything = () => {
  // ball direction
  if (ballX <= BALL_SIZE/2|| ballX >= canvas.width-BALL_SIZE/2) {
    ballReset();
  }

  // hits left paddle
  if (ballX === PADDLE_WIDTH && 
      ballY >= paddle1Y-PADDLE_HEIGHT/2 &&
      ballY <= paddle1Y+PADDLE_HEIGHT/2) {
    ballSpeedX = -ballSpeedX
  }

  // hit right paddle
  if (ballX === canvas.width-PADDLE_WIDTH &&
      ballY >= paddle2Y-PADDLE_HEIGHT/2 &&
      ballY <= paddle2Y+PADDLE_HEIGHT/2) {
    ballSpeedX = -ballSpeedX;
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
  // board
  colorRect(0, 0, canvas.width, canvas.height, "black");
  
  // left player
  colorRect(0, paddle1Y-PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
  
  // right player
  colorRect(canvas.width-PADDLE_WIDTH, paddle2Y-PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
  
  // ball
  colorCircle(ballX, ballY, BALL_SIZE, "white");
};

const colorRect = (leftX, topY, width, height, color) => {
  canvasContext.fillStyle = color;
  canvasContext.fillRect(leftX, topY, width, height);
}

const colorCircle = (centerX, centerY, radius, color) => {
  canvasContext.fillStyle = color;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
  canvasContext.fill();
};

