const BASE_TILE_X = 40;
const BASE_TILE_Y = 44;

const TILE_MAP = {
' ': 0, //air
'#': 1, //brick
'$' : 2, //coin
'0' : 3, //guard
'-' : 4, //rope
'H' : 5, //ladder
'S' : 6, //hLadder
'@' : 7, //block
};

let player;
let guards;
let ladders;
let cursors;
let coins;
let ropes;
let hLadders;
let bricks;
let blocks;
let levels;
let onRope = false;
let climbing = false;
let running = false;

let onLadder = false;
let onHLadder = false;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let level = 1;
let currLevel;
let levelText;
let playerSpeed = 250;
let guardSpeed = 125;
let gravity = 500;
let playerBlock;
let onPlatform = false;
let currLadder;
let currRope;
let totalCoins = 0;
let objects;
let letGo = false;
let startGame = false;
let splash;