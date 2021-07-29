var game = new Phaser.Game(800,500, 
  Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});


function create() {
  if (!startGame) 
    mainMenuCreate(this);
  else gameCreate();
}

function gameCreate() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  graphics = game.add.graphics(0, 0);
if (localStorage.getItem(localStorageName) == null)
    highScore = 0;
 else 
    highScore = localStorage.getItem(localStorageName);
  
  objects = game.add.sprite(0, 0, 'objects');
  blocks = game.add.group();
  ladders = game.add.group();
  xladders = game.add.group();
  gold = game.add.group();
  solids = game.add.group();
  enemies = game.add.group();
  rope = game.add.group();
  levelData = game.cache.getJSON('levelData');
  currLevel = levelData.levels['level-001'];
   game.stage.backgroundColor = '#000000';
   player = game.add.image(0,0, 'player');
    scaleToGame(player,.036,.036);
    player.anchor.setTo(0.5);
   buildLevel(currLevel);
     game.physics.arcade.enable(player);
     player.dead = false;

  game.cursors = game.input.keyboard.createCursorKeys();
  player.playerMode = PLAYER_STATE.STILL;
  player.frame = 30;
  drawInfoText(
    `LEVEL: ${level}`,
    game.width/2,
    120,
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
        const value = OBJECT_MAP[tile];
          sprite = game.add.sprite(blockX, blockY, 'objects', value);
          scaleToGame(sprite,.036,.036);
          blockSizeX = sprite.width;
          blockSizeY = sprite.height;
          sprite.anchor.setTo(0.5);
          switch (tile) {
            case '#':
               blocks.add(sprite);
              break;
            case 'H':
              ladders.add(sprite);
              break;
            case 'S':
                sprite.visible = false;
                xladders.add(sprite);
                break;
              case '$':
                gold.add(sprite);
              break;
              case '@':
                solids.add(sprite);
              break;
              case '-':
                rope.add(sprite);
              break;
              case '&':
                player.x = blockX;
                player.y = blockY;
                break;
              case '0':
                createEnemy(blockX,blockY);  
              break;
             
            default:
              break;
          } 
          
          
          //   if (DEBUG_MODE) drawRectangle(sprite.x-sprite.width/2,sprite.y-sprite.height/2,sprite.width,sprite.height,0xffffff);
          //   gameObjects.push(sprite);
      }
    }
  }

  function createEnemy(x,y){
    sprite = game.add.sprite(x,y, 'enemy');
    scaleToGame(sprite,.036,.036);
    blockSizeX = sprite.width;
    blockSizeY = sprite.height;
    sprite.anchor.setTo(0.5);
sprite.frame = 5;
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
  //drawRectangle(player.x-5,player.y-5,10,10,0xffffff);
 
var playerBlockX = Math.floor(player.x/blockSizeX)+1;
var playerBlockY = Math.floor(player.y/blockSizeY)+1;
player.BlockOn = {y: playerBlockY,x: playerBlockX};
//var block = GetBlockValue(player.BlockOn);
//console.log(block);
// switch (block) {
//   case 'H':
//       player.playerMode = PLAYER_STATE.CLIMBING;
//       player.frame = 11;
//       break;
//     case '':
//       //player.playerMode = PLAYER_STATE.FALLING;
//       break;
  
//   default:
//     break;
// }

// block = GetBlockValue(player.BlockBelow);
// switch (block) {
//   case '#':
//      if(player.playerMode==PLAYER_STATE.FALLING) 
//        player.playerMode = PLAYER_STATE.STILL;
//       break;
//     case ' ':
//       player.playerMode = PLAYER_STATE.FALLING;
//       break;
//       case 'H':
//         player.playerMode = PLAYER_STATE.CLIMBING;
//         break;
//   default:
//     console.log(block);
//     break;
// }

if(player.playerMode==PLAYER_STATE.LEFT || player.playerMode==PLAYER_STATE.RIGHT)
  player.frame++;
  //console.log(player.BlockOn.x,
    //x,Math.abs(player.x+blockSizeX/2-player.BlockOn.x*blockSizeX+(blockSizeX/2)));
 
  if(player.playerMode==PLAYER_STATE.FALLING)
 player.y+=RUNNER_SPEED;
 
  if(player.playerMode!=PLAYER_STATE.FALLING){
  if (game.cursors.left.isDown && player.x>player.width/2) {
if(player.playerMode == PLAYER_STATE.STILL && player.playerMode!=PLAYER_STATE.FALLING)
player.x-=PLAYER_SPEED;
    player.playerMode = PLAYER_STATE.LEFT;
    playerRun(-PLAYER_SPEED);
  }

  if (game.cursors.right.isDown && player.x<game.width-100) {
    if(player.playerMode == PLAYER_STATE.STILL){
    player.x+=PLAYER_SPEED;
       player.playerMode = PLAYER_STATE.RIGHT;}
    playerRun(PLAYER_SPEED);
  }
  
  if(game.cursors.right.isUp && game.cursors.left.isUp)
  {
    player.playerMode = PLAYER_STATE.STILL;
    player.frame = 30;
    if(playerOnRope())
    {
    player.frame = 11;
    player.playerMode = PLAYER_STATE.CLIMBING;
  }
  }
}
updateStats();
}

function playerOnRope(){
  return GetBlockValue(player.BlockOn)=="H";
}

function GetBlockValue(block){
return(currLevel[block.y][block.x]);
}

function drawRectangle(x,y,w,h,color){
  graphics.lineStyle(1, color);
  graphics.drawRect(x,y,Math.abs(w),Math.abs(h));
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