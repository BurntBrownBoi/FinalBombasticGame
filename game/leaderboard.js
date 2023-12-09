class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: "LeaderboardScene" });
  }

  preload() {}

  create() {
    let graphics = this.add.graphics();
    graphics.fillStyle(0x000000, 0.8);
    graphics.fillRect(0, 0, this.cameras.main.width, this.cameras.main.height);

    this.add.text(100, 100, "Leaderboard", { fontSize: "32px", color: "#fff" });

    this.createCloseButton(500, 550, "Close", this.closeLeaderboard);

    this.fetchLeaderboardData();
  }

  fetchLeaderboardData() {
    fetch("http://localhost:8080/api/leaderboard")
      .then((response) => response.json())
      .then((data) => this.displayLeaderboard(data))
      .catch((error) =>
        console.error("Error fetching leaderboard data:", error)
      );
  }

  displayLeaderboard(data) {
    data.forEach((entry, index) => {
      this.add.text(100, 150 + index * 30, `${entry.alias}: ${entry.score}`, {
        fontSize: "24px",
        color: "#fff",
      });
    });
  }

  toggleVisibility(visible) {
    this.visible = visible;
  }

  createCloseButton(x, y, text, callback) {
    let button = this.add
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

  closeLeaderboard() {
    this.scene.stop();
    this.scene.resume("mainScene");
  }
}
