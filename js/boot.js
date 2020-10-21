const WINDOW_WIDTH =64 ;  // size of window
const WINDOW_HEIGHT =  48;
const BACKGROUND_WIDTH  =  32;   // size of window
const BACKGROUND_HEIGHT =  24;
const MAX_BACKGROUND  =    200;
const MAX_MONKS =7;
const START_LEVEL  = 1;
const MAX_MELTING_BLOCKS =4;
const ON         =   1;
const OFF        =   0;

const EMPTY      =   0;
const FLOOR      =   1;
const LADDER     =   2;
const ROPE       =   3;
const GOLD       =   4;
const SOLID_FLOOR =  5;
const MELT_BLOCK  =  6;

const STILL      =   0;
const RIGHT      =   1;
const LEFT       =   2;
const UP         =   3;
const DOWN       =   4;
const FALLING    =   5;
const BLAST_LEFT  =  6;
const BLAST_RIGHT =  7;
const ROPE_RIGHT  =  8;
const ROPE_LEFT   =  9;
const TRAPPED     =  10;

var forcefall=0;
var round=0;
var level=START_LEVEL;
var men_left=5;
var varro_state=0;
var gameover=0;
var beingkilled=0;
var seq_melt_block1=0,seq_melt_block2=5;
var blast_count;
var melt_block_used;
var delay;
var melt_counter;
//var monk_moving[MAX_MONKS],monk_x[MAX_MONKS],monk_y[MAX_MONKS];
//var monk_x_block[MAX_MONKS],monk_y_block[MAX_MONKS];
var start_level,turn=0;		//start from level selected under options
//var map[BACKGROUND_WIDTH][BACKGROUND_HEIGHT];		//map
var player_x,player_y,player_moving=LEFT;
var player_x_block, player_y_block;	//location of the block
var timer;		//timer of the game
var round2;
var blast;
var speed;				//speed of the game
var score, dels;		//game score and number of rows deleted
var high_score;
//var melt_block_x_block[5],melt_block_y_block[5];
var num_monks=3;
var numgold=5;
var numblocks,index,blockcount;
var seq_right=11,seq_left=0,seq_falling=42,seq_climb=22;
var seq_rope_right=30,seq_rope_left=36;
var seq_left_blast=0,seq_right_blast=9;
var seq_monk_left=10,seq_monk_right=0,seq_monk_fall=20,seq_monk_climb=24;
var seq_monk_rope_right=42,seq_monk_rope_left=32;
var seq_killing1,seq_killing2=5;
var startGame = true;