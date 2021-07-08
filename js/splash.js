function mainMenuCreate(scene) {
  splash = game.add.image(0, 0, 'splash');
  splash.width = game.width;
  splash.height = game.height;
  maxxdaddy = game.add.image(game.width * 0.75, game.height * 0.91, 'maxxdaddy');
  game.input.onDown.addOnce(StartGame, this);
 game.fireButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
}

function mainMenuUpdate() {
  if (game.fireButton.isDown) {StartGame();}
}

function StartGame() {
  if (game.fireButton.isDown) {
    game.spaceKey = null;
    splash.visible = false;
    maxxdaddy.visible = false;
    gameCreate();
    startGame = true;
  }
}