 //Globalne spremenljivke
 var Y_TLA = 480;
 var canvas, context;
var character;
var bX = 100, bY = Y_TLA, bRotation = 0;
var G = 2;
var bYvel = 0;//hitrost (velocity)
var fire2;
var mapa;
var zadnja_crka="" 
var characterRotated
var stop = false;
var gameover;
var time= 0
var heart
var bestScore=0

//var fireX=Math.random()*1500, fireY=10;
//var fireYvel = 0;
var G2 = 0.2;
var fires = [
    {
        x: -100,
        y: 0,
        vel: 0,
    },
    {
        x: -100,
        y: -150,
        vel: 0,
    },
    {
        x: -100,
        y: -250,
        vel: 0,
    },
    {
        x: -100,
        y: -50,
        vel: 0,
    },
    {
        x: -100,
        y: -100,
        vel: 0,
    },
    {
        x: -100,
        y: -200,
        vel: 0,
    },
    {
        x: -100,
        y: -300,
        vel: 0,
    },
    {
        x: -100,
        y: -400,
        vel: 0,
    },
    {
        x: -100,
        y: -600,
        vel: 0,
    },
    {
        x: -100,
        y: -500,
        vel: 0,
    },
    {
        x: -100,
        y: 200,
        vel: 0,
    },
    {
        x: -100,
        y: 50,
        vel: 0,
    },
    {
        x: -30,
        y: 50,
        vel: 0,
    },
    {
        x: 5,
        y: 50,
        vel: 0,
    },
    {
        x: 20,
        y: 50,
        vel: 0,
    },
    {
        x: 200,
        y: 50,
        vel: 0,
    },
    {
        x: 30,
        y: 50,
        vel: 0,
    },
    {
        x: 400,
        y: 50,
        vel: 0,
    },
    {
        x: 250,
        y: 50,
        vel: 0,
    },
    {
        x: 350,
        y: 50,
        vel: 0,
    },
    
]

function main() {
     //Zacetek programa
     //Najdemo canvas in si ga shranimo v globalno spremenljivko
    canvas = document.getElementById("canvas");
    canvas.addEventListener('mousedown', function(e) {
        console.log("x: ",e.pageX)
        console.log("y: ",e.pageY)
        var x=e.pageX
        var y=e.pageY
        if (x>692 && x<767 && y>356 && y<385){
            console.log("click na gumb")
            location.reload()
        }




        
    })
    context = canvas.getContext("2d");
    context.font = "30px Comic Sans MS";
    //context.fillStyle= "black"
    


    characterRotated = document.createElement("img");
    characterRotated.src = "data/characterRotated.png";
    
    character = document.createElement("img");
    character.src = "data/character.png";
    
    mapa = document.createElement("img");
    mapa.src = "data/mapa.jpg";

    fire2 = document.createElement("img");
    fire2.src = "data/fire2.png";

    gameover = document.createElement("img");
    gameover.src = "data/gameover.jpg";
    

    heart = document.createElement("img");
    heart.src = "data/heart.png";
    


    tick();
}

//function pridobiXY(canvas, event)

function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    time++
    if (!stop) requestAnimationFrame(tick);
}

function update() {
    // Logiko sprogramirajte tukaj
    
    for (var i = 0; i < fires.length; i++) {
        if (fires[i].y > Y_TLA){
            fires[i].x=-50+Math.random()*1500;
            fires[i].y=-fire2.height/2;
            fires[i].vel=0;
        }

    }
    
     


    // context.fillRect(fires[i].x +fire2.width/4 -3 , fires[i].y +fire2.height/4 -3 +20, 7, 7)
    for (var i = 0; i < fires.length; i++) {
        var fx = fires[i].x +fire2.width/4;
        var fy = fires[i].y +fire2.height/4 +20;
        if (fx > bX && fx < bX + character.width/4 && 
            fy > bY && fy < bY + character.height/4) 
        { 
            stop = true;
            //alert("dead")
        }
    }


    bRotation += 0.25;

    if (keyboard["a"]) {
        bX -= 5;
        zadnja_crka="a"
    } else if (keyboard["d"]) {
        bX += 5;
        zadnja_crka="d"
    }
    
    if (keyboard["w"] && bY > Y_TLA -1)
    bYvel -=28;

    localStorage.setItem("bestScore", 100)
    

    


    // gravitacija
    bYvel =bYvel + G;
    bY = bY + bYvel;

    // gravitacija fire
    for (var i = 0; i < fires.length; i++) {
        fires[i].vel += G2;
        fires[i].y += fires[i].vel;
    }

    // tla
    if (bY> Y_TLA){
        bY=Y_TLA
        bYvel= 0;
    }

    // levi rob
    if (bX < -15){
        bX = -15
    }

    // desni rob
    if (bX > canvas.width-character.width/4){
        bX = canvas.width-character.width/4
    }
}




function draw() {
    // Risanje sprogramirajte tukaj

    // Narisemo ozadje
    //context.fillStyle = "#CCEEFF";
    //context.fillRect(0,0,canvas.width,canvas.height);
    

        context.drawImage(mapa, 0, 0, canvas.width, canvas.height);
    
     for (var i = 0; i < fires.length; i++) {
        context.drawImage(fire2 , fires[i].x, fires[i].y, fire2.width/2, fire2.height/2);
        context.fillStyle = "yellow";
        context.fillRect(fires[i].x +fire2.width/4 -3 , fires[i].y +fire2.height/4 -3 +20, 7, 7)
    }
    time++
    context.fillText(time,50, 50)
    

    localStorage.getItem("bestScore")
    '100'

    // Narisemo krog
   /* context.beginPath();
    context.fillStyle = "orange";
    context.ellipse(200, 200, 100, 100, 0, 0, 2*Math.PI);
    context.fill();*/

    if (stop) {
        //context.font = "30px Arial";
        //context.fillText("Dead!", canvas.width/2 -50, canvas.height/4);
        context.drawImage(gameover , 550, 200, gameover.width/2, gameover.height/2);
    }
    

    if (zadnja_crka=="a"){
        drawImageRotated(context, characterRotated, bX, bY, characterRotated.width /4, characterRotated.height /4, );
    } else {
        drawImageRotated(context, character, bX, bY, character.width /4, character.height /4, );
    }

}
 