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

var playerSpeed = 250, 
gravity = 500

//create our game object... remember it's
//width, height, rendering context (canvas, webgl or auto), DOM ID, object of essential phaser functions
var game = new Phaser.Game(800, 560, Phaser.AUTO, 'game', 
{ preload: preload, create: create, update: update });

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
var levelNumber =1;
var hiscoreText;
var hiscore = 0;

function create() {
    levelData = game.cache.getJSON('levelData');
    currLevel = levelData.levels['level-00'+levelNumber];
    game.stage.backgroundColor = "#243166";
    score = 0;
    game.physics.startSystem(Phaser.Physics.ARCADE);

    blocks = game.add.group();
    solids = game.add.group();
    ladders = game.add.group();
    xladders = game.add.group();
    lode = game.add.group();
    ropes = game.add.group();
    enemies = game.add.group();

    player = game.add.sprite(32, game.world.height - 150, 'player');
    buildLevel(currLevel);

    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = gravity;
    player.body.collideWorldBounds = true;
    player.dead = false;
    player.anchor.setTo(.5, .5);

    levelText = game.add.text(game.world.width*.45, game.world.height-35, 'LEVEL: '+levelNumber, { fontSize: '18px', fill: '#eee' });
    hiscoreText = game.add.text(game.world.width*.8, game.world.height-35, 'HIGH SCORE: '+hiscore, { fontSize: '18px', fill: '#eee' });
    scoreText = game.add.text(16, game.world.height-35, 'SCORE: '+score, { fontSize: '18px', fill: '#eee' });
    cursors = game.input.keyboard.createCursorKeys();
}

function buildLevel(levelMap)
{
    for (let y = 0; y < levelMap.length; y++) {
        for (let x = 0; x < levelMap[y].length; x++) {
           const tile = levelMap[y][x];
           if(tile!=' '){
            const blockX = x*32;
            const blockY = y *32;
            switch (tile) {
                case '#':
                  blocks.add(makeSprite(blockX,blockY,'block',true));
                  break;
                case '@':
                    solids.add(makeSprite(blockX,blockY,'solid',true));
                    break;
                case 'H':
                    ladders.add(makeSprite(blockX,blockY,'ladder',true));
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
                    player.y = blockY-10;
                    break;
                case '0':
                    createEnemy(blockX,blockY);  
                default:
                   break;
           }
        }
    }
}
}

function createEnemy(x,y){
    var sprite = game.add.sprite(x,y, 'enemy');
    game.physics.arcade.enable(sprite);
    sprite.body.allowGravity = true;
    return sprite;
}

function makeSprite(x,y,type,visible)
{
    var sprite = game.add.sprite(x, y, type);
    game.physics.arcade.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;
    sprite.visible = visible;
    return sprite;
}
function isOnLadder()
{
  onLadder = true;
}

function update() {enemies
    onLadder = false;
    onRope = false;
    player.body.gravity.y = gravity;
    game.physics.arcade.collide(player, blocks);
    game.physics.arcade.collide(lode, blocks);
    game.physics.arcade.collide(enemies, blocks);

    game.physics.arcade.overlap(player, enemy, hitenemy);
    game.physics.arcade.overlap(player, ladders, a=>{onLadder=true});
    game.physics.arcade.overlap(player, ropes, a=>{onRope=true});
    game.physics.arcade.overlap(player, lode, collectGold, null, this);
    player.body.velocity.x = 0;

    if(!player.dead)
    {
        if (cursors.left.isDown)
        {
            player.body.velocity.x = -playerSpeed;
        }
        else if (cursors.right.isDown)
        {
            player.body.velocity.x = playerSpeed;
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.body.velocity.y = -playerSpeed;
        }
        if(onRope)
        {
            player.body.gravity.y = 0;
        }
        if(onLadder)
        {
            player.body.gravity.y = 0;
            player.body.velocity.y = 0;
            if(cursors.up.isDown)
            {
                player.body.velocity.y = -playerSpeed/2;
            }
            if(cursors.down.isDown)
            {
                player.body.velocity.y = playerSpeed/2;
            }
            if((!cursors.up.isDown && !cursors.down.isDown) && !game.input.pointer1.isDown)
            {
                player.body.gravity.y = 0;
                player.body.velocity.y = 0;
            }
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
                    player.body.velocity.y = playerSpeed/2;
                }
                if(game.input.y < player.body.y - player.body.height)
                {
                    player.body.velocity.y = -playerSpeed/2;
                }
            }
        }
    }
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

