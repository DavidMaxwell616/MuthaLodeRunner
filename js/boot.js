const BASE_TILE_WIDTH = 20;
const BASE_TILE_HEIGHT = 20;
const MAP_WIDTH = 56;
const MAP_HEIGHT = 32;
const OBJECT_MAP = {
' ': 0, //air
'#': 1, //brick
'$' : 2, //coin
'0' : 3, //guard
'-' : 4, //rope
'H' : 5, //ladder
'S' : 6, //xLadder
'@' : 7, //block
};
const GAME_SCALE = 1.35;
const DEBUG_MODE = false;
let graphics;
let blockSizeX;
let blockSizeY;
let localStorageName = "MuthaLodeRunner";

let player;
let guards;
let objects;
let ladders;
let xladders;
let lode;
let blocks;
let levels;
let solids;
let rope;
let onRope = false;
let climbing = false;
let running = false;
let gameObjects = [];

const COLOR_WHITE = 'rgb(255,255,255)';
let onLadder = false;
let onXLadder = false;
let score = 0;
let scoreText;
let lives = 3;
let livesText;
let level = 1;
let currLevel;
let levelText;
let playerBlock;
let onPlatform = false;
let currLadder;
let currRope;
let totalCoins = 0;
let letGo = false;
let startGame = false;
let splash;
var i=0;
let fireKey;
const ENEMY_SPEED = 1;
const PLAYER_SPEED = 3;
const PLAYER_STATE = {
'STILL':0,
'RIGHT':1,
'LEFT' :2,
'UP' : 3,
'DOWN' : 4,
'FALLING' : 5,
'BLAST_LEFT' : 6,
'BLAST_RIGHT' : 7,
'ROPE_RIGHT' : 8,
'ROPE_LEFT' :9,
'TRAPPED' : 10
}