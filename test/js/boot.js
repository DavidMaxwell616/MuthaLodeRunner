var player,
enemy,
platforms,
ladders,
cursors,
lode;
var onLadder = false,
onRope = false;
var score = 0,
scoreText;
var playerSpeed = 4;
var enemySpeed = 4;
var gravity = 1000;
var levelData;
var currLevel;
var blocks;
var solids;
var ladders;
var xladders;
var lode;
var ropes;
var enemies;
var goldCount = 0;
var level =1;
var hiscoreText;
var hiscore = 0;
var onGround = false;
var climbing = false;
var dropping = false;
const MOVE_STATE = {
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
    'TRAPPED' : 10,
    'CLIMBING_OUT' : 11
}
