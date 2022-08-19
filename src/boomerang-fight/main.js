// Globalne spremenljivke
var canvas, context;
var boomerang;
var vrtenje = false;
var vrtenje2 = false;
var clovek;
var cX = 500,cY = 650;
var bX = cX + 60, bY = cY - 15, bRotation = 0;
var lastMousePressed = false;
var vrtenjetime = 0;
var spremembaBx = 0;
var spremembaBy = 0;
var enemy1;
var enemy1X = 485 , enemy1Y = 20;
var pG, pS, pL, pD;
var col = false;
var napad = false;
var napadtime = 0;
var enemies = [];
var arrows = 0;
var arrowLefttime = 0, arrowRighttime = 0;
var pika;
var pikaX = cX + 40, pikaY = cY - 430;
var coltime = 0
var enemy2;
var enemy2x = 450 ,enemy2y = 50 , enemy2yS = 0 , enemy2r = 4.71238898;
var enemy2coming = false;
var col2 = false , col2time = 0 ;
var napad2time  = 0 , napad2 = false;
var smrt = false
var grm;
var grmX = 0 , grmY = 0

function main() {
    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    document.getElementById("menu").style.display = "none"
    document.getElementById("menu2").style.display = "none"

    boomerang = document.createElement("img");
    boomerang.src = "data/boomerang1.png";
    clovek = document.createElement("img");
    clovek.src = "data/clovek1.png";
    enemy1 = document.createElement("img")
    enemy1.src = "data/enemy1.1.png"
    enemy2 = document.createElement("img")
    enemy2.src = "data/nic.png"
    tick();
}

function klikPonovno() {
    location.reload()
}
  
function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    requestAnimationFrame(tick);
}

function update() {
    // Logiko sprogramirajte tukaj
    
    
    pG = {
        x: bX + boomerang.width/4,
        y: bY + boomerang.height/4   
    }

    //enemy2
    if(col2 == true && napad2 == true){
        col2time++
    }
    if(col2time > 60){
        enemy2.src = "data/nic.png"
        enemy2x = 0
        enemy2y = 0
    }
    if(col2time > 30 && col2time < 32){alert("Second enemy is down!")}
    if(col2time > 120 && col2time < 122){
        alert("You won!")
        document.getElementById("menu2").style.display = "block"
    }

    if(pG.x > enemy2x && pG.x < enemy2x + enemy2.width/4 && pG.y > enemy2y && pG.y < enemy2y + enemy2.height/4 && napad2 == true){
        col2 = true
        enemy2.src = "data/enemy2.dead.png"
    }

    if(enemy2coming){
        enemy2.src = "data/enemy2.1.png"        
        if(enemy2y < cY - 400){
            enemy2y += 0.8
        }else{
            napad2 = true
        }
    }
    if(napad2 && col2 == false){
        napad2time++
        enemy2coming = false
        enemy2y += enemy2yS

        if(napad2time < 11){
            enemy2r =  4.71238898 + 0.261799388
            enemy2.src = "data/enemy2.2.png"
            enemy2y += 1.5
        }if(napad2time > 10 && napad2time < 21){
            enemy2r = 4.71238898 + 0.523598776
            enemy2y += 1.5
            enemy2.src = "data/enemy2.3.png"
        }if(napad2time > 20 && napad2time < 31){
            enemy2r = 4.71238898 + 0.785398163
            enemy2y += 1.5
            enemy2.src = "data/enemy2.4.png"
        }if(napad2time > 30 && napad2time < 71){
            enemy2y += 2
        }
        if(napad2time > 70 && enemy2y < cY - 57){
            enemy2y += 3
        }else if(napad2time > 70){
            enemy2.src = "data/enemy2.5.png"
            napad2 = false
            smrt = true
            alert("You died!")
            document.getElementById("menu").style.display = "block"
        }
        
        
    }
    //enemy1
    if(col == true){
        coltime++
    }
    if(coltime > 60){
        enemy1.src = "data/nic.png"
        enemy1X = 0
        enemy1Y = 0
    }
    if(coltime > 30 && coltime < 32){alert("First enemy is down!")}
    if(coltime > 180 && coltime < 182){enemy2coming = true}

    if(pG.x > enemy1X && pG.x < enemy1X + enemy1.width/3 && pG.y > enemy1Y && pG.y < enemy1Y + enemy1.height/3.5){
        col = true
        enemy1.src = "data/enemy1.2dead.png"
    }    
    if(col == false && enemy1Y < cY - 40){
        enemy1Y += 1.2
        napadtime = 0
    
    }else if(enemy1Y >= cY - 40){
        napad= true
        enemy1.src = "data/enemy1.2.png"
    }
    if(napad){napadtime++}
    if(napadtime>10){
        enemy1.src = "data/enemy1.3.png"
    }
    if(napadtime>30 && napadtime < 32){
        alert("You died")
        document.getElementById("menu").style.display = "block"
    }
    //Puščice

    if (vrtenje == false && vrtenje2 == false && keyboard["ArrowLeft"] == true  && arrows > -2 && smrt == false && napad == false) {
        arrowLefttime++
        if(arrowLefttime == 0 || arrowLefttime % 7 == 0){
            arrows -= 1;
            console.log("x: " + arrows + ", " + arrowLefttime);
        }
    }else if(vrtenje == false && vrtenje2 == false && keyboard["ArrowRight"] == true && arrows < 2 && smrt == false && napad == false){
        arrowRighttime++
        if(arrowRighttime == 0 || arrowRighttime % 7 == 0){
            arrows += 1;
            console.log("x: " + arrows + ", " + arrowRighttime);
        }    
    }
    //Pike
    if(arrows == 2){pikaX = 775; pikaY = 340}
    if(arrows == 1){pikaX =  675; pikaY = 270}
    if(arrows == 0){pikaX = 525; pikaY = cY - 430}
    if(arrows == -1){pikaX = 375; pikaY = 270}
    if(arrows == -2){pikaX = 335; pikaY = 340}


    //Met
    if(vrtenje == true){
        vrtenjetime++
        bRotation = 0
        if(vrtenjetime > 10){
            bX = cX + 75
            bY = cY - 15
            clovek.src = "data/clovek2.png"
            bRotation = 0.261799388;  
        }        
        if(vrtenjetime > 10){
            clovek.src = "data/clovek3.png"
            bX = cX + 85
            bY = cY - 7.5 
            bRotation = 0.523598776;
        }
        if(vrtenjetime > 20 ){
            bX = cX + 100
            bY = cY + 5
            bRotation = 1.04719755;
            clovek.src = "data/clovek4.png"  
        }
        if(vrtenjetime > 30){
            clovek.src = "data/clovek3.png"
            vrtenje = false
            vrtenje2 = true
            vrtenjetime = 0  
        }
    }else if (mouse.pressed && !lastMousePressed) {
        // Ravnokar sem kliknil
        if(vrtenje == false && vrtenje2 == false && napad == false && smrt == false){
            vrtenje = true
        };
    }
    
    //Letenje
    if(vrtenje2 == true){
        vrtenjetime++    
        bRotation += 0.15
        bX += spremembaBx
        bY += spremembaBy  
        if(arrows == 2){
            if(vrtenjetime > 0){
                spremembaBy = -2.5
                spremembaBx = 12.5
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 20){
                spremembaBy = -5
                spremembaBx = 5
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 40){
                spremembaBy = -7.5
                spremembaBx = -5
                clovek.src = "data/clovek1.png" 
            }
            if(vrtenjetime > 60){
                spremembaBy = -2.5
                spremembaBx = -7.5
            }
            if(vrtenjetime > 80){
                spremembaBy = 2.5
                spremembaBx = -12.5
            }
            if(vrtenjetime > 100){
                spremembaBy = 5
                spremembaBx = -5
            }
            if(vrtenjetime > 120){
                spremembaBy = 7.5
                spremembaBx = 5
            }
            if(vrtenjetime > 139){
                spremembaBy = 2.5
                spremembaBx = 7.5
            }
            if(vrtenjetime > 155 ){
                spremembaBy = 0
                spremembaBx = 0
                vrtenje2 =false
                vrtenjetime = 0
                bRotation += 0.90
            }
        }else if(arrows == 1){
            if(vrtenjetime > 0){
                spremembaBy = -5
                spremembaBx = 10
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 20){
                spremembaBy = -7.5
                spremembaBx = 2.5
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 40){
                spremembaBy = -7.5
                spremembaBx = -5
                clovek.src = "data/clovek1.png" 
            }
            if(vrtenjetime > 60){
                spremembaBy = 0
                spremembaBx = -7.5
                //console.log("x,y : "+ bX + " " +bY)
            }
            if(vrtenjetime > 80){
                spremembaBy = 5
                spremembaBx = -10
            }
            if(vrtenjetime > 100){
                spremembaBy = 7.5
                spremembaBx = -2.5
            }
            if(vrtenjetime > 120){
                spremembaBy = 7.5
                spremembaBx = 5
            }
            if(vrtenjetime > 137){
                spremembaBy = 0
                spremembaBx = 7.5
            }
            if(vrtenjetime > 154 ){
                spremembaBy = 0
                spremembaBx = 0
                vrtenje2 =false
                vrtenjetime = 0
                bRotation += 0.90
            }
        }else if(arrows == 0){
            
            if(vrtenjetime > 0){
                spremembaBy = -7.5
                spremembaBx = 7.5
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 20){
                spremembaBy = -7.5
                spremembaBx = 0
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 40){
                spremembaBy = -7.5
                spremembaBx = -7.5
                clovek.src = "data/clovek1.png" 
            }
            if(vrtenjetime > 60){
                spremembaBy = 0
                spremembaBx = -7.5
            }
            if(vrtenjetime > 80){
                spremembaBy = 7.5
                spremembaBx = -7.5
            }
            if(vrtenjetime > 100){
                spremembaBy = 7.5
                spremembaBx = 0
            }
            if(vrtenjetime > 120){
                spremembaBy = 7.5
                spremembaBx = 7.5
            }
            if(vrtenjetime > 137){
                spremembaBy = 0
                spremembaBx = 7.5
            }
            if(vrtenjetime > 155 ){
                spremembaBy = 0
                spremembaBx = 0
                vrtenje2 =false
                vrtenjetime = 0
                bRotation += 0.90
            }
        }else if(arrows == -1){
            if(vrtenjetime > 0){
                spremembaBy = -7.5
                spremembaBx = 5
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 20){
                spremembaBy = -7.5
                spremembaBx = -2.5
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 40){
                spremembaBy = -5
                spremembaBx = -10
                clovek.src = "data/clovek1.png" 
            }
            if(vrtenjetime > 60){
                spremembaBy = 0
                spremembaBx = -7.5
            }
            if(vrtenjetime > 80){
                spremembaBy = 7.5
                spremembaBx = -5
            }
            if(vrtenjetime > 100){
                spremembaBy = 7.5
                spremembaBx = 2.5
            }
            if(vrtenjetime > 120){
                spremembaBy = 5
                spremembaBx = 10
            }
            if(vrtenjetime > 137){
                spremembaBy = 0
                spremembaBx = 7.5
            }
            if(vrtenjetime > 155 ){
                spremembaBy = 0
                spremembaBx = 0
                vrtenje2 =false
                vrtenjetime = 0
                bRotation += 0.90
            }
        }else if(arrows == -2){
            if(vrtenjetime > 0){
                spremembaBy = -7.5
                spremembaBx = 5
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 20){
                spremembaBy = -7.5
                spremembaBx = -2.5
                clovek.src = "data/clovek2.png" 
            }
            if(vrtenjetime > 40){
                spremembaBy = -2.5
                spremembaBx = -12.5
                clovek.src = "data/clovek1.png" 
            }
            if(vrtenjetime > 60){
                spremembaBy = 2.5
                spremembaBx = -7.5
                //console.log("x,y : "+ bX + " " +bY)
            }
            if(vrtenjetime > 80){
                spremembaBy = 7.5
                spremembaBx = -5
            }
            if(vrtenjetime > 100){
                spremembaBy = 7.5
                spremembaBx = 2.5
            }
            if(vrtenjetime > 120){
                spremembaBy = 2.5
                spremembaBx = 12.5
            }
            if(vrtenjetime > 137){
                spremembaBy = -2.5
                spremembaBx = 7.5
            }
            if(vrtenjetime > 157 ){
                spremembaBy = 0
                spremembaBx = 0
                vrtenje2 =false
                vrtenjetime = 0
                bRotation += 0.90
            }
        }
    }

    if (!mouse.pressed && lastMousePressed) {
        // Ravnokar sem spustil
    }
    /*if (keyboard["a"]) {
        bX -= 5;
    } else if (keyboard["d"]) {
        bX += 5;
    }
    if (keyboard["s"]){
        bY += 5
    }else if (keyboard["w"]){
        bY -= 5
    }
    */
    lastMousePressed = mouse.pressed;

}


function draw() {
    // Risanje sprogramirajte tukaj

    // Narisemo ozadje
    context.fillStyle = "#88FF88";
    context.fillRect(0,0,canvas.width,canvas.height);

    context.fillStyle = "88FF88";
    context.fillRect(pG.x , pG.y, 1 ,1);
    //Narišemo krog
    context.beginPath();
    context.fillStyle = "orange";
    context.ellipse(pikaX, pikaY, 5, 5, 0, 0, 2*Math.PI);
    context.fill();

    // Boomerang
    drawImageRotated(context, clovek, cX, cY, clovek.width/2, clovek.height/2, 0)
    drawImageRotated(context, enemy1, enemy1X, enemy1Y, enemy1.width/2, enemy1.height/2)
    drawImageRotated(context, enemy2, enemy2x, enemy2y, enemy2.width/3, enemy2.height/3, enemy2r)
    drawImageRotated(context, boomerang, bX, bY, boomerang.width/2, boomerang.height/2, bRotation);
}
