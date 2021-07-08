var game = new Phaser.Game(800,500, 
  Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});


function create() {
  if (!startGame) 
    mainMenuCreate(this);
  else gameCreate();
}

function gameCreate() {
  blocks = game.add.sprite(0, 0, 'blocks');
   levelData = game.cache.getJSON('levelData');
   currLevel = levelData.levels['level-001'];
   buildLevel(currLevel);
    player = game.add.image(400, 225, 'player');
    scaleToGame(player,.036,.036);
  game.cursors = game.input.keyboard.createCursorKeys();
  player.state = PLAYER_STATE.STILL;
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

  if(player.state!=PLAYER_STATE.STILL)
  player.frame++;
  
  if (game.cursors.left.isDown) {
    player.state = PLAYER_STATE.LEFT;
    playerRun(-RUNNER_SPEED);
  }
  if (game.cursors.right.isDown) {
   player.state = PLAYER_STATE.RIGHT;
    playerRun(RUNNER_SPEED);
  }
  if(game.cursors.right.isUp && game.cursors.left.isUp)
  {
    player.state = PLAYER_STATE.STILL;
    player.frame = 30;
  }
updateStats();
}

function updateStats(){
  levelText.setText('LEVEL: ' +level);
  livesText.setText('LIVES: '+lives);
  scoreText.setText('SCORE: ' + score);
}

function playerRun(direction){
  player.scale.x=direction<0?1:-1;
  player.frame = player.frame<11?player.frame++:player.frame=1;
  player.x+=direction;
}