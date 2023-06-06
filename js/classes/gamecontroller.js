class Game {
    constructor() {
        this.state = "menu";
        this.sound = true;
        this.music = true;
        this.score = 0;
        this.highscore = 0;
        this.health = 3;
        this.level = 1;
        this.levelenemyships = 0;
        this.killscore = 80;
        this.nickname = "Player";
        this.savedNodes = [];

        // Controller

        document.body.addEventListener("keydown", event => {
            buttons[event.key] = true;
        });
        
        document.body.addEventListener("keyup", event => {
            //console.log(event.key);
            buttons[event.key] = false;
        });
    
        
        canvas.addEventListener('click', function(event) {
    
            gameScene.nodes.forEach(function(elem) {
                let mx = event.pageX;
                let my = event.pageY;
    
                //console.log("x: " + mx + " y: " + my);
            
                if((mx > (elem.x - elem.width/2) && mx < (elem.x + elem.width / 2)) && (my > (elem.y - elem.height/2) && my < (elem.y + elem.height / 2)))
                {
                    //console.log("Click");
                    //console.log(elem);
    
                    if(typeof (elem.action) == "function")
                    {
                        let sound = new GameSound("assets/sound/ui/buttonclick.wav", "sound", 0.2);
                        sound.play();
                        elem.action();
                    }
                }
            });
        }, false);
    
        canvas.addEventListener('mousemove', function(event) {
            if(game.state == "game")
                return;
    
            gameScene.nodes.forEach(function(elem) {
                let mx = event.pageX;
                let my = event.pageY;
    
                if(typeof (elem.unhover) == "function")
                    elem.unhover();
    
                if((mx > (elem.x - elem.width/2) && mx < (elem.x + elem.width / 2)) && (my > (elem.y - elem.height/2) && my < (elem.y + elem.height / 2)))
                {
                    if(typeof (elem.hover) == "function")
                        elem.hover();
                }
            });
        }, false);
    }
    
    /* Menu Logic */
    startGame(sceneObj) {
        if(this.state == "menu" || this.state == "gameover")
        {
            this.stopAllMusic();
            this.state = "game";
            this.score = 0;
            this.health = 3;
            this.level = 1;
            sceneObj.nodes = this.gameScene();
        } else if(this.state == "pause")
        {
            this.state = "game";
            sceneObj.nodes = this.savedNodes;
        }
    }
    introductionMenu(sceneObj) {
        this.state = "introduction";
        sceneObj.nodes = this.introductionScene(sceneObj);
    }
    mainMenu(sceneObj) {
        if(this.state == "scoreboard")
        {
            let removeTab = document.getElementById('table');
            let parentEl = removeTab.parentElement;

            parentEl.removeChild(removeTab);
        }
        if(this.state == "introduction")
        {
            let inputfield = document.getElementById("input");
            if(inputfield.value.length != 0)
                this.nickname = inputfield.value;
            inputfield.remove();
        }

        // Music
        if(this.state == "gameover" || this.state == "menu" || this.state == "introduction")
        {
            let mainMenuMusic = new GameSound("assets/sound/music/mainmenu.ogg", "music", 0.05, true);
            music.push(mainMenuMusic);
            mainMenuMusic.play();
        }

        this.state = "menu";
        sceneObj.nodes = this.mainMenuScene(sceneObj);
    }
    showInstructions(sceneObj) {
        if(this.state == "menu")
        {
            this.state = "instructions";
            sceneObj.nodes = this.instructionsScene(sceneObj);
        }
    }
    showScoreboard(sceneObj) {
        if(this.state == "menu")
        {
            this.state = "scoreboard";
            sceneObj.nodes = this.scoreboardScene(sceneObj);
        }
    }
    pauseGame(sceneObj) {
        if(this.state == "game")
        {
            this.state = "pause";
            this.savedNodes = sceneObj.nodes;
            sceneObj.nodes = this.pauseScene(sceneObj);
        }
    }
    gameOver(sceneObj) {
        if(this.state == "game")
        {
            this.state = "gameover";
            this.updateScore();

            sceneObj.nodes = this.gameOverScene(sceneObj);

            let sound = new GameSound("assets/sound/music/gameover.wav", "music", 0.3);
            sound.play();
        }
    }
    // Next Level handler
    nextLevel() {
        this.level++;
        this.levelenemyships = 0;

        gameScene.nodes.push(...this.nextLevelScene());
    }

    /* Sound Logic */
    toggleSound() {
        this.sound = !this.sound;
    }

    toggleMusic() {
        this.music = !this.music;

        for(let i in music) {
            if(this.music === true)
                music[i].play();
            else
                music[i].stop();
        }
    }

    stopAllMusic() {
        for(let i = 0; i < music.length; i++) {
            music[i].stop();
            music.splice(i, 1);
            i--;
        }
    }

    // Aktualizácia skóre po skončení hry
    updateScore() {
        for(let i = 0; i < localStorage.length; i++)
        {
            if(localStorage.key(i) == this.nickname)
            {
                if(this.score > localStorage.getItem(localStorage.key(i)))
                    localStorage.setItem(this.nickname, game.score);

                this.highscore = localStorage.getItem(localStorage.key(i));
                return;
            }
        }
        // Hrac nebol najdeny v zozname
        localStorage.setItem(this.nickname, game.score);
        this.highscore = game.score;
    }

    // Navráti počet nepriateľov v hre (asteroids + enemies)
    getEnemiesLeft() {
        let count = 0;
        for(let i in gameScene.nodes) {
            if(gameScene.nodes[i] instanceof Asteroid || gameScene.nodes[i] instanceof EnemyShip)
                count++;
        }
        return count;
    }
}