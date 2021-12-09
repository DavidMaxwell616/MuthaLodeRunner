var game = new Phaser.Game(896, 560, Phaser.AUTO, 'game', 
{ preload: preload, create: create, update: update });


function create() {
    levelData = game.cache.getJSON('levelData');
    var lvl = String(level).padStart(3, '0');
    currLevel = levelData.levels['level-'+lvl];
    game.stage.backgroundColor = "#243166";
    score = 0;
 
    blocks = game.add.group();
    solids = game.add.group();
    ladders = game.add.group();
    xladders = game.add.group();
    lode = game.add.group();
    ropes = game.add.group();
    enemies = game.add.group();

    player = game.add.sprite(32, game.world.height - 150, 'player');
    buildLevel(currLevel);
    player.dead = false;
    player.anchor.setTo(.5, .5);

    levelText = game.add.text(game.world.width*.45, game.world.height-35, 'LEVEL: '+level, { fontSize: '18px', fill: '#eee' });
    hiscoreText = game.add.text(game.world.width*.8, game.world.height-35, 'HIGH SCORE: '+hiscore, { fontSize: '18px', fill: '#eee' });
    scoreText = game.add.text(16, game.world.height-35, 'SCORE: '+score, { fontSize: '18px', fill: '#eee' });
    cursors = game.input.keyboard.createCursorKeys();
}

function destroyLevel(){
    blocks.forEach(sprite => {
        removeSprite(sprite);
    });
    solids.forEach(sprite => {
        removeSprite(sprite);
    });
    ladders.forEach(sprite => {
        removeSprite(sprite);
    });
    xladders.forEach(sprite => {
        removeSprite(sprite);
    });
    ropes.forEach(sprite => {
        removeSprite(sprite);
    });
    enemies.forEach(sprite => {
        removeSprite(sprite);
    });
}

function buildLevel(levelMap)
{
    for (let y = 0; y < levelMap.length; y++) {
        for (let x = 0; x < levelMap[y].length; x++) {
           const tile = levelMap[y][x];
           if(tile!=' '){
            const blockX = 16+ x*32;
            const blockY = 16+y *32;
            switch (tile) {
                case '#':
                case 'X':
                    blocks.add(makeSprite(blockX,blockY,'block',true));
                    break;
                case '@':
                    solids.add(makeSprite(blockX,blockY,'solid',true));
                    break;
                case 'H':
                    ladders.add(makeSprite(blockX,blockY,'ladder',true));
                    ///console.log(blockX,blockY);
                    break;
                case 'S':
                    xladders.add(makeSprite(blockX,blockY,'ladder',false));
                    break;
                case '$':
                    lode.add(makeSprite(blockX,blockY,'gold',true));
                    goldCount++;
                    break;
                case '-':
                    ropes.add(makeSprite(blockX,blockY,'rope',true));
                    break;
                case '&':
                    player.x = blockX;
                    player.y = blockY;
                    break;
                case '0':
                    enemies.add(createEnemy(blockX,blockY));  
                default:
                   break;
           }
        }
    }
}
}

function createEnemy(x,y){
    var sprite = game.add.sprite(x,y, 'enemy');
    return sprite;
}

function moveEnemies(){
enemies.forEach(enemy => {
    var dx = player.x - enemy.x;
    var dy = player.y - enemy.y;

if(enemy.move != MOVE_STATE.FALLING)
{
if(dy==0)
{
    if(dx>0)
    enemy.move = MOVE_STATE.RIGHT;
    else
    enemy.move = MOVE_STATE.LEFT;
// if(Math.abs(dx) > Math.abs(dy)){
    //   if(dx<0) enemy.move = MOVE_STATE.LEFT;
    //   if(dx>0) enemy.move = MOVE_STATE.RIGHT;
    //  }
    //  else
    //  {
    //   if(dy<0) enemy.move = MOVE_STATE.UP;
    //   if(dy>0) enemy.move = MOVE_STATE.DOWN;
    //  }
}

    switch (enemy.move) {
        case MOVE_STATE.LEFT:
            enemy.x-=enemySpeed;            
            break;
        case MOVE_STATE.RIGHT:
            enemy.x+=enemySpeed;            
            break;
        default:
            break;
 }
}
});
}

function makeSprite(x,y,type,visible)
{
    var sprite = game.add.sprite(x, y, type);
    game.physics.arcade.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.anchor.setTo(.5, .5);
    sprite.visible = visible;
    return sprite;
}

function update() {
    onLadder = false;
    onRope = false;
    onGround = false;

    moveEnemies();
    
//    player.isOnGround = 

if(goldCount ==0)
    xladders.forEach(ladder => {
    ladder.visible = true;       
});

if(onLadder && player.y-player.height/2==0){
    destroyLevel();
    level++
    var lvl = String(level).padStart(3, '0');
    currLevel = levelData.levels['level-'+lvl];
    buildLevel(currLevel);
}
 
if(!player.dead)
    {
        //player.x = 2 * Math.round(player.x / 2);
        //console.log(player.x);
    if (cursors.left.isDown && player.x-player.width/2>0)
        {
            climbing = false;
            player.x-=playerSpeed;
        }
        else if (cursors.right.isDown && player.x+player.width/2< game.width)
        {
            climbing = false;
            player.x+=playerSpeed;
        }

        if (cursors.up.isDown && player.touchingDown)
        {
            player.y-=playerSpeed;;
        }
        if(onRope && !dropping)
        {
            if(cursors.down.isDown)
                dropping = true;
         }
        if(onLadder)
        {
            if(cursors.up.isDown)
            {

                climbing = true;
                player.y -= playerSpeed;
            }
            if(cursors.down.isDown)
            {
                climbing = true;
                player.y += playerSpeed;
            }
            // if((!cursors.up.isDown && !cursors.down.isDown) && !game.input.pointer1.isDown)
            // {
            //     player.body.gravity.y = 0;
            //     player.body.velocity.y = 0;
            // }
        }

    if(cursors.down.isDown ){
       // player.x = 2 * Math.round(player.x / 2);
    }

    if (game.input.pointer1.isDown || game.input.pointer2.isDown)
        {   
            if (game.input.x < player.body.x - player.body.width) 
            {      
                player.body.velocity.x = -playerSpeed;        
            }    
            if (game.input.x > player.body.x + player.body.width) 
            {      
                player.body.velocity.x = playerSpeed;
            } 
            if(game.input.y < player.body.y - player.body.height && player.body.touching.down)
            {
                player.body.velocity.y = -playerSpeed;
            }

            if(onLadder)
            {
                if(game.input.y > player.body.y + player.body.height)
                {
                    climbing = true;
                    player.body.velocity.y = playerSpeed/2;
                }
                if(game.input.y < player.body.y - player.body.height)
                {
                    climbing = true;
                    player.body.velocity.y = -playerSpeed/2;
                }
            }
        }
    }
}

function isOnGround(bodyA,bodyB){
    onGround = true;
    dropping=false;
}

function isOnLadder(bodyA,bodyB){
     if(climbing)
        bodyA.x = bodyB.x;
    onLadder=true;
}

function isOnRope(bodyA,bodyB){
    if(!dropping)
        bodyA.y = bodyB.y;
    
   onRope=true;
}


function collectGold (player, coin) {
   if(!coin.hit && !player.dead)
   {
        coin.hit = true;
        removeSprite(coin);
        goldCount--;
        score += 10;
        scoreText.text = 'SCORE: ' + score;
   }
}

function hitenemy(player, enemy) {
    if (enemy.body.touching.up && !enemy.hit) 
    {
        enemy.hit = true;
        //enemy.body.velocity.y = -100;
        //enemy.body.velocity.x = 0;

       // player.body.velocity.y = -gravity;
        removeSprite(enemy);
        //var enemyTween = game.add.tween(enemy),
        //enemyScaleTween = game.add.tween(enemy.scale);

        //enemyTween.to({ alpha: 0, angle: 360}, 1000, Phaser.Easing.Linear.None);
        //enemyScaleTween.to({ x: .5, y:.5 }, 1000, Phaser.Easing.Linear.None);

        //when tween is finished, remove sprite
        //enemyTween.onComplete.add(removeSprite);
      
        //enemyScaleTween.start();
        //enemyTween.start();
    }

    else
    {
        player.dead = true;
        player.body.velocity.y =-playerSpeed;
        player.body.velocity.x = 0;
        restartGame();

        // var playerTween = game.add.tween(player),
        // playerScaleTween = game.add.tween(player.scale);
        // playerTween.to({ alpha: 0,  angle: 360}, 500, Phaser.Easing.Linear.None);
        // playerScaleTween.to({ x: .5, y:.5 }, 500, Phaser.Easing.Linear.None);
        // playerScaleTween.onComplete.add(restartGame);
        // playerScaleTween.start();
        // playerTween.start();
    }
}

function removeSprite(sprite) {
    sprite.kill();
}

function switchDirection(enemy)
{
   enemy.body.velocity.x *= -1;
   enemy.previousX = enemy.x;
}


function restartGame()
{
  game.state.start(game.state.current);
}

