// globals
var canvas;
var canvasContext;

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 60;


const BALL_SIZE = 10;
var ballX = 50;
var ballY = 100;
var ballSpeedX = 1;
var ballSpeedY = 1;

const calculateMousePos = () => {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
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

  const fps = 144;
  setInterval(() => {
    updateEverything();
    drawEverything();
  }, 1000 / fps);
};

const updateEverything = () => {
  // ball direction
  if (ballX <= BALL_SIZE/2|| ballX >= canvas.width-BALL_SIZE/2) {
    ballSpeedX = ballSpeedX * -1;
  }

  if (ballY <= BALL_SIZE/2 || ballY >= canvas.height-BALL_SIZE/2) {
    ballSpeedY *= -1;
  }

  // update
  ballX += ballSpeedX;
  ballY += ballSpeedY;
};

const drawEverything = () => {
  colorRect(0, 0, canvas.width, canvas.height, "black");
  colorRect(0, canvas.height/2-PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
  colorRect(canvas.width-10, canvas.height/2-PADDLE_HEIGHT/2, PADDLE_WIDTH, PADDLE_HEIGHT, "white");
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

