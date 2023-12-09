class mainScene {
    preload() {
        this.load.image("player", "Assets/player.png");
        this.load.image("alien", "Assets/alien.png");
        this.load.image("bullet", "Assets/bullet.png");
    }
  
    create() {
        this.player = this.physics.add.sprite(100, 100, "player");
        this.alien = this.physics.add.sprite(300, 300, "alien");
  
        this.score = 0;
  
        let style = { font: '20px Arial', fill: '#fff' };
  
        this.scoreText = this.add.text(20, 20, 'score: ' + this.score, style);
  
        this.arrow = this.input.keyboard.createCursorKeys();
        
        
        this.bullets = this.physics.add.group({
          defaultKey: 'bullet',
          maxSize: 10,
          setXY: { x: -100, y: -100, stepX: 0 }
        });
    }
  
    update() {
        if (this.physics.overlap(this.player, this.alien)) {
            this.hit();
        }
  
        // Use WASD for movement
        if (this.input.keyboard.addKey('D').isDown && this.player.x < 800 - this.player.width / 2) {
            this.player.x += 3;
        } else if (this.input.keyboard.addKey('A').isDown && this.player.x > this.player.width / 2) {
            this.player.x -= 3;
        }
  
        if (this.input.keyboard.addKey('S').isDown && this.player.y < 600 - this.player.height / 2) {
            this.player.y += 3;
        } else if (this.input.keyboard.addKey('W').isDown && this.player.y > this.player.height / 2) {
            this.player.y -= 3;
        }
  
        this.shoot();
    }
  
    shoot() {
      if (this.input.activePointer.isDown) {
          if (!this.lastShotTime || this.time.now - this.lastShotTime > 1000) {
              let bullet = this.bullets.get(this.player.x, this.player.y);
  
              if (bullet) {
                  this.physics.add.existing(bullet); // Enable physics for the bullet
                  this.physics.moveTo(bullet, this.input.x, this.input.y, 300);
  
                  bullet.setCollideWorldBounds(true);
  
                  // Set boundaries for bullets
                  this.physics.world.setBounds(0, 0, 800, 600);
  
                  this.physics.add.overlap(bullet, this.enemies, this.hitEnemy, null, this);
  
                  // Destroy the bullet after 5 seconds
                  setTimeout(() => {
                      bullet.destroy();
                  }, 5000);
  
                  this.lastShotTime = this.time.now;
              }
  
              this.time.delayedCall(1000, () => {}, [], this);
          }
      }
  }
  
    hit() {
        this.alien.x = Phaser.Math.Between(100, 600);
        this.alien.y = Phaser.Math.Between(100, 300);
  
        this.score += 10;
  
        this.scoreText.setText('score: ' + this.score);
  
        this.tweens.add({
            targets: this.player,
            duration: 200,
            scaleX: 1.2,
            scaleY: 1.2,
            yoyo: true,
        });
    }

    
  
  }
  
  new Phaser.Game({
    width: 800,
    height: 600,
    backgroundColor: '#3498db',
    scene: mainScene,
    physics: { default: 'arcade' },
    parent: 'game',
  });
  