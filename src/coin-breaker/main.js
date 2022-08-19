// Globalne spremenljivke
var canvas, context;
var bX = 100, bY = 100, bRotation = 0;
var mX, mY;
var rX, rY;
var football;
var goal;
var size = 25;
var score = 0;
var win = false
var maze = [
    [1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,1,1,1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,2,2,2,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,2,1,1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,1,1,1,1],
    [1,2,1,2,2,2,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1],
    [1,2,1,2,2,2,1,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,1,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,2,1,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,2,1,2,1,1,1,1,2,1,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,2,1,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,2,1,1,2,1,2,1,1],
    [1,2,1,1,2,1,1,1,2,1,2,1,1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,2,1,1,2,1,2,1,1],
    [1,2,1,1,2,2,2,2,2,1,2,1,1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,2,1,1,2,1,2,1,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,2,1,1,2,2,2,1,1,1,1,1,1,2,1,2,1,2,1,1,2,1,2,1,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1,2,2,2,2,1,1,1,2,2,2,2,2,1,1,2,1,2,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,1,2,2,2,2,2,2,1,1],
    [1,2,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1,2,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,1,2,1,1,1,1],
    [1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1],
    [1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,2,2,2,2,2,2,2,1,1,2,1,1,1,1],
    [1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,1],
    [1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,1,1],
    ]

function main() {
    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");


   football = document.createElement("img")
   football.src = "data/football.png"
   coin = document.createElement("img")
   coin.src = "data/coin.webp"

    tick();
}

function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    requestAnimationFrame(tick);
}

function update() {
    // Logiko sprogramirajte tukaj

    mX = Math.floor(bX /size);
    mY = Math.floor(bY /size);

    rX = bX - mX*size;
    rY = bY - mY*size;
    
    if ((keyboard["a"] || keyboard["ArrowLeft"]) && !zabil(bX, bY, -2, 0)) {
        bX -= 2;
    }
     if ((keyboard["d"] || keyboard["ArrowRight"]) && !zabil(bX, bY, +2, 0)) {
        bX += 2;
    }

    if ((keyboard["w"] || keyboard["ArrowUp"]) && !zabil(bX,bY, 0, -2)) {
        bY -= 2;
    }
    if  ((keyboard["s"] || keyboard["ArrowDown"]) && !zabil(bX, bY, 0, +2)) {
        bY += 2;
    }

    if (maze[mY] != undefined && maze[mY][mX] != undefined) {
        if (maze[mY][mX] == 2) {
            maze[mY][mX] = 0
            score++
            preveriZmago()
        }
    }

}

function zabil (x, y, dx, dy) {
    var nX = Math.floor((x+dx) /size);
    var nY = Math.floor((y+dy) /size);

    // Ce smo v crnem kvadratku, nas vrni nazaj
    if (maze[nY] != undefined && maze[nY][nX] != undefined) {
        if (maze[nY][nX] == 1) {
            return true;
        }
    }
    return false;
}
function preveriZmago () {
    var coinsleft = 0
    for (var i = 0; i < maze.length; i++){
        for (var j = 0; j < maze[i].length; j++){
            if (maze[i][j] == 2){
                coinsleft++
            }
        }
    }
    if (coinsleft == 0 ) {
        win = true

    
    }
}



function draw() {
    // Risanje sprogramirajte tukaj
    context.fillStyle = "white";
    context.fillRect(0,0,canvas.width,canvas.height);
    // Narisemo ozadje
    for (var i = 0; i < maze.length; i++){
        for (var j = 0; j < maze[i].length; j++){
            if (maze[i][j] == 1){
                context.fillStyle = "black"
                context.fillRect(j * size, i * size, size, size)
            } else if (maze[i][j] == 2) {
                context.fillStyle = "green"
                context.fillRect(j * size +size/3, i * size +size/3, size - size*2/3, size -size*2/3)

                context.drawImage (coin, j * size +size/3, i * size +size/3, size -size*1/2, size -size*1/2)
            }

           
        }
        

    }

/*
    // Labirint
    drawImageRotated(context, ozadje, bX, bY, ozadje.width/2, ozadje.height/2, bRotation);
*/
    drawImageRotated(context, football, bX -size/2, bY -size/2, football.width/30, football.height/30, 0);

    context.fillStyle = "blue";
    context.fillRect(bX -2, bY -2, 5, 5);


    context.font = "32px Arial";
    context.fillText("Score: "+score, 10, 30);
    //context.fillText("mX:"+mX+", mY:"+mY+", rX:"+rX+", rY:"+rY, 10, 30); 
    
    if (win) {
        context.fillStyle = "#3366CC88";
        context.fillRect(250, 250, 350, 100);
       
        context.fillStyle = "white"
        context.font = "50px Arial";
        context.fillText("Zmagal si!", 300, 300);
    }
}