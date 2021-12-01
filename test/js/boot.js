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
var enemyMovePolicy = [ [0, 0, 0], //* move_map is used to find *//
                   [0, 1, 1], //* wheather to move a enm   *//
                   [1, 1, 1], //* by indexing into it with *//
                   [1, 2, 1], //* enm_byte + num_enm +     *//
                   [1, 2, 2], //* set_num to get a byte.   *//
                   [2, 2, 2], //* then that byte is checked*//
                   [2, 2, 3], //* for !=0 and then decrmnt *//
                   [2, 3, 3], //* for next test until = 0  *// 
                   [3, 3, 3], 
                   [3, 3, 4],
                   [3, 4, 4],
                   [4, 4, 4]
];
