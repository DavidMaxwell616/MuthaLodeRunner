var game = new Phaser.Game(800,500, 
  Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});


function create() {
  if (!startGame) 
    mainMenuCreate(this);
  else gameCreate();
}

function gameCreate() {
  graphics = game.add.graphics(0, 0);
if (localStorage.getItem(localStorageName) == null)
    highScore = 0;
 else 
    highScore = localStorage.getItem(localStorageName);
  blocks = game.add.sprite(0, 0, 'blocks');
   levelData = game.cache.getJSON('levelData');
   currLevel = levelData.levels['level-001'];
   buildLevel(currLevel);
    player = game.add.image(400, 225, 'player');
    scaleToGame(player,.036,.036);
    player.anchor.setTo(0);
  game.cursors = game.input.keyboard.createCursorKeys();
  player.playerMode = PLAYER_STATE.STILL;
  player.frame = 30;
  drawInfoText(
    `LEVEL: ${level}`,
    game.width/2,
    220,
    64,
    COLOR_WHITE,
    'IMPACT',
    5000,
  );
  drawStats();

}

  function scaleToGame(obj,wpercent,hpercent)
  {
      obj.width=game.width*wpercent;
      obj.height=game.width*hpercent;
      obj.scale.y=obj.scale.x;
    }

    function drawInfoText(text, x, y, size, color, font, delay) {
      infoText = game.add.text(x, y, text, {
        fill: color,
        font: `${size}pt ${font}`,
      });
      infoText.updateText();
      // infoText.anchor.setTo(0.5, 0.5);
     if(delay>0) 
        textTimer = game.time.events.add(delay, infoText.destroy, infoText);
      infoText.anchor.setTo(0.5);
      return infoText;
    }
    
  function buildLevel(levelMap) {
     for (let y = 0; y < levelMap.length; y++) {
      for (let x = 0; x < levelMap[y].length; x++) {
         const tile = levelMap[y][x];
        const blockX = BASE_TILE_WIDTH * x*GAME_SCALE;
        const blockY = BASE_TILE_HEIGHT * y * GAME_SCALE;
        let sprite;
        if (tile === '$') totalCoins++;
        const value = TILE_MAP[tile];
        if(value!=undefined){
           sprite = game.add.sprite(blockX, blockY, 'blocks', value);
            scaleToGame(sprite,.036,.036);
            blockSizeX = sprite.width;
            blockSizeY = sprite.height;
            if (DEBUG_MODE) drawRectangle(sprite);
          }
      }
    }
  }

  function drawStats(){
  levelText = drawInfoText(
    `LEVEL: ${level}`,
    100,
    game.height-50,
    32,
    COLOR_WHITE,
    'IMPACT',
    0,
  );
  livesText = drawInfoText(
    `LIVES: ${lives}`,
    400,
    game.height-50,
    32,
    COLOR_WHITE,
    'IMPACT',
    0,
  );
  scoreText = drawInfoText(
    `SCORE: ${score}`,
    680,
    game.height-50,
    32,
    COLOR_WHITE,
    'IMPACT',
    0,
  );

}
function update() {
  if (!startGame) {
    mainMenuUpdate();
    return;
  }

var playerBlockX = Math.floor(player.x/blockSizeX);
var playerBlockY = Math.floor(player.y/blockSizeY)+1;
player.BlockOn = {y: playerBlockY,x: playerBlockX};
player.BlockAbove = {y: playerBlockY-1,x: playerBlockX}; 
player.BlockBelow = {y: playerBlockY+1,x: playerBlockX};
player.BlockLeft = {y: playerBlockY,x: playerBlockX-1};
player.BlockRight = {y: playerBlockY,x: playerBlockX+1};
// var block = GetBlockValue(player.BlockOn);
// switch (block) {
//   case 'H':
//       player.playerMode = PLAYER_STATE.CLIMBING;
//       break;
//     case '':
//       //player.playerMode = PLAYER_STATE.FALLING;
//       break;
  
//   default:
//     break;
// }

block = GetBlockValue(player.BlockBelow);
switch (block) {
    case ' ':
      player.playerMode = PLAYER_STATE.FALLING;
      break;
      case 'H':
        player.playerMode = PLAYER_STATE.CLIMBING;
        break;
  default:
    console.log(block);
    break;
}

if(player.playerMode!=PLAYER_STATE.STILL)
  player.frame++;
  if(player.playerMode!=PLAYER_STATE.FALLING){
  if (game.cursors.left.isDown && player.x>0) {
if(player.playerMode == PLAYER_STATE.STILL && player.playerMode!=PLAYER_STATE.FALLING)
player.x-=15;
    player.playerMode = PLAYER_STATE.LEFT;
    playerRun(-RUNNER_SPEED);
  }
  if (game.cursors.right.isDown && player.x<game.width) {
    if(player.playerMode == PLAYER_STATE.STILL){
    player.x+=RUNNER_SPEED;
       player.playerMode = PLAYER_STATE.RIGHT;}
    playerRun(RUNNER_SPEED);
  }
  if(game.cursors.right.isUp && game.cursors.left.isUp)
  {
    player.playerMode = PLAYER_STATE.STILL;
    player.frame = 30;
  }
}
updateStats();
}

function GetBlockValue(block){
return(currLevel[block.y][block.x]);
}

function drawRectangle(sprite){
  graphics.lineStyle(1, 0xff);
  graphics.drawRect(sprite.x,sprite.y,Math.abs(sprite.width),Math.abs(sprite.height));
}


function updateStats(){
  levelText.setText('LEVEL: ' +level);
  livesText.setText('LIVES: '+lives);
  scoreText.setText('SCORE: ' + score);
}

function playerRun(direction){
  var scale = direction<0?1:-1;
  player.scale.x=scale;
  player.frame = player.frame<11?player.frame++:player.frame=1;
  player.width = blockSizeX * scale ;
  player.x+=direction;
}