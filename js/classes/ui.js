class GameText {
    constructor(x, y, text, fontsize, textcolor, baseline, align, fadeout) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.fontsize = fontsize;
        this.textcolor = textcolor;
        this.baseline = baseline;
        this.align = align;
        this.fadeout = fadeout;
        this.alpha = 1.0;

        if(this.fadeout == true) {
            let that = this;
            setTimeout(function() { gameScene.remove(that)}, 3000);
        }
    }

    update() {
        this.draw();
    }
    draw() {
        ctx.font = this.fontsize + "px Joystix";

        if(!this.fadeout)
            ctx.fillStyle = this.textcolor;
        else
        {
            ctx.fillStyle = "rgba(" + this.textcolor[0] + ", " + this.textcolor[1] + ", " + this.textcolor[2] + ", " + this.alpha + ")";

            if(this.alpha > 0.7)
                this.alpha *= 0.995;
            else if(this.alpha > 0)
                this.alpha *= 0.985;
        }

        ctx.textBaseline = this.baseline; 
        ctx.textAlign = this.align; 
        ctx.fillText(this.text, this.x, this.y);
    }

}

class Score extends GameText {
    constructor(x, y, text, fontsize, textcolor, baseline, align)
    {
        super(x, y, text, fontsize, textcolor, baseline, align);
    }

    update() {
        this.text = game.score;
        this.draw();
    }
}

class Health extends GameText {
    constructor(x, y, text, fontsize, textcolor, baseline, align)
    {
        super(x, y, text, fontsize, textcolor, baseline, align);
    }

    update() {
        this.text = "";
        for(let i = 0; i < game.health; i++){
            this.text += "♥";
        }
        this.draw();
    }
}


class Button {
    constructor(x, y, width, height, text, fontsize, action) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.text = text;
        this.fontsize = fontsize;
        this.action = action;

        this.fillcolor = "white";
        this.textcolor = "black";

    }

    hover() {
        this.fillcolor = "black";
        this.textcolor = "white";
    }

    unhover() {
        this.fillcolor = "white";
        this.textcolor = "black";
    }

    update() {
        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        ctx.fillStyle = this.fillcolor;
        ctx.fill();
        ctx.font = this.fontsize + "px Joystix";
        ctx.fillStyle = this.textcolor;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center"; 
        ctx.fillText(this.text, this.x, this.y);
    }

}

class ImgButton extends GameObject {
    constructor(x, y, imgname, state, scale, action) {
        super();
        this.x = x;
        this.y = y;
        this.action = action;
        this.width = 0;
        this.height = 0;

        this.onimg = new Image();
        this.onimg.src = imgname + "on.png";

        this.onimg.onload = () => {
            this.onimg.width *= scale;
            this.onimg.height *= scale;

            this.width = this.onimg.width;
            this.height = this.onimg.height;

            this.onimg.ready = true;
        }

        this.offimg = new Image();
        this.offimg.src = imgname + "off.png";

        this.offimg.onload = () => {
            this.offimg.width *= scale;
            this.offimg.height *= scale;
            this.offimg.ready = true;
        }

        if(state === true)
            this.img = this.onimg;
        else
            this.img = this.offimg;
    }

    changeState() {
        if(this.img == this.onimg)
            this.img = this.offimg;
        else
            this.img = this.onimg;
    }

    toggleMusic() {
        game.toggleMusic();
        this.changeState();
    }

    toggleSound() {
        game.toggleSound();
        this.changeState();
    }

    update() {
        this.draw();
    }

}

class GameEnvironment extends GameObject {
    constructor(x, y, imgname, scale) {
        super();
        this.x = x;
        this.y = y;

        this.img = new Image();
        this.img.src = imgname;

        this.img.onload = () => {
            this.img.width *= scale;
            this.img.height *= scale;
            this.img.ready = true;
        }
    }
    update() {
        this.draw()
    }
}

class BackgroundEnvironment extends GameEnvironment {
    constructor() {
        super();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2.0;
        this.velX = Math.random() * 0.1;
    }
    update() {
        this.x += this.velX;

        if(this.x > canvas.width)
            this.x = 0;

        this.draw();
    }
    draw() {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Scoreboard {
    constructor() {
        let table = document.createElement("table");
        table.setAttribute("id", "table");
        document.body.appendChild(table);
      
        let trth = document.createElement("tr");
        trth.setAttribute("id", "trth");
        document.getElementById("table").appendChild(trth);
      
        let nick = document.createElement("th");
        let nicktext = document.createTextNode("Nickname");
        nick.appendChild(nicktext);
        document.getElementById("trth").appendChild(nick);

        let score = document.createElement("th");
        let scoretext = document.createTextNode("Score");
        score.appendChild(scoretext);
        document.getElementById("trth").appendChild(score);

        this.drawTable();
    }

    drawTable() {
        for(let i = 0; i < localStorage.length; i++)
            this.createTableElement(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
    }

    createTableElement(nickname, score) {
        let th = document.createElement("tr");
        document.getElementById("table").appendChild(th);

        let newline = document.createElement("td");
        let nametext = document.createTextNode(nickname);
        newline.appendChild(nametext);
        th.appendChild(newline);

        newline = document.createElement("td");
        nametext = document.createTextNode(score);
        newline.appendChild(nametext);
        th.appendChild(newline);
    }

    update() {
        // void
    }
}

class NickNameField {
    constructor() {
        this.input = document.createElement("input");
        this.input.setAttribute("id", "input");
        this.input.setAttribute('type', 'text');
        this.input.setAttribute('placeholder', 'Nickname');
        document.body.appendChild(this.input);
    }
    update() {
        // void
    }
}
