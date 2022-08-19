// Globalne spremenljivke
var canvas, context;
var car;
var bX = 100, bY = 100, bRotation = 0;
var scrollX= 10
var konecigre=false
var time=0
var stopnjevanje = 5;
var gumaImg;
var gumaSize = 100;
var score=0
var bestScore
var gume = [
  
]


function main() {
    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    car = document.createElement("img");
    car.src = "data/avto.png";
    
    cesta = document.createElement("img");
    cesta.src = "data/cesta.png ";

    gumaImg = document.createElement("img");
    gumaImg.src = "data/gume.png ";

    bestScore = parseInt( localStorage.getItem ( "bestScore"));
    if (isNaN(bestScore)) bestScore = 0;

    tick();
}

function collision(x,y,w,h,xp,yp)
{
    if (xp > x && xp<x+w &&
        yp > y && yp<y+h)
    {
        return true;    
    }
    return false
}

  
function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    if (!konecigre) requestAnimationFrame(tick);


}

function update() {
    // Logiko sprogramirajte tukaj
    
   

    if (keyboard["a"]) {
        bX -= 7;
    } else if (keyboard["d"]) {
        bX += 7;
    }

    if (keyboard["w"]) {
        bY -= stopnjevanje*1.5;
    } else if (keyboard["s"]) {
        bY += stopnjevanje*1.5;
    }
    scrollX+= stopnjevanje
    
    //tu
    for(var i=0; i< gume.length; i++){
        gume[i].x -= stopnjevanje
    }
    
    if (bY < 0){
        bY=0;
    }
    if (bY > canvas.height - car.height/3) {
        bY= canvas.height - car.height/3;
    }


    for (var i = gume.length -1; i >= 0; i--){
        if (gume[i].x < 0 -gumaSize){
            gume.splice(i, 1);
        }
    }
     
    if (time % 75 == 0) {
        score=score+1
        var rnd = Math.random();
        if (rnd < 0.25) {
            // Scenarij 1
            gume.push({
                x: 1200,
                y: 0 * 145 + 35,
            })
            gume.push({
                x: 1200,
                y: 1 * 145 + 35,
            })
            gume.push({
                x: 1200,
                y: 2 * 145 + 35,
            })
            
        } else if (rnd < 0.5) {
            // Scenarij 2
            gume.push({
                x: 1200,
                y: 0 * 145 + 35,
            })
            gume.push({
                x: 1200,
                y: 2 * 145 + 35,
            })
            gume.push({
                x: 1200,
                y: 3 * 145 + 35,
            })
        } else if (rnd < 0.75) {
            // Scenarij 3
            gume.push({
                x: 1200,
                y: 0 * 145 + 35,
            })
            gume.push({
                x: 1200,
                y: 1 * 145 + 35,
            })
            gume.push({
                x: 1200,
                y: 3 * 145 + 35,
            })
        } else {
            // Scenarij 4
            gume.push({
                x: 1200,
                y: 1 * 145 + 35,
            })
            gume.push({
                x: 1200,
                y: 2 * 145 + 35,
            })
            gume.push({
                x: 1200,
                y: 3 * 145 + 35,
            })
        }
            
       
    }

    if (time % 180 == 0) {
        stopnjevanje++;
    }

    time++;

    for(var i = 0; i< gume.length; i++){
        //console.log("i:",gume[i].x, gume[i].y,  gumaSize , gumaSize);
        if (
            collision(bX,bY,car.width/3,car.height/3,gume[i].x, gume[i].y) ||
            collision(bX,bY,car.width/3,car.height/3,gume[i].x, gume[i].y+gumaSize) ||
            collision(bX,bY,car.width/3,car.height/3,gume[i].x + gumaSize, gume[i].y) ||
            collision(bX,bY,car.width/3,car.height/3,gume[i].x + gumaSize, gume[i].y+ gumaSize)||
            
            collision(gume[i].x, gume[i].y, gumaSize, gumaSize,bX,bY) ||
            collision(gume[i].x, gume[i].y, gumaSize, gumaSize,bX,bY + car.height/3) ||
            collision(gume[i].x, gume[i].y, gumaSize, gumaSize,bX + car.width/3,bY) ||
            collision(gume[i].x, gume[i].y, gumaSize, gumaSize,bX + car.width/3,bY + car.height/3)
            ) {
                konecigre=true
                if (score>bestScore){
                    bestScore = score;
                    localStorage.setItem ("bestScore", bestScore);
                }
            }
    }


    
}

function draw() {
    // Risanje sprogramirajte tukaj

    // Narisemo ozadje
    //context.fillStyle = "#CCEEFF";
    //context.fillRect(0,0,canvas.width,canvas.height);

    var w= canvas.width
    var h= canvas.height

    context.drawImage(cesta, -(scrollX % w) -w, 0,w, h);
    context.drawImage(cesta, -(scrollX % w), 0, w, h);
    context.drawImage(cesta, -(scrollX % w) +w, 0, w, h);
    



    for (var i=0; i< gume.length; i++) {
        context.drawImage(gumaImg, gume[i].x, gume[i].y, gumaSize, gumaSize);
        
    }
    

    //context.drawImage ,( map 0, 0);

  

     drawImageRotated(context, car, bX, bY,  car.width/3 , car.height/3, bRotation );

     context.fillStyle="blue"
     context.font="20px Arial"
     context.fillText("Score: "+score,20, 20)

     context.fillStyle="blue"
     context.font="20px Arial"
     context.fillText("bestScore: "+bestScore,20, 40)
  
    if (konecigre) {
        context.fillStyle="red"
        context.font="40px Arial"
        context.fillText("game over",600, 400)
    }

}
