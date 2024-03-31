// Where the player is now
let playerX;
let playerY;

// How tall and wide the player is
let playerHeight = 20;
let playerWidth = 20;

// How fast a player speeds up left or right
let playerAcceleration = 2;

// How fast a player can move
let playerTopSpeed = 10;

// How high the player can jump
let jumpForce = -40;

// How fast the player is moving now
let playerVelocityY = 0;
let playerVelocityX = 0;

// How fast the player falls
let gravity = 0.2;

// How slippery moving is
let groundFriction = 0.4;
let airFriction = 0.06;

function setup() {
	createCanvas(400, 300);

	if (debugMode) {
		frameRate(15);
	}

	this.focus();
	rectMode(CORNERS);
	newGame();
}

let debugMode = true;
function draw() {
	checkInputs();
	drawLevel();
	applyPhysics();
	drawPlayer();
	if (debugMode) {
		drawDebugInfo();
	}
}

function checkInputs() {
	if (keyIsDown(65)) {
		move("left");
	}

	if (keyIsDown(68)) {
		move("right");
	}
}

let bg_color = "black";
function drawLevel() {
	background(bg_color);

	defaultLevel();

	drawExit(levelExit_X, levelExit_Y, levelExit_Size);
}

function defaultLevel() {
	drawFloor(50, 250, 60, "grey");
	drawFloor(150, 200, 30, "grey");

	drawTrickyFloor(50, 170, 50);
	drawTrickyFloor(137, 141, 50);
}

function drawFloor(x, y, w, c) {
	fill(c);
	rect(x, y, x + w, y + 10);
}

function drawTrickyFloor(x, y, w) {
	fill("lightblue");
	rect(x, y, x + w, y + 4);
}

function drawBlock(x, y) {
	fill("darkred");
	rect(x, y, x + 30, y + 30);
}

function drawPlayer() {
	fill("red");
	rect(playerX, playerY, playerX + playerWidth, playerY - playerHeight);
}

//Where the level exit icon is
let levelExit_X;
let levelExit_Y;
let levelExit_Size;
function newGame() {
	playerY = height;
	playerX = width / 2;
	levelExit_X = 255;
	levelExit_Y = 70;
	levelExit_Size = 75;
	player_won = false;
	airborn = false;
}

function drawExit(x, y, size) {
	textSize(size / 3);
	textAlign(CENTER, CENTER);
	text("😀", x + size / 2, y + size / 2);
	if (
		(x <= playerX) &
		(playerX <= x + size) &
		(y <= playerY) &
		(playerY <= y + size)
	) {
		YouWin();
	}
}

let player_won = false;
function YouWin() {
	player_won = true;
	textSize(75);
	fill("yellow");
	text("YOU WIN!!!", width / 2, height / 2);
	textSize(20);
	fill("white");
	text("Press space to restart.", width / 2, height * 0.75);
	text("Change what happens when you win!", width / 2, height * 0.9);
	playerVelocityX = 0;
	playerVelocityY = 0;
}

function keyPressed() {
	if (key == " ") {
		move("up");
		if (player_won) {
			newGame();
		}
	}
}

function drawDebugInfo() {
	fill("white");
	textSize(10);
	noStroke();
	textAlign(LEFT);

	let [opX, opY] = [playerVelocityX, playerVelocityY].map((value) =>
		value < 0 ? " - " : " + "
	);

	let [X, Y, vY, vX] = [playerX, playerY, playerVelocityY, playerVelocityX].map(
		(value) => abs(value).toFixed(2)
	);

	text(`Y: ${Y}${opY}${vY}`, 5, 10);
	text(`X: ${X}${opX}${vX}`, 5, 20);
	text(`airborn: ${airborn}`, 5, 30);
}

function applyFriction() {
	playerVelocityX = lerp(
		playerVelocityX,
		0,
		airborn ? airFriction : groundFriction
	);
}

let airborn;
function applyPhysics() {
	playerVelocityX = constrain(playerVelocityX, -playerTopSpeed, playerTopSpeed);
	playerVelocityY = airborn
		? lerp(playerVelocityY, playerTopSpeed, gravity)
		: 0;

	applyFriction();
	enforceCollisions();

	playerX += playerVelocityX;
	playerY += playerVelocityY;

	checkBoundaries();
}

function checkBoundaries() {
	playerX = constrain(playerX, 0, width - playerWidth);
	playerY = constrain(playerY, 0, height);
}

function enforceCollisions() {}

function move(direction) {
	if (direction == "up" && playerVelocityY == 0) {
		playerVelocityY += jumpForce;
		airborn = true;
	}

	if (direction == "left") {
		playerVelocityX -= playerAcceleration;
	}
	if (direction == "right") {
		playerVelocityX += playerAcceleration;
	}
}

function mouseClicked() {
	console.log(`${mouseX}, ${mouseY}`);
}
