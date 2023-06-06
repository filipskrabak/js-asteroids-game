class GameSound {
    constructor(src, type, volume, loop) {
        this.sound = new Audio(src);
        this.sound.load();
        this.type = type;
        this.volume = volume;
        this.loop = loop;

        this.sound.loop = loop;
        this.sound.volume = volume;
    }
    play() {
        if((this.type === "sound" && game.sound === true) || (this.type === "music") && game.music === true)
            this.sound.play();
    }
    
    stop() {
        this.sound.pause();
    }
}