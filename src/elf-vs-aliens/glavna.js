
var canvas, context;
var ozadje
var palceklevo
var palcekdesno
var platform
var spaceship
var shipspeed = 0
var shipX = -1000
var shipY = -100
var pX = 0
var pY = 0
var premik = 4.5
var keyboard = {};
var gravispeed = 1
var G = 1 
var speed = 0
var platX = 700
var zadtip = ""
var platY = 500
var mode = 0
var start
var bomba
const bombe = []
var time = 0
var faktor = 0.01
var faktorpadca = 2
var faktortime = 35
var life3
var life2
var life1
var life = 3
var hit = -1

function main() {

    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");
    
pY = canvas.height/2
pX = canvas.width/2

    life3 = document.createElement("img")
    life3.src = "slike/life3.png";
    life2 = document.createElement("img")
    life2.src = "slike/life2.png";
    life1 = document.createElement("img")
    life1.src = "slike/life10.png";
    bomba = document.createElement("img")
    bomba.src = "slike/bomba.png";
    spaceship = document.createElement("img")
    spaceship.src = "slike/spaceship.png";
    platform = document.createElement("img")
    platform.src = "slike/2.png";
    ozadje = document.createElement("img");
    ozadje.src = "slike/ozadje.jpg";
    palceklevo = document.createElement("img");
    palceklevo.src = "slike/palcek_levo.png";
    palcekdesno = document.createElement("img");
    palcekdesno.src = "slike/palcek_desno.png";
    tick()
}

function tick() {
    update(); 
    draw(); 
    if(life > 0){
        requestAnimationFrame(tick);

    }else{
        window.location.href = "gameover.html"

    }
}

function update() {
    time = time + 1 

    if (keyboard["a"]) {
        pX -= premik;
        zadtip = "a"
    } if (keyboard["d"]) {
        zadtip = "d"
        pX += premik;
    } if (keyboard["w"] && pY > canvas.height - 331){
        speed = -15
    }
    
        shipX = shipX + shipspeed
        shipspeed = shipspeed + faktor
    
    if (shipX > canvas.width + 1500) {
        shipX = -1000
        shipspeed = 0
        faktor = faktor + 0.01
        faktorpadca = faktorpadca + 2
        faktortime = faktortime - 3
    }

    if (faktortime < 5) {
        faktortime = 5
    }



    if (shipX > -250 && time% faktortime === 0 ) {
        bombe.push({
                x: shipX + 200,
                y: shipY + 200
            });
        
    }
    for (let i = 0; i < bombe.length; i++) {
        bombe[i].y +=faktorpadca
        
    }
    
    

    for (let i = 0; i < bombe.length; i++) {
        if (bombe[i].x + 15 > pX && bombe[i].x + 15 < pX + 90 && bombe[i].y +80 > pY + 20 && bombe[i].y + 80 < pY +150) {
            
            if (hit != i) {
                life--
                hit = i
                bombe[i] = ""
            }


        }
        
    }



    pY = pY + speed
    speed = speed + G
    if (pY > canvas.height - 330) 
    pY = canvas.height - 330;
    if (pX < -30)
    pX = -29
    if (pX > canvas.width - 120)
    pX = canvas.width - 119
}





function draw() {
    context.drawImage (ozadje, 0,0, canvas.width, canvas.height)
    if (zadtip == "a") {
        context.drawImage (palceklevo, pX, pY, 90,150)
    } else {
        context.drawImage (palcekdesno, pX, pY, 90,150)
    }
   
    for (let i = 0; i < bombe.length; i++) {
        context.drawImage (bomba, bombe[i].x, bombe[i].y, 30,80)

        
    }
   
    if (life == 3) {
        context.drawImage (life3, canvas.width/2 + 480, canvas.height/2 - 360, 300,60)
}
     if (life == 2) {
        context.drawImage (life2, canvas.width/2 + 480, canvas.height/2 - 360, 300,60)
}

     if (life == 1) {
        context.drawImage (life1, canvas.width/2 + 480, canvas.height/2 - 360, 300,60)
}
        context.drawImage (spaceship, shipX, shipY, 500, 370)
}





document.addEventListener("DOMContentLoaded", function() {
    var doResize = function() {
        var canvas = document.getElementById("canvas");
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };
      window.addEventListener("resize", doResize);
      doResize();
      

      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("keyup", handleKeyUp);
      
      function handleKeyDown(e) {
        console.log("Tipka", e.key);
        keyboard[e.key] = true;
      }
      function handleKeyUp(e) {
        delete keyboard[e.key];
      }

      main()
});
     