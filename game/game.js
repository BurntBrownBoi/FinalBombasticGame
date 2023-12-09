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

      this.createEnemies();
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
          // Check if the cooldown has passed
          if (!this.lastShotTime || this.time.now - this.lastShotTime > 1000) {
              let bullet = this.physics.add.sprite(this.player.x, this.player.y, 'bullet');
              this.physics.add.existing(bullet); // Enable physics for the bullet

              this.physics.moveTo(bullet, this.input.x, this.input.y, 300);

              // Set boundaries for bullets
              this.physics.world.setBounds(0, 0, 800, 600);

              bullet.setCollideWorldBounds(true);

              this.physics.add.overlap(bullet, this.enemies, this.hitEnemy, null, this);

              // Destroy the bullet after 5 seconds
              setTimeout(() => {
                  bullet.destroy();
              }, 5000);

              // Set the last shot time
              this.lastShotTime = this.time.now;

              // Add a delay for the cooldown (1 second)
              this.time.delayedCall(1000, () => {
                  // Empty callback, can be used for any additional cooldown logic
              }, [], this);
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

  createEnemies() {
      this.enemies = this.physics.add.group({
          key: 'alien',
          repeat: 5,  // Adjust as needed
          setXY: { stepX: 100 }
      });

      this.enemies.children.iterate(enemy => {
          enemy.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
          enemy.setCollideWorldBounds(true);
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
