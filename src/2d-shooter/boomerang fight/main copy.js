// Globalne spremenljivke
var canvas, context;
var boomerang;
var vrtenje = false;
var clovek;
var bX = 620, bY = 520, bRotation = 0;
var lastMousePressed = false;
var vrtenjetime = 0

function main() {
    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    boomerang = document.createElement("img");
    boomerang.src = "data/boomerang1.png";
    clovek = document.createElement("img");
    clovek.src = "data/clovek1.png";
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
    }
    if (keyboard["a"]) {
        bX -= 5;
    } else if (keyboard["d"]) {
        bX += 5;
    }
    if (keyboard["s"]){
        bY += 5
    }else if (keyboard["w"]){
        bY -= 5
    }
/*
    if (mouse.pressed && !lastMousePressed) {
        // Ravnokar sem kliknil
        if(vrtenje == true){
            vrtenje = false
        }else if(vrtenje == false){
            vrtenje = true
        }
    }

    if (!mouse.pressed && lastMousePressed) {
        // Ravnokar sem spustil
    }

    if(vrtenje == true){
        vrtenjetime++
        if(vrtenjetime > 10){
            bX = 650
            bY = 520
            clovek.src = "data/clovek2.png"
            bRotation = 0.261799388;  
        }
        if(vrtenjetime > 30){
            clovek.src = "data/clovek3.png"
            bX = 670
            bY = 535
            bRotation = 0.523598776;
        }
        if(vrtenjetime > 50){
            bX = 750
            bY = 560
            bRotation = 1.04719755;
            clovek.src = "data/clovek4.png"
            
        }
    }
        
        /*while(bY != 520 && bX !=620){
            bRotation += 15
        }
        */
        
    

    lastMousePressed = mouse.pressed;


function draw() {
    // Risanje sprogramirajte tukaj

    // Narisemo ozadje
    context.fillStyle = "#CCEEFF";
    context.fillRect(0,0,canvas.width,canvas.height);

    // Narisemo krog
    /*context.beginPath();
    context.fillStyle = "orange";
    context.ellipse(200, 200, 100, 100, 0, 0, 2*Math.PI);
    context.fill();
    */

    // Boomerang
    drawImageRotated(context, clovek, 500, 550, clovek.width/2, clovek.height/2, 0)

    drawImageRotated(context, boomerang, bX, bY, boomerang.width/2, boomerang.height/2, bRotation);
}

