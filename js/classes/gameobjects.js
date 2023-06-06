class Ship extends GameObject {
    constructor() {
        super();
        this.x = centerX;
        this.y = centerY;
        this.movingForward = false;
        this.velX = 0;
        this.velY = 0;
        this.rotateLeft = false;
        this.rotateRight = false;
        this.degrees = 0;
        this.boostSpeed = 0.05;
        this.scale = 0.27;
        this.turnSpeed = 2;
        this.fireRate = 250; // ms
        this.lastShot = Date.now();
        this.solid = true;
        this.boostSound = new GameSound("assets/sound/player/thrusterFire01.ogg", "sound", 0.5, true);
        this.boostSound.playing = false;

        // Inicializacia obrazkov
        this.img = new Image();
        this.img.src = 'assets/img/player/Spaceship.png';
        this.img.onload = () => {
            this.img.width *= this.scale;
            this.img.height *= this.scale;
            this.img.ready = true;
        }

        this.flameImg = new Image();
        this.flameImg.src = 'assets/img/player/Flame.png';
        this.flameImg.width = 135;
        this.flameImg.height = 135;
    }
    update() {
        if(this.visible != true)
            return;

        if(this.movingForward)
        {
                let rad = (this.degrees+90)*Math.PI/180; // Uhol v radianoch posunuty o 90°
                this.velX += Math.cos(rad) * this.boostSpeed;
                this.velY += Math.sin(rad) * this.boostSpeed;

                if(!this.boostSound.playing)
                {
                    this.boostSound.playing = true;
                    this.boostSound.play();
                }
        }
        else {
            if(this.boostSound.playing)
            {
                this.boostSound.stop();
                this.boostSound.playing = false;
            }
        }

        if(this.y + this.img.height/4 < 0) {
            this.y = canvas.height + this.img.height/4;
        }
        if(this.y - this.img.height/4 > canvas.height) {
            this.y = 0 - this.img.height/4;
        }
        if(this.x - this.img.width/4 > canvas.width) {
            this.x = 0 - this.img.width/4;
        }
        if(this.x + this.img.width/4 < 0) {
            this.x = canvas.width + this.img.width/4;
        }

        this.x -= this.velX;
        this.y -= this.velY;

        this.velX *= 0.99;
        this.velY *= 0.99;

        if(this.rotateLeft)
            this.degrees -= this.turnSpeed;
        if(this.rotateRight)
            this.degrees += this.turnSpeed; 

        this.draw();

        /*ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.stroke();*/
    }
    shoot() {
        if(this.lastShot + this.fireRate > Date.now() || !this.visible)
            return;

        this.lastShot = Date.now();

        let rad = (this.degrees+90)*Math.PI/180;
        let projectilex = this.x - this.img.width/3 * Math.cos(rad);
        let projectiley = this.y - this.img.width/3 * Math.sin(rad);
        let projectilespeed = Math.sqrt((this.velX ** 2)+(this.velY ** 2)) + 3.5; // vypocet dlzky vektora a pripocitanie rychlosti

        gameScene.add(new FriendlyProjectile(projectilex, projectiley, projectilespeed, this.degrees, 0.5))

        let shootSound = new GameSound("assets/sound/player/shoot01.ogg", "sound", 1.0);
        shootSound.play();
    }
    collided() {
        game.health--;
        this.explode();

        if(game.health == 0)
        {
            setTimeout(function() { game.gameOver(gameScene); }, 2000);
            return;
        }

        setTimeout(function() { ship.respawn(); }, 2000);
    }
    explode() {
        this.visible = false;
        this.boostSound.stop();
        this.boostSound.playing = false;

        gameScene.add(new Explosion(this.x, this.y, 0.5));

        let sound = new GameSound("assets/sound/player/explosion0" + (Math.floor(Math.random() * 2) + 1) + ".wav", "sound", 0.7);
        sound.play();

        this.x = centerX;
        this.y = centerY;
    }
    respawn() {
        if(this.visible == true)
            return;

        // Ak sa na spawn pozicii nachadza nepriatel, pockajme (bugfix)
        for(let i in gameScene.nodes) { 
            if(gameScene.nodes[i] instanceof Asteroid || gameScene.nodes[i] instanceof EnemyShip) {
                if(!areAsteroidCoordsValid(gameScene.nodes[i].x, gameScene.nodes[i].y, this.img.width + 50, this.img.height + 50))
                {
                    setTimeout(function() { ship.respawn(); }, 500);
                    return;
                }
            }
        }

        this.visible = true;

        this.x = centerX;
        this.y = centerY;
        this.degrees = 0;
        this.velX = 0;
        this.velY = 0;
    }

}

class Enemy extends GameObject {
    constructor(x, y, speed, scale) {
        super();
        this.x = x;
        this.y = y;
        this.movingForward = true;
        this.velX = 0;
        this.velY = 0;
        this.degrees = Math.random() * 360;
        this.speed = speed;
        this.solid = true;
        this.scale = scale;
    }
    update() {
        this.handleCollisions();

        if(this.movingForward)
        {
                let rad = (this.degrees+90)*Math.PI/180; // Uhol v radianoch posunuty o 90°
                this.velX = Math.cos(rad) * this.speed;
                this.velY = Math.sin(rad) * this.speed;
        }

        if(this.y + this.img.height/2 < 0) {
            this.y = canvas.height + this.img.height/2;
        }
        if(this.y - this.img.height/2 > canvas.height) {
            this.y = 0 - this.img.height/2;
        }
        if(this.x - this.img.width/2 > canvas.width) {
            this.x = 0 - this.img.width/2;
        }
        if(this.x + this.img.width/2 < 0) {
            this.x = canvas.width + this.img.width/2;
        }

        this.x -= this.velX;
        this.y -= this.velY;

        this.draw();
    }
    handleCollisions() {
        let collided = this.checkCollision()

        if(collided instanceof Ship) {
            ship.collided();
        }

        if(collided instanceof FriendlyProjectile) {
            game.score += game.killscore;
            gameScene.remove(this);
            gameScene.remove(collided);

            let sound = new GameSound("assets/sound/player/explosion_asteroid.flac", "sound", 0.7);
            sound.play();

            gameScene.add(new Explosion(this.x, this.y, this.img.width*0.008));

            if(this instanceof Asteroid && this.scale >= 0.20) {
                let minsize = 0.07;
                let maxsize = 0.12;

                gameScene.add(new Asteroid(this.x + 5, this.y + 5, Math.random()*2.0, Math.random() * (maxsize - minsize) + minsize));
                gameScene.add(new Asteroid(this.x - 5, this.y - 5, Math.random()*1.2, Math.random() * (maxsize - minsize) + minsize));
                gameScene.add(new Asteroid(this.x - 5, this.y + 5, Math.random()*2.0, Math.random() * (maxsize - minsize) + minsize));
            }

            let enemiesLeft = game.getEnemiesLeft();

            if(enemiesLeft == 0)
            {
                //if(Math.random() < 0.5) 
                gameScene.add(getRandomPowerUp());

                setTimeout(function() { game.nextLevel(); }, 3000);
            }

            let maxenemyships = game.level / 5 + 1;
            if(enemiesLeft == 3 && game.level > 1 && game.levelenemyships < maxenemyships) 
            {
                let minspeed = 1.5;
                let maxspeed = 3.5;
                gameScene.add(new EnemyShip(Math.random() > 0.5 ? canvas.width : 0, Math.random() * canvas.height, Math.random() * (maxspeed - minspeed) + minspeed, 0.7));
                game.levelenemyships++;
            }
        }
    }
}

class Asteroid extends Enemy {
    constructor(x, y, speed, scale) {
        super(x, y, speed, scale);

        this.img = new Image();
        this.img.src = "assets/img/asteroids/" + (Math.floor(Math.random() * 4) + 1) + ".png";

        this.img.onload = () => {
            this.img.width *= scale;
            this.img.height *= scale;
            this.img.ready = true;
        }
    }
}

class EnemyShip extends Enemy {
    constructor(x, y, speed, scale) {
        super(x, y, speed, scale);
        this.visible = true;

        this.img = new Image();
        this.img.src = "assets/img/enemy/" + (Math.floor(Math.random() * 3) + 1) + ".png";

        let that = this;
        setTimeout(function() { that.think(); }, 5000);
        setTimeout(function() { that.shoot(); }, 1000);

        this.img.onload = () => {
            this.img.width *= scale;
            this.img.height *= scale;
            this.img.ready = true;
        }
    }
    shoot() {
        if(this.isAlive() != true)
            return;

        gameScene.add(new HostileProjectile(this.x, this.y, this.speed + 2.5, this.degrees, 0.5));
        let that = this;

        let shootSound = new GameSound("assets/sound/enemy/shoot" + (Math.floor(Math.random() * 2) + 1) + ".ogg", "sound", 0.5);
        shootSound.play();

        setTimeout(function() { that.shoot(); }, 1000);
    }
    think() {
        if(this.isAlive() != true)
            return;

        this.degrees = Math.random() * 360;
        let that = this;
        setTimeout(function() { that.think(); }, 5000);
    }
    isAlive() {
        for(let i in gameScene.nodes) {
            if(gameScene.nodes[i] == this)
                return true;
        }
        return false;
    }
}

class Projectile extends GameObject {
    constructor(x, y, speed, degrees, scale) {
        super();
        this.x = x;
        this.y = y;
        this.velX = 0;
        this.velY = 0;
        this.degrees = degrees;
        this.speed = speed;
        this.life = 1100 // ms
        this.solid = true;

        let bullet = this;
        setTimeout(function(){ gameScene.remove(bullet) }, this.life);
    }
    update() {
        this.handleCollisions();

        let rad = (this.degrees+90)*Math.PI/180; // Uhol v radianoch posunuty o 90°
        this.velX = Math.cos(rad) * this.speed;
        this.velY = Math.sin(rad) * this.speed;

        if(this.y + this.img.height/2 < 0) {
            this.y = canvas.height + this.img.height/2;
        }
        if(this.y - this.img.height/2 > canvas.height) {
            this.y = 0 - this.img.height/2;
        }
        if(this.x - this.img.width/2 > canvas.width) {
            this.x = 0 - this.img.width/2;
        }
        if(this.x + this.img.width/2 < 0) {
            this.x = canvas.width + this.img.width/2;
        }

        this.x -= this.velX;
        this.y -= this.velY;

        this.draw();
    }
    handleCollisions() {
    }
}

class FriendlyProjectile extends Projectile {
    constructor(x, y, speed, degrees, scale) {
        super(x, y, speed, degrees, scale);

        this.img = new Image();
        this.img.src = "assets/img/player/projectile.png";

        this.img.onload = () => {
            this.img.width *= scale;
            this.img.height *= scale;
            this.img.ready = true;
        }
    }
}

class HostileProjectile extends Projectile {
    constructor(x, y, speed, degrees, scale) {
        super(x, y, speed, degrees, scale);

        this.img = new Image();
        this.img.src = "assets/img/enemy/projectile.png";

        this.img.onload = () => {
            this.img.width *= scale;
            this.img.height *= scale;
            this.img.ready = true;
        }
    }
    handleCollisions() {
        let collided = this.checkCollision();

        if(collided instanceof Ship) {
            ship.collided();
        }
    }
}

class PowerUp extends GameObject {
    constructor(name, imgname, scale, duration, onpickup, onend) {
        super();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;

        this.name = name;
        this.img = new Image();
        this.img.src = "assets/img/powerups/" + imgname;
        this.duration = duration;
        this.onpickup = onpickup;
        this.onend = onend;

        this.img.onload = () => {
            this.img.width *= scale;
            this.img.height *= scale;
            this.img.ready = true;
        }
    }
    update() {
        this.handleCollisions();
        this.draw()
    }
    handleCollisions() {
        let collided = this.checkCollision();

        if(collided instanceof Ship) {
            gameScene.remove(this);
            this.pickup();
        }
    }
    pickup() {
        this.onpickup();

        let that = this;
        setTimeout(function(){ that.end() }, this.duration*1000);

        let text;

        if(this.duration == 0)
            text = "YOU PICKED UP " + this.name;
        else
            text = this.name + " " + this.duration + " SECONDS";

        let sound = new GameSound("assets/sound/powerups/pickup.ogg", "sound", 0.3);
        sound.play();

        gameScene.add(new GameText(centerX, 100, text, 40, [255, 255, 255], "middle", "center", true));
    }
    end() {
        if (typeof (this.onend) != "function")
            return;

        this.onend();

        if(game.state == "game")
            gameScene.add(new GameText(centerX, 100, this.name + " ENDED", 40, [255, 255, 255], "middle", "center", true));
    }
}

class Explosion {
    constructor(x, y, scale) {
        this.x = x;
        this.y = y;
        this.solid = false;

        this.currentFrame = 0;

        this.numColumns = 8;
        this.numRows = 6;

        this.img = new Image();
        this.img.src = "assets/img/sprites/exp1.png";

        this.scale = scale;

        this.img.onload = () => {
            this.frameWidth = this.img.width / this.numColumns;
            this.frameHeight = this.img.height / this.numRows;

            this.img.ready = true;
        }
    }
    update() {
        this.draw();
    }
    draw() {
        if(this.img.ready != true)
            return;

        this.currentFrame++;

        let maxFrame = this.numColumns * this.numRows - 1;
        if (this.currentFrame > maxFrame){
            gameScene.remove(this);
        }

        let column = this.currentFrame % this.numColumns;
        let row = Math.floor(this.currentFrame / this.numColumns);

        ctx.drawImage(this.img, column * this.frameWidth, row * this.frameHeight, this.frameWidth, this.frameHeight, this.x - this.frameWidth*this.scale / 2, this.y - this.frameHeight*this.scale / 2, this.frameWidth * this.scale, this.frameHeight * this.scale);
    }
}