//function to preload all our game sprites
function preload() {
    //this is for codepen to allow images hosted on my website
    game.load.crossOrigin = "anonymous";
    
    game.load.image('rope', 'assets/rope.png');
    game.load.image('block', 'assets/platform.png');
    game.load.image('gold', 'assets/coin.png');
    game.load.image('solid', 'assets/solid.png');
    game.load.image('player', 'assets/hero.png');
    game.load.image('enemy', 'assets/baddie.png');
    game.load.image('ladder', 'assets/ladder.png');
    game.load.json('levelData', 'assets/levels.json');
  }