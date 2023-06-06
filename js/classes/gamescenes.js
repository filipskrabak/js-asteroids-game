// GUI Scenes
Game.prototype.introductionScene = function(sceneObj) {
    return [
        ...generateBackgroundStars(30),
        new GameEnvironment(Math.floor(canvas.width * 0.80), Math.floor(canvas.height * 0.25), "assets/img/background/" + (Math.floor(Math.random() * 3) + 1) + ".png", 3),
        new GameText(centerX, 100, "ASTEROIDS", 100, "white", "middle", "center"),
        new NickNameField(),
        new Button(centerX, centerY+100, 500, 100, "ENTER", 65, this.mainMenu.bind(this, sceneObj)),
        new ImgButton(30, 30, "assets/img/buttons/speaker/", game.sound, 0.05, function() {this.toggleSound()}),
        new ImgButton(28, 70, "assets/img/buttons/music/", game.music, 0.05, function() {this.toggleMusic()})
    ];
}
Game.prototype.mainMenuScene = function(sceneObj) {
    return [
        ...generateBackgroundStars(30),
        new GameEnvironment(Math.floor(canvas.width * 0.80), Math.floor(canvas.height * 0.25), "assets/img/background/" + (Math.floor(Math.random() * 3) + 1) + ".png", 3),
        new GameText(centerX, 100, "ASTEROIDS", 100, "white", "middle", "center"),
        new Button(centerX, centerY-100, 500, 100, "PLAY", 70, this.startGame.bind(this, sceneObj)),
        new Button(centerX, centerY+ 50, 500, 100, "HOW TO PLAY", 50, this.showInstructions.bind(this, sceneObj)),
        new Button(centerX, centerY+200, 500, 100, "SCOREBOARD", 50, this.showScoreboard.bind(this, sceneObj)),
        new ImgButton(30, 30, "assets/img/buttons/speaker/", game.sound, 0.05, function() {this.toggleSound()}),
        new ImgButton(28, 70, "assets/img/buttons/music/", game.music, 0.05, function() {this.toggleMusic()})
    ];
}
Game.prototype.instructionsScene = function(sceneObj) {
    return [
        ...generateBackgroundStars(30),
        new GameText(centerX, 100, "ASTEROIDS", 100, "white", "middle", "center"),
        new GameEnvironment(centerX, centerY-200, "assets/img/ui/howto-controls.png", 0.5),
        new GameEnvironment(centerX, centerY+50, "assets/img/ui/howto-game.png", 0.5),
        new Button(centerX, centerY+250, 500, 100, "BACK", 70, this.mainMenu.bind(this, sceneObj))
    ];
}
Game.prototype.scoreboardScene = function(sceneObj) {
    return [
        ...generateBackgroundStars(30),
        new GameText(centerX, 100, "ASTEROIDS", 100, "white", "middle", "center"),
        new Scoreboard(),
        new Button(centerX, centerY+100, 500, 100, "BACK", 70, this.mainMenu.bind(this, sceneObj))
    ];
}
Game.prototype.pauseScene = function(sceneObj) {
    return [
        new GameText(centerX, 100, "GAME PAUSED", 100, "white", "middle", "center"),
        new GameText(centerX, centerY-100, "SCORE: " + this.score, 50, "white", "middle", "center"),
        new Button(centerX, centerY+100, 700, 100, "CONTINUE", 70, this.startGame.bind(this, sceneObj)),
        new Button(centerX, centerY+250, 700, 100, "MAIN MENU", 70, this.mainMenu.bind(this, sceneObj)),
        new ImgButton(30, 30, "assets/img/buttons/speaker/", game.sound, 0.05, function() {this.toggleSound()}),
        new ImgButton(28, 70, "assets/img/buttons/music/", game.music, 0.05, function() {this.toggleMusic()})
    ];
}
Game.prototype.gameOverScene = function(sceneObj) {
    return [
        new GameText(centerX, 100, "GAME OVER", 100, "red", "middle", "center"),
        new GameText(centerX, centerY-150, "SCORE: " + this.score, 50, "white", "middle", "center"),
        new GameText(centerX, centerY-50, "HIGH SCORE: " + this.highscore, 50, "white", "middle", "center"),
        new Button(centerX, centerY+100, 700, 100, "TRY AGAIN", 70, this.startGame.bind(this, sceneObj)),
        new Button(centerX, centerY+250, 700, 100, "MAIN MENU", 70, this.mainMenu.bind(this, sceneObj))
    ];
}
// In-Game Scenes
Game.prototype.gameScene = function() {
    let arr = [];
    arr.push(...generateBackgroundStars(30));
    arr.push(new GameEnvironment(Math.floor(canvas.width * 0.75), Math.floor(canvas.height * 0.25), "assets/img/background/" + (Math.floor(Math.random() * 3) + 1) + ".png", 4))
    arr.push(ship = new Ship());
    arr.push(...generateAsteroids(8));
    arr.push(new Score(30, 50, "", 50, "white", "middle", "left"));
    arr.push(new Health(canvas.width - 30, 50, "", 50, "red", "middle", "right"));
    return arr;
}
Game.prototype.nextLevelScene = function() {
    let arr = [];
    arr.push(...generateAsteroids(8));
    arr.push(new GameText(centerX, centerY + 200, "LEVEL " + this.level, 60, [255, 255, 255], "middle", "center", true));
    return arr;
}