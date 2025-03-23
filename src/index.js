// Main Menu Scene
class MainMenu extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenu' });
  }

  preload() {
    console.log('Preloading main menu assets...');
    this.load.image('menuBackground', 'assets/menuBackground.png');
    this.load.image('playButton', 'assets/playButton.png');
    this.load.image('menuTitle', 'assets/menuTitle.png');
  }

  create() {
    console.log('Creating main menu...');
    this.add.image(400, 300, 'menuBackground').setOrigin(0.5, 0.5).setDisplaySize(config.width, config.height);
    let menuTitle = this.add.image(400, 150, 'menuTitle');
    let scaleFactor = (config.width - 40) / menuTitle.width;
    menuTitle.setScale(scaleFactor);

    let playButton = this.add.image(400, 350, 'playButton').setInteractive();
    playButton.setScale(0.33);

    // Add hover effect
    playButton.on('pointerover', () => {
      playButton.setScale(0.35);  // Slightly increase size when hovering
    });

    playButton.on('pointerout', () => {
      playButton.setScale(0.33);  // Reset size when the hover ends
    });

    playButton.on('pointerdown', () => {
      this.scene.start('GameScene');
    });
  }
}

// Game Scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    console.log('Preloading game assets...');
    this.load.image('table', 'assets/table.png');
    this.load.image('gameBackground', 'assets/gameBackground.png');
    this.load.image('notification', 'assets/notification.png');
    this.load.spritesheet('player_down', 'assets/player_down.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player_up', 'assets/player_up.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player_left', 'assets/player_left.png', { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('player_right', 'assets/player_right.png', { frameWidth: 16, frameHeight: 16 });
    this.load.image('closeButton', 'assets/closeButton.png');  // Close button asset
    this.load.image('submitButton', 'assets/submitButton.png');  // Submit button asset
    this.load.image('inventoryButton', 'assets/inventoryButton.png');  // Inventory button asset
    this.load.image('DetectorShop', 'assets/Detector_shop.png');  // Detector shop asset
    this.load.image('SignalShop', 'assets/Signal_shop.png');  // Signal shop asset
    this.load.image('PowerShop', 'assets/Power_shop.png');  // Power shop asset
    this.load.image('DAQShop', 'assets/DAQ_shop.png');  // DAQ shop asset
    this.load.image('DeployShop', 'assets/Deployment_shop.png');  // Deployment type shop asset
    this.load.image('FFShop', 'assets/Form_shop.png');  // Form factor shop asset
  }

  create() {
    console.log('Creating the player and tables...');
    this.playerSpeed = 300;
    this.isCustomerMenuOpen = false;  // Flag for the customer menu
    this.isDetectorShopMenuOpen = false;  
    this.isPowerShopMenuOpen = false;  
    this.isSignalShopMenuOpen = false;  
    this.isDAQShopMenuOpen = false;  
    this.isDeployShopMenuOpen = false;  
    this.isFFShopMenuOpen = false;  
    this.isInventoryMenuOpen = false; // Flag for the inventory menu

    // Add background image for the game scene
    this.add.image(400, 300, 'gameBackground').setOrigin(0.5, 0.5).setDisplaySize(1600, config.height);

    // Make detector shop
    this.add.image(80, 240, 'DetectorShop').setOrigin(0.5, 0.5).setScale(0.15); 

    // Make signal shop
    this.add.image(80, 390, 'SignalShop').setOrigin(0.5, 0.5).setScale(0.15); 

    // Make power shop
    this.add.image(80, 540, 'PowerShop').setOrigin(0.5, 0.5).setScale(0.15); 

    // Make DAQ shop
    this.add.image(1120, 240, 'DAQShop').setOrigin(0.5, 0.5).setScale(0.15); 

    // Make deployment type shop
    this.add.image(1120, 390, 'DeployShop').setOrigin(0.5, 0.5).setScale(0.15); 

    // Make form factor shop
    this.add.image(1120, 540, 'FFShop').setOrigin(0.5, 0.5).setScale(0.15); 

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
    this.player = this.physics.add.sprite(100, 100, 'player_down');
    this.player.setScale(4.5);
    this.player.setCollideWorldBounds(true);

    // Create the cursor keys for player movement
    this.cursors = this.input.keyboard.createCursorKeys();

    // Add tables (2x2 grid in the center of the screen)
    let tableSpacing = 250;
    let startX = 350;
    let startY = 175;
    this.tables = [];
    this.CustomerIcon = null;       // Customer notification icon reference
    this.CustomerPrompt = null;     // Customer notification prompt reference
    this.DetectorShopPrompt = null; // Detector shop prompt reference
    this.SignalShopPrompt = null; // Signal shop prompt reference
    this.PowerShopPrompt = null; // Power shop prompt reference
    this.DAQShopPrompt = null; // DAQ shop prompt reference
    this.DeployShopPrompt = null; // Deploy shop prompt reference
    this.FFShopPrompt = null; // FF shop prompt reference

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        let table = this.physics.add.sprite(startX + i * tableSpacing, startY + j * tableSpacing, 'table');
        table.setScale(0.25);
        table.body.setImmovable(true);  // Make the table static (immovable)
        this.tables.push(table);
        this.physics.add.collider(this.player, table);
      }
    }

    // Move the notification CustomerIcon to Table 6 (rightmost table on the second row)
    let table6X = startX + 2 * tableSpacing;
    let table6Y = startY + 1 * tableSpacing;
    this.CustomerIcon = this.add.image(table6X, table6Y - 30, 'notification').setScale(0.1);  // Scale to half size

    // Add a transparent box behind the customer notification prompt text
    this.CustomerPromptTextBox = this.add.graphics();
    this.CustomerPromptTextBox.fillStyle(0x000000, 0.5);  // Set black color with 50% transparency
    this.CustomerPromptTextBox.fillRect(225, 530, 345, 40);  // Box size and position

    // Add the CustomerPrompt text
    this.CustomerPrompt = this.add.text(400, 550, 'Press [SPACE] to talk!', {
      fontSize: '24px', 
      fill: '#FF0000',    // Red color
      stroke: '#000000',  // Black stroke (outline)
      strokeThickness: 4  // Thickness of the outline
    }).setOrigin(0.5, 0.5);

    // Initially hide the CustomerPrompt and background box
    this.CustomerPrompt.setAlpha(0);
    this.CustomerPromptTextBox.setAlpha(0);

    ////////////////////////
    // Add a transparent box behind the detector shop prompt text
    this.DetectorShopPromptTextBox = this.add.graphics();
    this.DetectorShopPromptTextBox.fillStyle(0x000000, 0.5);  // Set black color with 50% transparency
    this.DetectorShopPromptTextBox.fillRect(225, 530, 345, 40);  // Box size and position

    // Add the DetectorShopPrompt text
    this.DetectorShopPrompt = this.add.text(400, 550, 'Press [Q] to pick a detector!', {
      fontSize: '24px', 
      fill: '#FF0000',    // Red color
      stroke: '#000000',  // Black stroke (outline)
      strokeThickness: 4  // Thickness of the outline
    }).setOrigin(0.5, 0.5);

    // Initially hide the DetectorShopPrompt and background box
    this.DetectorShopPrompt.setAlpha(0);
    this.DetectorShopPromptTextBox.setAlpha(0);
    ///
    //Signal shop code
    this.SignalShopPromptTextBox = this.add.graphics();
    this.SignalShopPromptTextBox.fillStyle(0x000000, 0.5);  
    this.SignalShopPromptTextBox.fillRect(225, 530, 345, 40);
    this.SignalShopPrompt = this.add.text(400, 550, 'Press [W] to pick a signal collector!', {
      fontSize: '24px', 
      fill: '#FF0000',    // Red color
      stroke: '#000000',  // Black stroke (outline)
      strokeThickness: 4  // Thickness of the outline
    }).setOrigin(0.5, 0.5);
    this.SignalShopPrompt.setAlpha(0);
    this.SignalShopPromptTextBox.setAlpha(0);
    ///
    //Power shop code
    this.PowerShopPromptTextBox = this.add.graphics();
    this.PowerShopPromptTextBox.fillStyle(0x000000, 0.5);  
    this.PowerShopPromptTextBox.fillRect(225, 530, 345, 40);
    this.PowerShopPrompt = this.add.text(400, 550, 'Press [E] to pick a power supply!', {
      fontSize: '24px', 
      fill: '#FF0000',    // Red color
      stroke: '#000000',  // Black stroke (outline)
      strokeThickness: 4  // Thickness of the outline
    }).setOrigin(0.5, 0.5);
    this.PowerShopPrompt.setAlpha(0);
    this.PowerShopPromptTextBox.setAlpha(0);
    ///
    //DAQ shop code
    this.DAQShopPromptTextBox = this.add.graphics();
    this.DAQShopPromptTextBox.fillStyle(0x000000, 0.5);  
    this.DAQShopPromptTextBox.fillRect(225, 530, 345, 40);
    this.DAQShopPrompt = this.add.text(400, 550, 'Press [A] to pick a DAQ type!', {
      fontSize: '24px', 
      fill: '#FF0000',    // Red color
      stroke: '#000000',  // Black stroke (outline)
      strokeThickness: 4  // Thickness of the outline
    }).setOrigin(0.5, 0.5);
    this.DAQShopPrompt.setAlpha(0);
    this.DAQShopPromptTextBox.setAlpha(0);
    ///
    //Deploy shop code
    this.DeployShopPromptTextBox = this.add.graphics();
    this.DeployShopPromptTextBox.fillStyle(0x000000, 0.5);  
    this.DeployShopPromptTextBox.fillRect(225, 530, 345, 40);
    this.DeployShopPrompt = this.add.text(400, 550, 'Press [S] to pick a deployment!', {
      fontSize: '24px', 
      fill: '#FF0000',    // Red color
      stroke: '#000000',  // Black stroke (outline)
      strokeThickness: 4  // Thickness of the outline
    }).setOrigin(0.5, 0.5);
    this.DeployShopPrompt.setAlpha(0);
    this.DeployShopPromptTextBox.setAlpha(0);
    ///
    //FF shop code
    this.FFShopPromptTextBox = this.add.graphics();
    this.FFShopPromptTextBox.fillStyle(0x000000, 0.5);  
    this.FFShopPromptTextBox.fillRect(225, 530, 345, 40);
    this.FFShopPrompt = this.add.text(400, 550, 'Press [D] to pick a form factor!', {
      fontSize: '24px', 
      fill: '#FF0000',    // Red color
      stroke: '#000000',  // Black stroke (outline)
      strokeThickness: 4  // Thickness of the outline
    }).setOrigin(0.5, 0.5);
    this.FFShopPrompt.setAlpha(0);
    this.FFShopPromptTextBox.setAlpha(0);
    ///////////////////////
    
    // Set the world bounds to the new world size (1200px wide, 600px tall)
    this.physics.world.setBounds(0, 0, 1200, 600);

    // Adjust the camera to show the whole world
    this.cameras.main.setBounds(0, 0, 1200, 600);
    this.cameras.main.startFollow(this.player); // Follow the player as they move

    // Customer menu setup
    this.CustomerMenuBox = this.add.graphics();
    this.CustomerMenuCloseButton = this.add.image(0, 0, 'closeButton').setInteractive();
    this.CustomerMenuCloseButton.setScale(0.050); // Scale the close button to X% size
    this.CustomerMenuCloseButton.on('pointerdown', this.closeCustomerMenu, this);

    // Create the submit button
    this.submitButton = this.add.image(0, 0, 'submitButton').setInteractive();
    this.submitButton.setScale(0.25); // Scale the submit button to X% size
    this.submitButton.on('pointerdown', this.onSubmitButtonClick, this);

    // Initially hide the customer menu box, submit button, and close button
    this.CustomerMenuBox.setAlpha(0);
    this.CustomerMenuCloseButton.setAlpha(0);
    this.submitButton.setAlpha(0);
    
    ///////////////////////
    // Detector shop menu setup
    this.DetectorShopMenuBox = this.add.graphics();
    this.DetectorShopMenuCloseButton = this.add.image(0, 0, 'closeButton').setInteractive();
    this.DetectorShopMenuCloseButton.setScale(0.050); // Scale the close button to X% size
    this.DetectorShopMenuCloseButton.on('pointerdown', this.closeDetectorShopMenu, this);
    // Initially hide the Detector shop menu box and close button
    this.DetectorShopMenuBox.setAlpha(0);
    this.DetectorShopMenuCloseButton.setAlpha(0);
    //this.submitButton.setAlpha(0);

    // Signal shop menu setup
    this.SignalShopMenuBox = this.add.graphics();
    this.SignalShopMenuCloseButton = this.add.image(0, 0, 'closeButton').setInteractive();
    this.SignalShopMenuCloseButton.setScale(0.050); // Scale the close button to X% size
    this.SignalShopMenuCloseButton.on('pointerdown', this.closeSignalShopMenu, this);
    this.SignalShopMenuBox.setAlpha(0);
    this.SignalShopMenuCloseButton.setAlpha(0);

    // Power shop menu setup
    this.PowerShopMenuBox = this.add.graphics();
    this.PowerShopMenuCloseButton = this.add.image(0, 0, 'closeButton').setInteractive();
    this.PowerShopMenuCloseButton.setScale(0.050); // Scale the close button to X% size
    this.PowerShopMenuCloseButton.on('pointerdown', this.closePowerShopMenu, this);
    this.PowerShopMenuBox.setAlpha(0);
    this.PowerShopMenuCloseButton.setAlpha(0);

    // DAQ shop menu setup
    this.DAQShopMenuBox = this.add.graphics();
    this.DAQShopMenuCloseButton = this.add.image(0, 0, 'closeButton').setInteractive();
    this.DAQShopMenuCloseButton.setScale(0.050); // Scale the close button to X% size
    this.DAQShopMenuCloseButton.on('pointerdown', this.closeDAQShopMenu, this);
    this.DAQShopMenuBox.setAlpha(0);
    this.DAQShopMenuCloseButton.setAlpha(0);

    // Deploy shop menu setup
    this.DeployShopMenuBox = this.add.graphics();
    this.DeployShopMenuCloseButton = this.add.image(0, 0, 'closeButton').setInteractive();
    this.DeployShopMenuCloseButton.setScale(0.050); // Scale the close button to X% size
    this.DeployShopMenuCloseButton.on('pointerdown', this.closeDeployShopMenu, this);
    this.DeployShopMenuBox.setAlpha(0);
    this.DeployShopMenuCloseButton.setAlpha(0);

    // FF shop menu setup
    this.FFShopMenuBox = this.add.graphics();
    this.FFShopMenuCloseButton = this.add.image(0, 0, 'closeButton').setInteractive();
    this.FFShopMenuCloseButton.setScale(0.050); // Scale the close button to X% size
    this.FFShopMenuCloseButton.on('pointerdown', this.closeFFShopMenu, this);
    this.FFShopMenuBox.setAlpha(0);
    this.FFShopMenuCloseButton.setAlpha(0);
    ///////////////////////
    
    // Inventory Button Setup (Top-right corner)
    this.inventoryButton = this.add.image(0, 0, 'inventoryButton').setInteractive();
    this.inventoryButton.setScale(0.25); // Adjust button size
    this.inventoryButton.on('pointerdown', this.showInventory, this);
    // Initially hide the inventory button in the game
    this.inventoryButton.setAlpha(1); 

    // Set up the inventory structure
    this.player.inventoryCategories = [
      { name: 'Detector', item: null },
      { name: 'Signal Collection', item: null },
      { name: 'Power Supply', item: null },
      { name: 'Data Acquisition', item: null },
      { name: 'Deployment', item: null },
      { name: 'Form Factor', item: null }
    ];
  }

  showCustomerMenu() {
    this.isCustomerMenuOpen = true; // Set the menu to open, preventing movement
    this.player.setVelocity(0);     // Stop the player immediately when the menu is opened

    // Use the camera view to calculate position and size of the menu box
    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25; // 25 pixels offset from the left of the camera view
    let boxY = camera.worldView.y + 25; // 25 pixels offset from the top of the camera view
    let boxWidth = 750;  // Width of the menu box
    let boxHeight = 550; // Height of the menu box

    // Draw the menu box based on the camera's view
    this.CustomerMenuBox.clear();
    this.CustomerMenuBox.fillStyle(0x000000, 1.0);  // Dark background with full opacity
    this.CustomerMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Position the close button at the bottom right of the menu box
    this.CustomerMenuCloseButton.setPosition(boxX + boxWidth - 50, boxY + boxHeight - 50);  // Adjust position

    // Position the submit button to the left of the close button
    this.submitButton.setPosition(this.CustomerMenuCloseButton.x - 120, this.CustomerMenuCloseButton.y); // Adjust the position, was 60

    // Make the menu, submit button, and close button visible
    this.CustomerMenuBox.setAlpha(1);
    this.CustomerMenuCloseButton.setAlpha(1);
    this.submitButton.setAlpha(1);
  }

  closeCustomerMenu() {
    this.isCustomerMenuOpen = false; // Close the menu, allowing player movement

    // Hide the menu box, submit button, and close button
    this.CustomerMenuBox.setAlpha(0);
    this.CustomerMenuCloseButton.setAlpha(0);
    this.submitButton.setAlpha(0);
  }
/*
  showDetectorShopMenu() {
    this.isDetectorShopMenuOpen = true; // Set the menu to open, preventing movement
    this.player.setVelocity(0); // Stop the player immediately when the menu is opened

    // Use the camera view to calculate position and size of the menu box
    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25; // 25 pixels offset from the left of the camera view
    let boxY = camera.worldView.y + 25; // 25 pixels offset from the top of the camera view
    let boxWidth = 750; // Width of the menu box
    let boxHeight = 550; // Height of the menu box

    // Draw the menu box based on the camera's view
    this.DetectorShopMenuBox.clear();
    this.DetectorShopMenuBox.fillStyle(0x000000, 1.0); // Dark background with full opacity
    this.DetectorShopMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Position the close button at the bottom right of the menu box
    this.DetectorShopMenuCloseButton.setPosition(boxX + boxWidth - 50, boxY + boxHeight - 50); // Adjust position

    // Create buttons for detector options and store them in this.detectorButtons
    const detectorOptions = ['Plastic', 'NaI', 'Stilbene', 'He-3', 'HPGe', 'None'];
    this.detectorButtons = []; // Initialize the array to store references to the buttons
    this.selectedButton = null; // Variable to keep track of the selected button

    // Define the button's Y-position based on the box's Y position and some spacing
    const buttonSpacing = 50;
    let buttonY = boxY + 100;

    detectorOptions.forEach((option, index) => {
        let button = this.add.text(boxX + 50, buttonY, option, { fontSize: '20px', fill: '#FFFFFF' })
            .setInteractive()
            .on('pointerdown', () => this.selectDetector(option, button)) // Attach selectDetector callback
            .on('pointerover', () => {
                button.setStyle({ fill: '#FF0000' }); // Change color on hover
            })
            .on('pointerout', () => {
                if (this.selectedButton !== button) {  // Keep green color for selected button
                    button.setStyle({ fill: '#FFFFFF' }); // Reset color when hover ends
                }
            });

        // Store the button reference for later hiding
        this.detectorButtons.push(button);

        // Adjust the Y-position for the next button
        buttonY += buttonSpacing;
    });

    // Make the menu, submit button, and close button visible
    this.DetectorShopMenuBox.setAlpha(1);
    this.DetectorShopMenuCloseButton.setAlpha(1);
  }
  */
  ///////

  showDetectorShopMenu() {
    this.isDetectorShopMenuOpen = true; // Set the menu to open, preventing movement
    this.player.setVelocity(0); // Stop the player immediately when the menu is opened

    // Use the camera view to calculate position and size of the menu box
    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25; // 25 pixels offset from the left of the camera view
    let boxY = camera.worldView.y + 25; // 25 pixels offset from the top of the camera view
    let boxWidth = 750; // Width of the menu box
    let boxHeight = 550; // Height of the menu box

    // Draw the menu box based on the camera's view
    this.DetectorShopMenuBox.clear();
    this.DetectorShopMenuBox.fillStyle(0x000000, 1.0); // Dark background with full opacity
    this.DetectorShopMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Position the close button at the bottom right of the menu box
    this.DetectorShopMenuCloseButton.setPosition(boxX + boxWidth - 50, boxY + boxHeight - 50); // Adjust position

    // Create buttons for detector options and store them in this.detectorButtons
    const detectorOptions = ['Plastic', 'NaI', 'Stilbene', 'He-3', 'HPGe', 'None'];
    const detectorDescriptions = {
        'Plastic': 'Plastic detectors are simple and inexpensive detectors.',
        'NaI': 'Sodium Iodide (NaI) detectors are widely used in gamma spectroscopy.',
        'Stilbene': 'Stilbene detectors offer high performance in neutron detection.',
        'He-3': 'Helium-3 detectors are used for thermal neutron detection.',
        'HPGe': 'High-purity germanium (HPGe) detectors provide excellent energy resolution.',
        'None': 'No detector selected, choose one to use.'
    };

    this.detectorButtons = []; // Initialize the array to store references to the buttons
    this.selectedButton = null; // Variable to keep track of the selected button

    // Create a description text box on the right side of the menu box
    this.descriptionBox = this.add.graphics();
    this.descriptionBox.fillStyle(0xA9A9A9, 1.0); // White background
    this.descriptionBox.fillRect(boxX + boxWidth - 350, boxY + 100, 320, boxHeight - 200); // Position it on the right side
    this.descriptionText = this.add.text(boxX + boxWidth - 340, boxY + 120, '', { fontSize: '16px', fill: '#000000', wordWrap: { width: 300 } });

    // Define the button's Y-position based on the box's Y position and some spacing
    const buttonSpacing = 50;
    let buttonY = boxY + 100;

    detectorOptions.forEach((option, index) => {
        let button = this.add.text(boxX + 50, buttonY, option, { fontSize: '20px', fill: '#FFFFFF' })
            .setInteractive()
            .on('pointerdown', () => this.selectDetector(option, button)) // Attach selectDetector callback
            .on('pointerover', () => {
                button.setStyle({ fill: '#FF0000' }); // Change color on hover
                // Update the description box with the corresponding text
                this.descriptionText.setText(detectorDescriptions[option]);
                this.descriptionBox.setAlpha(1); // Make description box visible
            })
            .on('pointerout', () => {
                if (this.selectedButton !== button) {  // Keep green color for selected button
                    button.setStyle({ fill: '#FFFFFF' }); // Reset color when hover ends
                }
                // Hide the description box when no button is hovered
                this.descriptionBox.setAlpha(0);
            });

        // Store the button reference for later hiding
        this.detectorButtons.push(button);

        // Adjust the Y-position for the next button
        buttonY += buttonSpacing;
    });

    // Make the menu, submit button, and close button visible
    this.DetectorShopMenuBox.setAlpha(1);
    this.DetectorShopMenuCloseButton.setAlpha(1);
  }
  /////////

  selectDetector(selectedDetector, selectedButton) {
    // Find the Detector category in the inventoryCategories array
    const detectorCategory = this.player.inventoryCategories.find(category => category.name === 'Detector');

    // If the Detector category exists, update its item
    if (detectorCategory) {
        detectorCategory.item = selectedDetector;
    } else {
        // If for some reason the 'Detector' category doesn't exist, log an error or create it
        console.error('Detector category not found in inventoryCategories.');
    }

    // If a button was previously selected, reset its color to white
    if (this.selectedButton) {
        this.selectedButton.setStyle({ fill: '#FFFFFF' });
    }

    // Highlight the selected button by changing its color to green
    selectedButton.setStyle({ fill: '#00FF00' });

    // Update the selectedButton reference
    this.selectedButton = selectedButton;
  }

/*
  closeDetectorShopMenu() {
    this.isDetectorShopMenuOpen = false;

    // Hide the menu elements
    this.DetectorShopMenuBox.setAlpha(0);
    this.DetectorShopMenuCloseButton.setAlpha(0);
    this.detectorButtons.forEach(button => {
        button.setAlpha(0); // Hide each button
    });
    // Reset the selectedButton so the color reset is handled the next time
    this.selectedButton = null;
  }
  */

  closeDetectorShopMenu() {
    this.isDetectorShopMenuOpen = false;

    // Hide the menu elements
    this.DetectorShopMenuBox.setAlpha(0);
    this.DetectorShopMenuCloseButton.setAlpha(0);
    this.detectorButtons.forEach(button => {
        button.setAlpha(0); // Hide each button
    });
    this.descriptionBox.setAlpha(0);
    this.descriptionText.setAlpha(0);
    // Reset the selectedButton so the color reset is handled the next time
    this.selectedButton = null;
  }


//////////////////////////////
  showSignalShopMenu() {
    this.isSignalShopMenuOpen = true; // Set the menu to open, preventing movement
    this.player.setVelocity(0);     // Stop the player immediately when the menu is opened

    // Use the camera view to calculate position and size of the menu box
    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25; // 25 pixels offset from the left of the camera view
    let boxY = camera.worldView.y + 25; // 25 pixels offset from the top of the camera view
    let boxWidth = 750;  // Width of the menu box
    let boxHeight = 550; // Height of the menu box

    // Draw the menu box based on the camera's view
    this.SignalShopMenuBox.clear();
    this.SignalShopMenuBox.fillStyle(0x000000, 1.0);  // Dark background with full opacity
    this.SignalShopMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Position the close button at the bottom right of the menu box
    this.SignalShopMenuCloseButton.setPosition(boxX + boxWidth - 50, boxY + boxHeight - 50);  // Adjust position

    // Make the menu, submit button, and close button visible
    this.SignalShopMenuBox.setAlpha(1);
    this.SignalShopMenuCloseButton.setAlpha(1);
  }

  closeSignalShopMenu() {
    this.isSignalShopMenuOpen = false; // Close the menu, allowing player movement

    // Hide the menu box, submit button, and close button
    this.SignalShopMenuBox.setAlpha(0);
    this.SignalShopMenuCloseButton.setAlpha(0);
  }

  showPowerShopMenu() {
    this.isPowerShopMenuOpen = true; 
    this.player.setVelocity(0);

    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25;
    let boxY = camera.worldView.y + 25; 
    let boxWidth = 750; 
    let boxHeight = 550;

    this.PowerShopMenuBox.clear();
    this.PowerShopMenuBox.fillStyle(0x000000, 1.0);  
    this.PowerShopMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.PowerShopMenuCloseButton.setPosition(boxX + boxWidth - 50, boxY + boxHeight - 50); 
    this.PowerShopMenuBox.setAlpha(1);
    this.PowerShopMenuCloseButton.setAlpha(1);
  }

  closePowerShopMenu() {
    this.isPowerShopMenuOpen = false;
    this.PowerShopMenuBox.setAlpha(0);
    this.PowerShopMenuCloseButton.setAlpha(0);
  }

  showDAQShopMenu() {
    this.isDAQShopMenuOpen = true; 
    this.player.setVelocity(0);

    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25;
    let boxY = camera.worldView.y + 25; 
    let boxWidth = 750; 
    let boxHeight = 550;

    this.DAQShopMenuBox.clear();
    this.DAQShopMenuBox.fillStyle(0x000000, 1.0);  
    this.DAQShopMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.DAQShopMenuCloseButton.setPosition(boxX + boxWidth - 50, boxY + boxHeight - 50); 
    this.DAQShopMenuBox.setAlpha(1);
    this.DAQShopMenuCloseButton.setAlpha(1);
  }

  closeDAQShopMenu() {
    this.isDAQShopMenuOpen = false;
    this.DAQShopMenuBox.setAlpha(0);
    this.DAQShopMenuCloseButton.setAlpha(0);
  }

  showDeployShopMenu() {
    this.isDeployShopMenuOpen = true; 
    this.player.setVelocity(0);

    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25;
    let boxY = camera.worldView.y + 25; 
    let boxWidth = 750; 
    let boxHeight = 550;

    this.DeployShopMenuBox.clear();
    this.DeployShopMenuBox.fillStyle(0x000000, 1.0);  
    this.DeployShopMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.DeployShopMenuCloseButton.setPosition(boxX + boxWidth - 50, boxY + boxHeight - 50); 
    this.DeployShopMenuBox.setAlpha(1);
    this.DeployShopMenuCloseButton.setAlpha(1);
  }

  closeDeployShopMenu() {
    this.isDeployShopMenuOpen = false;
    this.DeployShopMenuBox.setAlpha(0);
    this.DeployShopMenuCloseButton.setAlpha(0);
  }

  showFFShopMenu() {
    this.isFFShopMenuOpen = true; 
    this.player.setVelocity(0);

    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25;
    let boxY = camera.worldView.y + 25; 
    let boxWidth = 750; 
    let boxHeight = 550;

    this.FFShopMenuBox.clear();
    this.FFShopMenuBox.fillStyle(0x000000, 1.0);  
    this.FFShopMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);
    this.FFShopMenuCloseButton.setPosition(boxX + boxWidth - 50, boxY + boxHeight - 50); 
    this.FFShopMenuBox.setAlpha(1);
    this.FFShopMenuCloseButton.setAlpha(1);
  }

  closeFFShopMenu() {
    this.isFFShopMenuOpen = false;
    this.FFShopMenuBox.setAlpha(0);
    this.FFShopMenuCloseButton.setAlpha(0);
  }

  onSubmitButtonClick() {
    console.log('Submit button pressed!');
  }
/*
  showInventory() {
    console.log('Inventory button pressed!');
    this.isInventoryMenuOpen = true; // Set inventory to open
    this.player.setVelocity(0);      // Stop the player immediately when the menu is opened

    // Create an empty inventory box
    this.inventoryMenuBox = this.add.graphics();
    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25;
    let boxY = camera.worldView.y + 25;
    let boxWidth = 750;
    let boxHeight = 550;

    this.inventoryMenuBox.fillStyle(0x000000, 1.0);
    this.inventoryMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Create slots for the six categories
    const slotSpacing = 60;
    const startX = boxX + 50; // Keep category labels where they were originally (left side)
    const startY = boxY + 50;

    // New position for the slots and item descriptions (move them to the right)
    const slotStartX = boxX + 250; // Move slot boxes and descriptions 250px to the right

    // Slot width increased to accommodate longer item descriptions
    const slotWidth = 250; // Increase width of the slots

    // Array to store references for labels, slots, and item text
    this.inventoryItems = [];

    for (let i = 0; i < this.inventoryCategories.length; i++) {
        let category = this.inventoryCategories[i];
        let slotY = startY + (i * slotSpacing);

        // Draw the category label (e.g., 'Detector', 'Signal Collection', etc.)
        let label = this.add.text(startX, slotY, category.name, { fontSize: '20px', fill: '#FFFFFF' });

        // Check if the category has an item; if not, show "None" next to the slot
        let itemText = category.item ? category.item : "None";

        // Draw the slot rectangle (move slot boxes to the right and increase width)
        let slot = this.add.rectangle(slotStartX + 200, slotY, slotWidth, 40, 0x888888).setOrigin(0.5, 0.5);

        // Draw the item text (either the item's name or "None") next to the slot
        let itemTextObj = this.add.text(slotStartX + 200, slotY, itemText, { fontSize: '18px', fill: '#FFFFFF' }).setOrigin(0.5, 0.5);

        // Store references to the label, slot, and item text
        this.inventoryItems.push({ label, slot, itemText: itemTextObj });
    }

    // Add the close button for the inventory menu
    this.inventoryCustomerMenuCloseButton = this.add.image(boxX + boxWidth - 50, boxY + boxHeight - 50, 'closeButton').setInteractive();
    this.inventoryCustomerMenuCloseButton.setScale(0.050);
    this.inventoryCustomerMenuCloseButton.on('pointerdown', this.closeInventory, this);

    // Make the inventory visible
    this.inventoryMenuBox.setAlpha(1);
    this.inventoryCustomerMenuCloseButton.setAlpha(1);} */

  showInventory() {
    console.log('Inventory button pressed!');
    this.isInventoryMenuOpen = true; // Set inventory to open
    this.player.setVelocity(0);      // Stop the player immediately when the menu is opened

    // Create an empty inventory box
    this.inventoryMenuBox = this.add.graphics();
    let camera = this.cameras.main;
    let boxX = camera.worldView.x + 25;
    let boxY = camera.worldView.y + 25;
    let boxWidth = 750;
    let boxHeight = 550;

    this.inventoryMenuBox.fillStyle(0x000000, 1.0);
    this.inventoryMenuBox.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Create slots for the six categories
    const slotSpacing = 60;
    const startX = boxX + 50; // Keep category labels where they were originally (left side)
    const startY = boxY + 50;

    // New position for the slots and item descriptions (move them to the right)
    const slotStartX = boxX + 250; // Move slot boxes and descriptions 250px to the right

    // Slot width increased to accommodate longer item descriptions
    const slotWidth = 250; // Increase width of the slots

    // Array to store references for labels, slots, and item text
    this.inventoryItems = []; // Keep this as a local reference, don't wipe player inventory

    // Iterate over the player inventory categories (this.player.inventoryCategories)
    for (let i = 0; i < this.player.inventoryCategories.length; i++) {
        let category = this.player.inventoryCategories[i];
        let slotY = startY + (i * slotSpacing);

        // Draw the category label (e.g., 'Detector', 'Signal Collection', etc.)
        let label = this.add.text(startX, slotY, category.name, { fontSize: '20px', fill: '#FFFFFF' });

        // Check if the category has an item; if not, show "None" next to the slot
        let itemText = category.item ? category.item : "None";

        // Draw the slot rectangle (move slot boxes to the right and increase width)
        let slot = this.add.rectangle(slotStartX + 200, slotY, slotWidth, 40, 0x888888).setOrigin(0.5, 0.5);

        // Draw the item text (either the item's name or "None") next to the slot
        let itemTextObj = this.add.text(slotStartX + 200, slotY, itemText, { fontSize: '18px', fill: '#FFFFFF' }).setOrigin(0.5, 0.5);

        // Store references to the label, slot, and item text
        this.inventoryItems.push({ label, slot, itemText: itemTextObj });
    }

    // Add the close button for the inventory menu
    this.inventoryCustomerMenuCloseButton = this.add.image(boxX + boxWidth - 50, boxY + boxHeight - 50, 'closeButton').setInteractive();
    this.inventoryCustomerMenuCloseButton.setScale(0.050);
    this.inventoryCustomerMenuCloseButton.on('pointerdown', this.closeInventory, this);

    // Make the inventory visible
    this.inventoryMenuBox.setAlpha(1);
    this.inventoryCustomerMenuCloseButton.setAlpha(1);
}

  closeInventory() {
      this.isInventoryMenuOpen = false; // Close the inventory menu

      // Hide the inventory box and close button
      this.inventoryMenuBox.setAlpha(0);
      this.inventoryCustomerMenuCloseButton.setAlpha(0);

      // Hide the inventory items (labels, slots, and item texts)
      this.inventoryItems.forEach(item => {
          item.label.setAlpha(0);     // Hide the label
          item.slot.setAlpha(0);      // Hide the slot
          item.itemText.setAlpha(0);  // Hide the item text ("None" or item name)
      });}
/*
  closeInventory() {
    this.isInventoryMenuOpen = false; // Close the inventory menu

    // Hide the inventory box and close button
    this.inventoryMenuBox.setAlpha(0);
    this.inventoryCustomerMenuCloseButton.setAlpha(0);

    // Hide the inventory items (labels, slots, and item texts)
    this.inventoryItems.forEach(item => {
        item.label.setAlpha(0);     // Hide the label
        item.slot.setAlpha(0);      // Hide the slot
        item.itemText.setAlpha(0);  // Hide the item text ("None" or item name)
    });

    // Clear the inventoryItems array if you want to reinitialize it next time
    this.inventoryItems = [];}
    */

  update() {
    if (this.isCustomerMenuOpen || this.isInventoryMenuOpen || this.isDetectorShopMenuOpen || this.isSignalShopMenuOpen || this.isPowerShopMenuOpen || this.isDAQShopMenuOpen || this.isDAQShopMenuOpen || this.isDeployShopMenuOpen || this.isFFShopMenuOpen) {
      return; // If any menu is open, prevent any player movement
    }

    this.player.setVelocity(0);

    // Handle player movement based on arrow key input
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.anims.play('walkLeft', true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.anims.play('walkRight', true);
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-this.playerSpeed);
      this.player.anims.play('walkUp', true);
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(this.playerSpeed);
      this.player.anims.play('walkDown', true);
    } else {
      this.player.anims.stop();
    }

    // Update the position of the inventory button relative to the camera
    let camera = this.cameras.main;
    this.inventoryButton.setPosition(camera.worldView.x + camera.width - 100, camera.worldView.y + 50);
    
    ////////////////////////
    // Calculate player distance to the center of the Detector Shop
    let distanceToDetectorShop = Phaser.Math.Distance.Between(this.player.x, this.player.y, 80, 240);  

    if (distanceToDetectorShop < 50) {        // Adjustable the distance threshold
      this.DetectorShopPrompt.setAlpha(1);         // Show the customer notification prompt text
      this.DetectorShopPromptTextBox.setAlpha(1);  // Show the transparent box behind the customer notification prompt text

      // Position the DetectorShopPromptTextBox and DetectorShopPrompt relative to the camera view
      let cameraX = camera.worldView.x;
      let cameraY = camera.worldView.y;

      // Clear previous drawing and draw with updated transparency
      this.DetectorShopPromptTextBox.clear();  // Clear previous rectangle
      this.DetectorShopPromptTextBox.fillStyle(0x000000, 0.5);  // Apply 50% transparency
      this.DetectorShopPromptTextBox.fillRect(cameraX + 175, cameraY + 530, 450, 40);  // Draw the box behind the text

      // Position DetectorShopPrompt text relative to the camera view
      this.DetectorShopPrompt.setPosition(cameraX + 400, cameraY + 550);  // Adjust for camera offset
    } else {
      this.DetectorShopPrompt.setAlpha(0);  // Hide the DetectorShopPrompt
      this.DetectorShopPromptTextBox.setAlpha(0);  // Hide the transparent box behind the text
    }

    // Check for spacebar press only when the DetectorShopPrompt is visible
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q), 500) && this.DetectorShopPrompt.alpha > 0) {
      console.log("Key pressed for shop menu")
      this.showDetectorShopMenu(); // Show the customer menu when space key is pressed and the customer notification prompt is visible
    }
    // Calculate player distance to the center of the Signal Shop
    let distanceToSignalShop = Phaser.Math.Distance.Between(this.player.x, this.player.y, 80, 390);  
    if (distanceToSignalShop < 50) {        
      this.SignalShopPrompt.setAlpha(1);         
      this.SignalShopPromptTextBox.setAlpha(1);
      let cameraX = camera.worldView.x;
      let cameraY = camera.worldView.y;
      this.SignalShopPromptTextBox.clear();  
      this.SignalShopPromptTextBox.fillStyle(0x000000, 0.5);  
      this.SignalShopPromptTextBox.fillRect(cameraX + 125, cameraY + 530, 550, 40); 
      this.SignalShopPrompt.setPosition(cameraX + 400, cameraY + 550); 
    } else {
      this.SignalShopPrompt.setAlpha(0);  
      this.SignalShopPromptTextBox.setAlpha(0);  
    }
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W), 500) && this.SignalShopPrompt.alpha > 0) {
      console.log("Key pressed for shop menu")
      this.showSignalShopMenu();
    }
    // Calculate player distance to the center of the Power Shop
    let distanceToPowerShop = Phaser.Math.Distance.Between(this.player.x, this.player.y, 80, 540);  
    if (distanceToPowerShop < 50) {        
      this.PowerShopPrompt.setAlpha(1);         
      this.PowerShopPromptTextBox.setAlpha(1);
      let cameraX = camera.worldView.x;
      let cameraY = camera.worldView.y;
      this.PowerShopPromptTextBox.clear();  
      this.PowerShopPromptTextBox.fillStyle(0x000000, 0.5);  
      this.PowerShopPromptTextBox.fillRect(cameraX + 150, cameraY + 530, 495, 40); 
      this.PowerShopPrompt.setPosition(cameraX + 400, cameraY + 550); 
    } else {
      this.PowerShopPrompt.setAlpha(0);  
      this.PowerShopPromptTextBox.setAlpha(0);  
    }
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E), 500) && this.PowerShopPrompt.alpha > 0) {
      console.log("Key pressed for shop menu")
      this.showPowerShopMenu();
    }
    // Calculate player distance to the center of the DAQ Shop
    let distanceToDAQShop = Phaser.Math.Distance.Between(this.player.x, this.player.y, 1120, 240);  
    if (distanceToDAQShop < 50) {        
      this.DAQShopPrompt.setAlpha(1);         
      this.DAQShopPromptTextBox.setAlpha(1);
      let cameraX = camera.worldView.x;
      let cameraY = camera.worldView.y;
      this.DAQShopPromptTextBox.clear();  
      this.DAQShopPromptTextBox.fillStyle(0x000000, 0.5);  
      this.DAQShopPromptTextBox.fillRect(cameraX + 180, cameraY + 530, 440, 40); 
      this.DAQShopPrompt.setPosition(cameraX + 400, cameraY + 550); 
    } else {
      this.DAQShopPrompt.setAlpha(0);  
      this.DAQShopPromptTextBox.setAlpha(0);  
    }
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A), 500) && this.DAQShopPrompt.alpha > 0) {
      console.log("Key pressed for shop menu")
      this.showDAQShopMenu();
    }
    // Calculate player distance to the center of the Deploy Shop
    let distanceToDeployShop = Phaser.Math.Distance.Between(this.player.x, this.player.y, 1120, 390);  
    if (distanceToDeployShop < 50) {        
      this.DeployShopPrompt.setAlpha(1);         
      this.DeployShopPromptTextBox.setAlpha(1);
      let cameraX = camera.worldView.x;
      let cameraY = camera.worldView.y;
      this.DeployShopPromptTextBox.clear();  
      this.DeployShopPromptTextBox.fillStyle(0x000000, 0.5);  
      this.DeployShopPromptTextBox.fillRect(cameraX + 165, cameraY + 530, 465, 40); 
      this.DeployShopPrompt.setPosition(cameraX + 400, cameraY + 550); 
    } else {
      this.DeployShopPrompt.setAlpha(0);  
      this.DeployShopPromptTextBox.setAlpha(0);  
    }
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S), 500) && this.DeployShopPrompt.alpha > 0) {
      console.log("Key pressed for shop menu")
      this.showDeployShopMenu();
    }
    // Calculate player distance to the center of the FF Shop
    let distanceToFFShop = Phaser.Math.Distance.Between(this.player.x, this.player.y, 1120, 540);  
    if (distanceToFFShop < 50) {        
      this.FFShopPrompt.setAlpha(1);         
      this.FFShopPromptTextBox.setAlpha(1);
      let cameraX = camera.worldView.x;
      let cameraY = camera.worldView.y;
      this.FFShopPromptTextBox.clear();  
      this.FFShopPromptTextBox.fillStyle(0x000000, 0.5);  
      this.FFShopPromptTextBox.fillRect(cameraX + 160, cameraY + 530, 480, 40); 
      this.FFShopPrompt.setPosition(cameraX + 400, cameraY + 550); 
    } else {
      this.FFShopPrompt.setAlpha(0);  
      this.FFShopPromptTextBox.setAlpha(0);  
    }
    if (this.input.keyboard.checkDown(this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D), 500) && this.FFShopPrompt.alpha > 0) {
      console.log("Key pressed for shop menu")
      this.showFFShopMenu();
    }
    ////////////////////////
    // Check distance to Table 6 (rightmost table on the second row)
    let distanceToTable6 = Phaser.Math.Distance.Between(this.player.x, this.player.y, 850, 425);
    
    if (distanceToTable6 < 125) {              // Adjustable the distance threshold
      this.CustomerPrompt.setAlpha(1);         // Show the customer notification prompt text
      this.CustomerPromptTextBox.setAlpha(1);  // Show the transparent box behind the customer notification prompt text

      // Position the CustomerPromptTextBox and CustomerPrompt relative to the camera view
      let cameraX = camera.worldView.x;
      let cameraY = camera.worldView.y;

      // Clear previous drawing and draw with updated transparency
      this.CustomerPromptTextBox.clear();  // Clear previous rectangle
      this.CustomerPromptTextBox.fillStyle(0x000000, 0.5);  // Apply 50% transparency
      this.CustomerPromptTextBox.fillRect(cameraX + 225, cameraY + 530, 345, 40);  // Draw the box behind the text

      // Position CustomerPrompt text relative to the camera view
      this.CustomerPrompt.setPosition(cameraX + 400, cameraY + 550);  // Adjust for camera offset
    } else {
      this.CustomerPrompt.setAlpha(0);  // Hide the CustomerPrompt
      this.CustomerPromptTextBox.setAlpha(0);  // Hide the transparent box behind the text
    }

    // Check for spacebar press only when the CustomerPrompt is visible
    if (this.input.keyboard.checkDown(this.cursors.space, 500) && this.CustomerPrompt.alpha > 0) {
      console.log('Key pressed for customer menu');
      this.showCustomerMenu(); // Show the customer menu when space key is pressed and the customer notification prompt is visible
    }
  }
}

// Game Configuration
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: [MainMenu, GameScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

const game = new Phaser.Game(config);