// Observer Pattern
class Node {
    constructor() {
        this.nodes = [];
    }

    add(node) {
        this.nodes.push(node);
    }

    remove(node) {
        var index = this.nodes.indexOf(node);
        delete this.nodes[index];
    }

    notify(event, argument) {
        for (var index in this.nodes) {
            var node = this.nodes[index];

            if (node == null)
                break;

            if (typeof (node[event]) == "function")
                node[event](argument);
        }
    }
}

class GameObject extends Node {
    constructor() {
        super();
        this.visible = true;
    }

    update() {
        this.notify("update");
    }

    checkCollision() {
        for(let i in gameScene.nodes) {
            let obj = gameScene.nodes[i];

            if(!obj.solid || obj.visible == false || this.visible == false || this.img.ready != true || obj.img.ready != true || obj == this || obj.constructor == this.constructor)
                continue;

            if((this.x + this.img.width/2 > (obj.x - obj.img.width/2) && this.x - this.img.width/2 < (obj.x + obj.img.width / 2)) && (this.y + this.img.height/2 > (obj.y - obj.img.height/2) && this.y - this.img.height/2 < (obj.y + obj.img.height / 2)))
            {
                //console.log("HIT");
                //console.log(this);
                //console.log(obj);
                return obj;
            }
        }
        return false;
    }
    
    draw() {
        if(this.img.ready != true)
            return;

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.degrees * Math.PI / 180);
        ctx.drawImage(this.img, -this.img.width / 2, -this.img.height / 2, this.img.width, this.img.height);
        if((this instanceof Ship) && this.movingForward) {
            ctx.drawImage(this.flameImg, -this.flameImg.width / 2, -this.flameImg.height / 2 + 45, this.flameImg.width, this.flameImg.height);
        }
        ctx.restore();
    }
}