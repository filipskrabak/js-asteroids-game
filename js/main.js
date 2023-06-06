let canvas;
let ctx;
let centerX;
let centerY;
let ship;
let gameScene;
let game;
let buttons = [];
let music = [];

// Inicializácia
window.onload = function() {
    canvas = document.getElementById("canvas");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    centerX = canvas.width / 2;
    centerY = canvas.height / 2;

    ctx = canvas.getContext('2d');

    game = new Game();
    gameScene = new GameObject();

    game.introductionMenu(gameScene);

    render();
}

// Main Loop
function render() {
    clearView();
    controller();
    gameScene.update();
    requestAnimationFrame(render);
}