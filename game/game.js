class mainScene {
  preload() {
    this.load.image("player", "Assets/player.png");
    this.load.image("alien", "Assets/alien.png");
    this.load.image("bullet", "Assets/bullet.png");
  }

  create() {
    let style = { font: "20px Arial", fill: "#fff" };

    this.alien = this.physics.add.sprite(300, 300, "alien");
    this.alien.setCollideWorldBounds(true);
    this.alien.setBounce(1);
    this.alien.setVelocity(100, 100);
    this.alienSpeed = 100;
    this.nextAlienMove = 0;
    this.player = this.physics.add.sprite(100, 100, "player");

    this.createButton(50, 550, "Leaderboard", this.showLeaderboard);

    this.score = 0;
    this.scoreText = this.add.text(20, 20, "score: " + this.score, style);

    this.arrow = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group();
  }

  update() {
    if (this.physics.overlap(this.player, this.alien)) {
      //insert death method
    }

    // Use WASD for movement
    if (
      this.input.keyboard.addKey("D").isDown &&
      this.player.x < 800 - this.player.width / 2
    ) {
      this.player.x += 3;
    } else if (
      this.input.keyboard.addKey("A").isDown &&
      this.player.x > this.player.width / 2
    ) {
      this.player.x -= 3;
    }

    if (
      this.input.keyboard.addKey("S").isDown &&
      this.player.y < 600 - this.player.height / 2
    ) {
      this.player.y += 3;
    } else if (
      this.input.keyboard.addKey("W").isDown &&
      this.player.y > this.player.height / 2
    ) {
      this.player.y -= 3;
    }

    this.shoot();
    this.moveAlien();
    this.physics.overlap(this.bullets, this.alien, this.hitAlien, null, this);
  }

  shoot() {
    if (this.input.activePointer.isDown) {
      // Check if the cooldown has passed
      if (!this.lastShotTime || this.time.now - this.lastShotTime > 1000) {
        let bullet = this.physics.add.sprite(
          this.player.x,
          this.player.y,
          "bullet"
        );
        this.bullets.add(bullet);

        this.physics.moveTo(bullet, this.input.x, this.input.y, 300);

        // Set boundaries for bullets
        bullet.setCollideWorldBounds(true);

        // Optionally, set the bullet to be destroyed automatically when it leaves the world bounds
        bullet.body.onWorldBounds = true;
        bullet.body.world.on("worldbounds", (body) => {
          if (body.gameObject === bullet) {
            bullet.destroy();
          }
        });

        // Destroy the bullet after 5 seconds if not already destroyed
        this.time.delayedCall(
          5000,
          () => {
            if (bullet && bullet.active) {
              bullet.destroy();
            }
          },
          [],
          this
        );

        // Set the last shot time
        this.lastShotTime = this.time.now;

        // Add a delay for the cooldown (1 second)
        this.time.delayedCall(1000, () => {}, [], this);
      }
    }
  }

  hitAlien(bullet, alien) {
    bullet.destroy();
    alien.destroy();

    this.alien.x = Phaser.Math.Between(100, 600);
    this.alien.y = Phaser.Math.Between(100, 300);

    this.score += 10;

    this.scoreText.setText("score: " + this.score);

    this.tweens.add({
      targets: this.player,
      duration: 200,
      scaleX: 1.2,
      scaleY: 1.2,
      yoyo: true,
    });

    this.alien = this.physics.add.sprite(300, 300, "alien");
    this.alien.setCollideWorldBounds(true);
    this.alien.setBounce(1);
    this.alien.setVelocity(100, 100);
    this.alienSpeed = 100;
    this.nextAlienMove = 0;
  }

  moveAlien(time) {
    if (time > this.nextAlienMove) {
      this.alien.setVelocity(
        Phaser.Math.Between(-this.alienSpeed, this.alienSpeed),
        Phaser.Math.Between(-this.alienSpeed, this.alienSpeed)
      );

      this.nextAlienMove = time + 2000;
    }
  }

  endGame() {
    this.scene.start("LeaderboardScene");
  }

  showLeaderboard() {
    // Switch to the leaderboard scene
    this.scene.launch("LeaderboardScene");
  }

  resumeGame() {
    // Resume the game from the leaderboard
    this.scene.stop("LeaderboardScene");
    this.scene.resume();
  }

  createButton(x, y, text, callback) {
    const button = this.add
      .text(x, y, text, {
        fontSize: "20px",
        padding: { x: 10, y: 5 },
        backgroundColor: "#000000",
        color: "#ffffff",
      })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => callback.call(this));

    return button;
  }
}

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "#3498db",
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  scene: [mainScene, LeaderboardScene],
});
