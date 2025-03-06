// Game configuration with physics enabled
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#87CEEB', // This is just the default background color
  physics: {
    default: 'arcade', // Enable Arcade physics
    arcade: {
      gravity: { y: 0 },  // No gravity for now
      debug: true          // Set to true to visualize physics boundaries
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player;
let cursors;
let tables = [];  // Array to hold table sprites
let playerSpeed = 300;

function preload() {
  console.log('Preloading assets...');
  this.load.image('table', 'assets/table.png');     // Your table sprite
  this.load.image('background', 'assets/background.png'); // Load the background image
  // Load the player sprite sheets
  this.load.spritesheet('player_down', 'assets/player_down.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('player_up', 'assets/player_up.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('player_left', 'assets/player_left.png', { frameWidth: 16, frameHeight: 16 });
  this.load.spritesheet('player_right', 'assets/player_right.png', { frameWidth: 16, frameHeight: 16 });
}

function create() {
  console.log('Creating the player and tables...');

  // Add the background image and position it to fill the entire screen
  this.add.image(400, 300, 'background').setOrigin(0.5, 0.5).setDisplaySize(config.width, config.height);

  // Create animations for movement (down, up, left, right)
  this.anims.create({
    key: 'walkDown',
    frames: this.anims.generateFrameNumbers('player_down', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walkUp',
    frames: this.anims.generateFrameNumbers('player_up', { start: 0, end: 2 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walkLeft',
    frames: this.anims.generateFrameNumbers('player_left', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'walkRight',
    frames: this.anims.generateFrameNumbers('player_right', { start: 0, end: 1 }),
    frameRate: 10,
    repeat: -1
  });

  // Create the player sprite and add physics
  player = this.physics.add.sprite(100, 300, 'player_down');
  player.setScale(4.5);  // Scale player to 50% size
  player.setCollideWorldBounds(true);  // Prevent player from going out of bounds

  // Create the cursor keys for player movement
  cursors = this.input.keyboard.createCursorKeys();

  // Add tables (2x2 grid in the center of the screen)
  let tableSpacing = 250;
  let startX = 325;
  let startY = 200;

  // Create the 2x2 grid of tables
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      let table = this.physics.add.sprite(startX + i * tableSpacing, startY + j * tableSpacing, 'table');
      table.setScale(0.25);
      table.body.setImmovable(true);  // Make the table static (immovable)

      // Store table in the tables array
      tables.push(table);

      // Enable debugging to visualize the collision
      table.body.debugBodyColor = 0xff0000;
    }
  }

  // Enable collision between the player and the tables
  tables.forEach(table => {
    this.physics.add.collider(player, table);
  });
}

function update() {
  player.setVelocity(0);

  // Handle player movement based on arrow key input
  if (cursors.left.isDown) {
    player.setVelocityX(-playerSpeed);
    player.anims.play('walkLeft', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(playerSpeed);
    player.anims.play('walkRight', true);
  } else if (cursors.up.isDown) {
    player.setVelocityY(-playerSpeed);
    player.anims.play('walkUp', true);
  } else if (cursors.down.isDown) {
    player.setVelocityY(playerSpeed);
    player.anims.play('walkDown', true);
  } else {
    player.anims.stop();
  }
}

// Initialize the game
const game = new Phaser.Game(config);