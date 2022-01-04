var game = new Phaser.Game(1120,640, 
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
  objects.enableBody = true;
  blocks = game.add.group();
  ladders = game.add.group();
  xladders = game.add.group();
  lode = game.add.group();
  lode.enableBody = true;
  solids = game.add.group();
  enemies = game.add.group();
  rope = game.add.group();
  levelData = game.cache.getJSON('levelData');
  currLevel = levelData.levels['level-001'];
  player = game.add.sprite(0,0, 'player');
  scaleToGame(player,.036,.036);
  player.anchor.setTo(0.5);
  buildLevel(currLevel);
  game.physics.arcade.enable(player);
  player.body.bounce.y = 0.2;
  player.dead = false;
  player.onLadder = false;
  player.onRope = false;
 
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
        const blockX = BASE_TILE_WIDTH * x*GAME_SCALE+20;
        const blockY = BASE_TILE_HEIGHT * y * GAME_SCALE;
        let sprite;
        if (tile === '$') totalCoins++;
        const value = OBJECT_MAP[tile];
        if(tile!=' '){
          sprite = game.add.sprite(blockX, blockY, 'objects', value);
          scaleToGame(sprite,.036,.036);
          blockSizeX = sprite.width; 
          blockSizeY = sprite.height;
          sprite.anchor.setTo(0.5);
          game.physics.arcade.enable(sprite);
          switch (tile) {
            case '#':
              sprite.body.immovable = true;
              blocks.add(sprite);
              break;
            case 'H':
              sprite.body.immovable = true;
              ladders.add(sprite);
              break;
            case 'S':
              sprite.body.immovable = true;
              sprite.visible = false;
              xladders.add(sprite);
              break;
            case '$':
              sprite.body.immovable = true;
              lode.add(sprite);
              break;
            case '@':
              sprite.body.immovable = true;
                 solids.add(sprite);
              break;
              case '-':
                sprite.body.immovable = true;
                rope.add(sprite);
              break;
              case '&':
                player.x = blockX;
                player.y = blockY-10;
                break;
              case '0':
                createEnemy(blockX,blockY);  
              break;
             
            default:
              break;
          } 
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
    game.physics.arcade.enable(sprite);
    sprite.frame = 5;
    //sprite.body.immovable = true;
}

  function drawStats(){
  levelText = drawInfoText(
    `LEVEL: ${level}`,
    game.width*.1,
    game.height-20,
    32,
    COLOR_WHITE,
    'IMPACT',
    0,
  );
  livesText = drawInfoText(
    `LIVES: ${lives}`,
    game.width*.5,
    game.height-20,
    32,
    COLOR_WHITE,
    'IMPACT',
    0,
  );
  scoreText = drawInfoText(
    `SCORE: ${score}`,
    game.width*.9,
    game.height-20,
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
  player.onLadder = false;
  player.onRope = false;
  player.onGround = false;
  game.physics.arcade.collide(player, blocks, isOnGround);
  game.physics.arcade.collide(lode, blocks);
  game.physics.arcade.overlap(player, ladders, isOnLadder);
  game.physics.arcade.overlap(player, rope, isOnRope);
  game.physics.arcade.collide(enemies, blocks);
  game.physics.arcade.overlap(player, lode, CollectGold, null, this);


  if(player.onRope)
{
  if(player.frame<21) player.frame = 21;
  if(player.frame<30) player.frame++; else player.frame = 21;
}
if(player.onLadder)
{
  if(player.playerMode==PLAYER_STATE.CLIMBING)
    if(player.frame<20) player.frame++; else player.frame = 11;
  if (game.cursors.up.isDown && player.y>0) {
    player.playerMode=PLAYER_STATE.CLIMBING
    player.y--;
   }
  if(game.cursors.up.isUp && game.cursors.down.isUp && player.onLadder)
  {
    player.playerMode = PLAYER_STATE.STILL;
  }
}
if(!player.onGround)
  player.y+=2;

if(player.playerMode==PLAYER_STATE.LEFT || player.playerMode==PLAYER_STATE.RIGHT)
  player.frame++;
  
  if(player.playerMode!=PLAYER_STATE.FALLING){
  if (game.cursors.left.isDown && player.x>player.width/2) {
  if(player.playerMode == PLAYER_STATE.STILL)
    player.x-=PLAYER_SPEED;
    player.playerMode = PLAYER_STATE.LEFT;
    playerRun(-PLAYER_SPEED);
  }

  if (game.cursors.right.isDown && player.x<game.width-20) {
    if(player.playerMode == PLAYER_STATE.STILL){
    player.x+=PLAYER_SPEED;
       player.playerMode = PLAYER_STATE.RIGHT;}
    playerRun(PLAYER_SPEED);
  }
  
  if(game.cursors.right.isUp && game.cursors.left.isUp && !player.onLadder)
  {
    player.playerMode = PLAYER_STATE.STILL;
    player.frame = 30;
  }
  updateStats();
}
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

function playerClimb(direction){
  player.frame = player.frame<20?player.frame++:player.frame=11;
  player.y+=direction;
}

function playerRun(direction){
  var scale = direction<0?1:-1;
  player.scale.x=scale;
  player.frame = player.frame<11?player.frame++:player.frame=1;
  player.width = blockSizeX * scale ;
  player.x+=direction;
}

function isOnGround(sprite, ground)
{
  sprite.onGround = true;
}

function isOnLadder(sprite, ladder)
{
  sprite.onLadder = Math.abs(ladder.x-sprite.x)<8;
}
function isOnRope(sprite, rope)
{
  sprite.onRope = true;
}
function CollectGold (player, gold) {

  score += 50;
  gold.destroy();
  lode.remove(gold);
  if(lode.children.length==0)
  xladders.forEach(ladder => {
    ladder.visible = true;    
  });
}