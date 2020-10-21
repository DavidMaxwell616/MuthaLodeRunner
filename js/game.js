var game = new Phaser.Game(900, 500, Phaser.AUTO, 'phaser-example', 
{preload: preload, create: create, update: update});

function create() {
  if (!startGame) mainMenuCreate(this);
    else 
  gameCreate();
}

function gameCreate() {
}

function update() {

  if (!startGame)
    return;

}


function render() {
}
