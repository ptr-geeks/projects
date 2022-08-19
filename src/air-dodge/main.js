var explosion = new Audio('data/explosion.mp3')
const jet = new Audio('data/jet.wav')
jet.loop = true
var bestScore = ""
var canvas, context;
var score = 0
var plane;
var building;
var building2;
var HighScore = parseInt(localStorage.getItem(HighScore));
var city;
var museum;
var rocket4;
var HighScore
var house;
var bX = 790, bY = 600, bRotation = 0;
var buX = Math.random()*1500, buY = -350, buRotation = 0;
var cX = Math.random()*1500, cY = -750, cRotation = 0;
var b2X = Math.random()*1500, b2Y = -1400, b2Rotation = 0;
var hX = Math.random()*1500, hY = -1000, hRotation = 0;
var mX = Math.random()*1500, mY = -1350, mRotation = 0;
var rocket
var rocket2
var rocket5
var r2X = Math.random()*1500, r2Y = 1000, r2Rotation = 0
var r3X = Math.random()*1500, r3Y = 1000, r3Rotation = 0
var r4X = Math.random()*1600, r4Y = -600, r4Rotation = 3.14
var r5X = Math.random()*1600, r5Y = -600, r5Rotation = 3.14
var rX = Math.random()*1500, rY = 1000, rRotation = 0
var time = 0
var time2 = 0
var time3 = 0
var time6 = 0
var time7 = 0
var scrollY = 0
var scrollSpeed= 2
var Yspo = 830
var Yzgoraj = 0
var Xlevo = 0
var Xdesno = 1580
var time4 = 0
var bY = 300
var cloud
var shadow
var clX = Math.random()*1500, clY = -1700, clRotation = 0
var psX = Math.random()*1500, psY = -1700, psRotation = 0
var gX = 0, gY = 0, gRotation = 0
var GameOver;
var clY = 0; 
var time5 = 0;
var isGameOver = false
var HighScore = parseInt(localStorage.getItem("HighScore", HighScore));




 
function main() {
    bestScore =  
   

    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");


    plane = document.createElement("img");
    plane.src = "data/Avatar_plane.png";
    building = document.createElement("img");
    building.src = "data/building.png";
    city = document.createElement("img");
    city.src = "data/city.png";
    building2 = document.createElement("img");
    building2.src = "data/building2.png";
    house = document.createElement("img");
    house.src = "data/house.png";
    museum = document.createElement("img");
    museum.src = "data/museum.png";
    wallpaper = document.createElement("img");
    wallpaper.src = "data/wallpaper.png";
    rocket = document.createElement("img");
    rocket.src = "data/rocket.png";
    cloud = document.createElement("img");
    cloud.src = "data/cloud.png";
    bg2 = document.createElement("img");
    bg2.src = "data/bg2.png";
    shadow = document.createElement("img");
    shadow.src = "data/shadow.png";
    rocket2 = document.createElement("img");
    rocket2.src = "data/rocket2.png";
    GameOver = document.createElement("img");
    GameOver.src = "data/GameOver.png";
    rocket3 = document.createElement("img");
    rocket3.src = "data/rocket3.png";
    rocket4 = document.createElement("img");
    rocket4.src = "data/rocket4.png";
    rocket5 = document.createElement("img");
    rocket5.src = "data/rocket5.png";
   
    tick();
}

  
function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    if (!isGameOver){
        requestAnimationFrame(tick);
    }
}

function update() {

    jet.play()
    // Logiko sprogramirajte tukaj
    
    clY += 3
    if(gameover=true){
        score++

    }
    
    cY += 2
    mY += 2
    buRotation.rotation = 0;
    buY += 2
    b2Y += 2
    hY += 2
    if(buY > 1000){
        buY = -350
        buX = Math.random()*1200
    }
    if(psY > 1000){
        psY = -350
        sX = Math.random()*1200
    }

    time4++
    time6++
    bRotation += 0;

    if (keyboard["a"]) {
        bX -= 2.5;
    } else if (keyboard["d"]) {
        bX += 2.5;
    }
    if (keyboard["w"]) {
        bY -= 1;
    } else if (keyboard["s"]) {
        bY += 1;
    }
    if (keyboard["A"]) {
        bX -= 2.5;
    } else if (keyboard["D"]) {
        bX += 2.5;
    }
    if (keyboard["W"]) {
        bY -= 1;
    } else if (keyboard["S"]) {
        bY += 1;
    }

    psX = bX + 130
    psY = bY + 80



    time++
    if(time > 60 && cY > 1000){
        cRotation.rotation = 0
        cY = -750
        cX = Math.random()*1200
        time = 0

    }
    
    time2++
    time3++
    time5++
    if(time2> 100 && b2Y > 1000){
        
        b2Y = -750
        b2X = Math.random()*1500
        time2 = 0

    }
     
    if(b2Y > 1000){
        b2Y = -1000
        setTimeout(() => {  console.log("World!"); }, 5000);
        b2X = Math.random()*1500
        
    }
       
    if(hY > 1000){
        hY = -1200
        setTimeout(() => {  console.log("World!"); }, 5000);
        hX = Math.random()*1500
        
    }

    if(mY > 1000){
        mY = -1350
        
        mX = Math.random()*1500
        
    }
    
    
    if(cY > 1000){
        cY = -350
        
        cX = Math.random()*1500
        
    }
    if(clY > 1000){
        clY = -1700
        
        clX = Math.random()*1500
        
    }
    scrollY += 2

    

    if(bY > Yspo) {
        bY = Yspo
    }
    if(bY < Yzgoraj) {
        bY = Yzgoraj
    }
    if(bX > Xdesno) {
        bX = Xdesno
    }
    if(bX < Xlevo) {
        bX = Xlevo
    }
    
    if(rX < bX + 100 && rX > bX && rY < bY + 100 && rY > bY){
        Dead()

    }else{
        rY -= 5
    }
    if(r3X < bX + 100 && r3X > bX && r3Y < bY + 100 && r3Y > bY){
        Dead()

    }else{
        r3Y -= 5
    }

    if(r2X < bX + 100 && r2X > bX && r2Y < bY + 100 && r2Y > bY){
        Dead()

    }else{
        r2Y -= 5
    }
    if(r4X < bX + 100 && r4X > bX && r4Y < bY + 100 && r4Y > bY){
        Dead()

    }else{
        r4Y += 5
    }
    if(r5X < bX + 100 && r5X > bX && r5Y < bY + 100 && r5Y > bY){
        Dead()

    }else{
        r5Y += 5
    }

    if(rY < -200){
       if(time3 > Math.random()*400)
       rY = 1100
       rX = Math.random()*1800
       time3 = 0
    }
    if(r2Y < -200){
        if(time5 > Math.random()*400)
        r2Y = 1100
        r2X = Math.random()*1800
        time4 = 0
     }
     if(r3Y < -200){
        if(time5 > Math.random()*400)
        r3Y = 1100
        r3X = Math.random()*1500
        time5 = 0
    
     }
     time6++
     time7++
     if(r4Y < 1000){
        if(time6 > 635){
        r4Y = -600
        r4X = Math.random()*1500
        time6 = 0
        }
     }
     if(r5Y < 1000){
        if(time7 > 635){
        r5Y = -600
        r5X = Math.random()*1500
        time7 = 0
        }
     }

    
        
        
       

        
    
        
    }

    function Dead(){
        if(score > HighScore){
            localStorage.setItem("HighScore", score)
            HighScore = score
        }
        isGameOver = true
    }
    



   
    



        
    

    

    


function draw() {
    // Risanje sprogramirajte tukaj

    // Narisemo ozadje
    //context.fillStyle = "#00AF00";
    //context.fillRect(0,0,canvas.width,canvas.height);
    var h = canvas.height
    //context.drawImage(wallpaper, 0, 0, canvas.width, canvas.height);

    context.drawImage(bg2, 0, (scrollY % h)-h, canvas.width, canvas.height)
    context.drawImage(bg2, 0, (scrollY % h), canvas.width, canvas.height)
    context.drawImage(bg2, 0, (scrollY % h)+h, canvas.width, canvas.height)
    
    /*
    Narisemo stolpnico
    context.beginPath();
    context.fillStyle = "orange";
    context.ellipse(200, 200, 100, 100, 0, 0, 2*Math.PI);
    context.fill();
    */
    
    drawImageRotated(context, museum, mX, mY, museum.width, museum.height, mRotation);
    drawImageRotated(context, house, hX, hY, house.width, house.height, hRotation);
    drawImageRotated(context, building2, b2X, b2Y, building2.width*2, building2.height*2, b2Rotation);
    drawImageRotated(context, building, buX, buY, building.width, building.height, buRotation);
    drawImageRotated(context, city, cX, cY, city.width*1.6, city.height*1.6, cRotation);
    drawImageRotated(context, shadow, psX, psY, shadow.width/4, shadow.height/4, psRotation);
    drawImageRotated(context, cloud, clX, clY, cloud.width*4, cloud.height*4, clRotation);
    drawImageRotated(context, rocket, rX, rY, rocket.width/8, rocket.height/8, rRotation)
    drawImageRotated(context, rocket2, r2X, r2Y, rocket2.width/8, rocket2.height/8, r2Rotation)
    drawImageRotated(context, rocket3, r3X, r3Y, rocket3.width/8, rocket3.height/8, r3Rotation)
    drawImageRotated(context, rocket4, r4X, r4Y, rocket4.width/8, rocket4.height/8, r4Rotation)
    drawImageRotated(context, rocket5, r5X, r5Y, rocket5.width/8, rocket5.height/8, r5Rotation)
    drawImageRotated(context, plane, bX, bY, plane.width/2, plane.height/2, bRotation);
    

    context.font = "30px Castellar";
    context.fillStyle = "white";
    context.textAlign = "up";
    context.fillText("Score: " + score, canvas.width/85, canvas.height/22);


    if(isGameOver){
        
        jet.pause()
        drawImageRotated(context, GameOver, gX, gY, canvas.width, canvas.height, gRotation);
        context.font = "50px Castellar";
        context.fillStyle = "white";
        context.textAlign = "down";
        context.fillText("You're score is " + score, canvas.width/2.9, canvas.height/1.2);
        explosion.play()
        context.font = "50px Castellar";
        context.fillStyle = "white";
        context.textAlign = "down";
        context.fillText("Your highest score is " + HighScore, canvas.width/3.5, canvas.height/1.1);
    }
}    
    
    

   
       