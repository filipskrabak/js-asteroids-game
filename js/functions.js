function areAsteroidCoordsValid(x, y, width, height) {
    if((x + width/2 > (ship.x - ship.img.width/2) && x - width/2 < (ship.x + ship.img.width / 2)) && 
    (y + height/2 > (ship.y - ship.img.height/2) && y - height/2 < (ship.y + ship.img.height / 2))) // zistime, ci kolidujeme s hracom
    {
        return false;
    }
    return true;
}

function generateAsteroids(count) {
    let asteroids = [];

    for(let i = 0; i < count; i++)
    {
        let minsize = 0.25;
        let maxsize = 0.30;
        let minspeed = 0.2 + game.level*0.3;
        let maxspeed = 0.5 + game.level*0.3;

        let x,y;

        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        }
        while(areAsteroidCoordsValid(x, y, 350, 350) != true)

        asteroids.push(new Asteroid(x, y, Math.random() * (maxspeed - minspeed) + minspeed, Math.random() * (maxsize - minsize) + minsize));
    }

    return asteroids;
}

function generateBackgroundStars(count) {
    let stars = [];

    for(let i = 0; i < count; i++)
        stars.push(new BackgroundEnvironment());

    return stars;
}

function getRandomPowerUp() {
    let powerups = [];

    powerups.push(new PowerUp("GODMODE", "godmode.png", 1.2, 10, function() { ship.solid = false; }, function() { ship.solid = true; } ));
    powerups.push(new PowerUp("PROJECTILE BOOST", "boost.png", 1.2, 15, function() { ship.fireRate = 125; }, function() { ship.fireRate = 250; } ));
    powerups.push(new PowerUp("FIRST AID", "aid.png", 1.2, 0, function() { game.health++; }));
    powerups.push(new PowerUp("DOUBLE SCORE", "doublescore.png", 1.2, 25, function() { game.killscore = 160; }, function() { game.killscore = 80; }));

    return powerups[Math.floor(Math.random() * powerups.length)];
}

function controller() {
    if(game.state == "game")
    {
        ship.movingForward = buttons["w"] || buttons["ArrowUp"];
        ship.rotateLeft = buttons["a"] || buttons["ArrowLeft"];
        ship.rotateRight = buttons["d"] || buttons["ArrowRight"];

        if(buttons[" "])
            ship.shoot();

        if(buttons["Escape"]) {
            game.pauseGame(gameScene);
        }
    }
    if(game.state == "introduction")
    {
        if(buttons["Enter"])
            game.mainMenu(gameScene);
    }
}

function clearView() {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.width, canvas.height);
}