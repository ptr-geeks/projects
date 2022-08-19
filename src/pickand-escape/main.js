// Globalne spremenljivke
var canvas, context;
var ozadje;
var bX = 35, bY = 35, bRotation = 0;
var player;
var scrollX;
var size = 25;
var rX, rY;
var score = 0
var ghost
var win = false
var gX = 35, gY = 10
var stopinje = []
var time = 0
var konec = false;
var gameOver = false
var maze = [
[1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,2,2,2,2,1,2,2,2,2,1,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1],
[1,2,1,1,2,1,2,1,2,1,1,2,1,2,1,1,1,2,2,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,2,1,2,1,2,2,2,1,1,1],
[1,2,2,1,2,1,2,1,2,1,2,2,1,2,1,2,1,1,2,1,2,1,2,2,2,2,2,1,2,2,2,1,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,1,2,1,2,2,2,1],
[1,2,2,1,2,2,2,1,2,1,1,2,1,2,1,2,2,2,2,1,2,1,2,1,1,1,2,1,2,1,2,1,2,1,2,2,2,1,1,1,2,1,1,1,1,2,1,2,1,1,1,2,2,1,2,1,1,1,1,1,1,1],
[1,2,1,1,1,2,1,1,2,2,2,2,1,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,1,1,1,1,2,2,2,2,2,1],
[1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,1,2,2,1,2,2,2,2,2,2,2,1,2,1,2,1,2,2,2,2,2,2,2,1,2,2,2,2,2,1,2,2,1,2,1,2,2,2,2,1,1,1,1,1],
[1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1,2,1,2,1,1,2,2,2,1,1,1,1,1,2,1,2,1,2,1,1,1,1,1,2,1,1,2,1,1,2,1,2,2,2,2,2,1],
[1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,1,1,1,1,1,1,2,1,1,2,2,2,2,2,1,1,2,1,2,2,1,2,2,1,2,2,2,2,2,1,2,1,1,2,1,1,1,1],
[1,2,1,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,2,1,2,1,1,1,2,1,1,1,1,1,2,1,2,2,2,2,2,2,2,1],
[1,2,1,2,2,2,2,2,2,2,2,2,1,1,1,2,2,2,2,2,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,1,1,2,1,1],
[1,2,1,2,1,1,2,1,1,1,1,2,1,2,1,1,2,1,1,1,1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,1,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1],
[1,1,1,1,1,1,2,1,2,2,2,2,2,2,2,2,2,1,2,2,1,2,1,1,1,2,1,1,1,2,1,1,1,1,1,2,1,1,1,2,1,1,1,1,1,2,1,2,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
[1,2,2,2,2,2,2,1,1,1,1,1,1,2,1,1,1,1,2,1,1,2,1,2,1,2,1,2,1,2,2,2,2,2,1,2,1,2,1,2,1,2,1,2,1,2,2,2,1,2,1,1,2,1,1,1,1,1,1,2,1,1],
[1,2,1,1,2,1,1,1,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,2,2,2,2,2,1,2,1,2,1,1,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,1,2,1,2,1,2,2,2,2,1,1,1,1],
[1,2,2,1,1,1,2,2,2,1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,2,1,1,1,1,1,1,1,2,1,1,1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,1],
[1,2,1,1,2,1,2,1,1,1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,1,1,1,1,1,2,1,1,1,1,1,1],
[1,2,1,2,2,2,2,1,2,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,2,1,2,1,2,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1],
[1,2,1,1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,1,2,1,2,1,2,1,1,2,1],
[1,2,1,1,1,1,1,1,1,2,1,1,1,1,1,1,1,2,1,1,1,2,1,1,2,1,1,1,1,2,1,1,1,1,1,2,1,2,1,2,1,1,1,1,2,1,2,1,1,1,1,1,1,1,1,1,1,2,1,2,1,1],
[1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,2,2,1,2,2,2,1,2,1,2,2,2,2,2,2,2,2,1,2,1,2,1,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,2,2,1,2,1,2,2,1],
[1,2,1,1,1,1,1,2,1,2,1,2,1,1,1,2,1,2,1,2,2,1,1,2,2,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,2,1,2,1,1,1,2,1,1,1,1,1,1,2,1,2,1,1],
[1,2,1,2,2,2,1,2,1,2,1,1,2,2,1,2,1,1,1,1,2,2,1,2,1,1,2,1,1,1,2,1,1,2,2,2,1,2,1,2,2,2,1,1,1,1,1,1,2,1,2,1,2,1,2,2,2,2,1,2,1,1],
[1,2,2,2,1,2,2,2,1,2,2,2,2,1,1,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,1,1,1,2,2,2,1,2,2,2,2,2,2,2,2,1,2,2,2,1,2,1,1,2,2,2,2,1],
[1,1,2,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,2,1,2,1,1,1,1,1,1,2,1,1,1,2,1,1,1,2,1,1,1,2,1,1,2,1,1],
[1,2,2,1,2,2,2,2,1,2,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,2,2,1,2,1,2,2,2,2,2,2,2,2,1,2,2,2,2,1,2,2,2,2,2,1],
[1,1,2,1,1,2,1,2,1,2,1,1,2,1,2,1,2,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1,2,1,1,1,2,1,2,1,1,1,1,2,1,1,2,1,1,2,1,1,2,1,1,1,1,2,1,1],
[1,2,2,1,2,2,1,2,2,2,1,2,2,1,2,1,2,2,2,1,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,1,2,2,1,2,2,1,2,2,2,2,1,2,2,2,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1],
]
function main() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    player = document.createElement("img");
    player.src = "data/player2.png";

    banana = document.createElement("img");
    banana.src = "data/banana.webp";

    ghost = document.createElement("img")
    ghost.src = "data/ghost-removebg-preview.png";
    
    for (var i = 0; i < 100; i++) {
        stopinje.push({x:gX, y:gY})
    }

    tick();
}

  
function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    if (!konec) requestAnimationFrame(tick);
}

function update() {
    // Logiko sprogramirajte tukaj
    
    bRotation += 0

    mX = Math.floor ((bX) /size);
    mY = Math.floor ((bY) /size);

    rX = bX - mX*size;
    rY = bY - mY*size;
   

    if ((keyboard["a"] || keyboard["ArrowLeft"]) && !zabil(bX, bY, -2, 0)) {
        bX -= 2;
    }

    if ((keyboard["d"] || keyboard["ArrowRight"]) && !zabil(bX, bY, +2, 0)) {
        bX += 2;
    }

    if ((keyboard["w"] || keyboard["ArrowUp"]) && !zabil(bX, bY, 0, -2)) {
        bY -= 2; 
    }

    if ((keyboard["s"] || keyboard["ArrowDown"]) && !zabil(bX, bY, 0, +2)) {
        bY += 2;
    }

    if (maze[mY][mX] == 2) {
        maze[mY][mX] = 0
        score++ 
        preveriZmago()
    }

    time++;
    if(time % 100 == 0) {
        stopinje.push({x:bX, y:bY})
    }
    if (stopinje.length > 0 ) {
        if (gX < stopinje[0].x) {
            gX += 1
        }
        if (gX > stopinje[0].x) {
            gX -= 1
        }
        if (gY < stopinje[0].y) {
            gY += 1
        }
        if (gY > stopinje[0].y) {
            gY -= 1
        }

        if (gX > stopinje[0].x -1 && gX < stopinje[0].x +1 && gY > stopinje[0].y -1 && gY < stopinje[0].y +1) {
            // ghost je zelo blizu stopinje
            stopinje.splice(0,1)
        }
    }

    // preverimo ali je ghost ujel playerja
    if (gX > bX - 10 && gX < bX + 10 && gY > bY - 10 && gY < bY + 10) {
        konec = true
    }
  
}

function zabil (x, y, dx, dy) {


    nX = Math.floor ((x+dx) /size);
    nY = Math.floor ((y+dy) /size);

    if (maze[nY] != undefined && maze[nY][nX] != undefined) {
        if (maze[nY][nX] == 1) {
            return true;
 
        }
    
    } 
    return false

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
    context.fillStyle = "indigo";
    context.fillRect(0,0,canvas.width,canvas.height);

     //player
    drawImageRotated(context, player, bX -size/2, bY -size/2, player.width/40, player.height/40, 0);


    //maze
    context.fillStyle = "black"
    for (var i = 0; i < maze.length; i++) {
        for (var j = 0; j < maze[i].length; j++) {
            if (maze[i][j] == 1) {
                context.fillRect(j * size, i * size, size, size)

               
            } else if (maze[i][j] == 2) {
                context.drawImage (banana, j * size +size/3, i * size +size/3, size - size*2/3, size -size*2/3)
            }
        } 
    }

    //ghost
    drawImageRotated(context, ghost, gX -size/2, gY -size/2, size, size, 0);


    context.fillStyle = "red";
    context.fillRect(bX -2, bY -2, 5, 5);

    //context.font = "32px Arial";
    //context.fillText("mX:"+mX+", mY:"+mY+", rX:"+rX+", rY:"+rY, 10, 30);

    context.font = "32px Arial";
    context.fillText("Score: "+score, 10, 30);

    if (win) {
        context.fillStyle = "#3366CC88";
        context.fillRect(200, 250, 400, 100);

        context.fillStyle = "red"
        context.font = "50px Arial";
        context.fillText("you won!", 300, 300);
    }
    if (konec) {
        context.fillStyle = "#3366CC88";
        context.fillRect(200, 250, 400, 100);

        context.fillStyle = "red"
        context.font = "50px Arial";
        context.fillText("game over!", 300, 300);
    }

}



                                                                                  







        
    












