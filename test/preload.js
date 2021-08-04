//function to preload all our game sprites
function preload() {
    //this is for codepen to allow images hosted on my website
    game.load.crossOrigin = "anonymous";
    
    game.load.image('ground', 'assets/platform.png');
    game.load.image('coin', 'assets/coin.png');
    game.load.image('player', 'assets/hero.png');
    game.load.image('enemy', 'assets/baddie.png');
    game.load.image('ladder', 'assets/ladder.png');
  }