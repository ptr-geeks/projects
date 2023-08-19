// Globalne spremenljivke
var canvas, context;
var clovek;
var cX = 640,cY = 100, cR = -0,cX2, cY2, cR2 = Math.PI;
var metek;
var mX = 0, mY = 0, mR = 0, stm = 20, sts = 6, maxsts = 6;
var strel = false
var strelR=cR, strelX, strelY;
var lastMousePressed = false;
var colW = false, colS = false, colA = false , colD = false;
var smrt = false
var preproga;
var preprogaX = 250, preprogaY = 250;
var mSpeed = 25
var hSpeed = 5
var collision;
var reload = false, reloadTime= 0;

var bot1;
var botTime = 0
var bot1X = 600, bot1Y = 300, bot1R = 0, bot1smrt = false,bot1m, bot1mX, bot1mY, bot1strel, bot1strelR;
var bot2;
var bot2Time = 0
var bot2X = -1000, bot2Y = -1000, bot2R = 0, bot2smrt = true,bot2m, bot2mX, bot2mY, bot2strel, bot2strelR;

var dvigalo;
var dvigX = 660, dvigY = 50, dvigR = 0;
var tla;
var zid, zid2, zid3, zid4;
var stene = [zid, zidX=100, zidY=200, 0,zid2, zidX=700, zidY=0, 0,zid3, zidX=900, zidY=0, 0, zid4, zidX = -1000, zidY = -1000, 0]
var stage = 1


//var bot1metki = [x1, y1, r1, strel1,]



function main() {   
    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    document.getElementById("menu").style.display = "none"
    document.getElementById("menu2").style.display = "none"

    clovek = document.createElement("img");
    clovek.src = "data/gunsoldier.png";
    metek = document.createElement("img");
    metek.src = "data/metek.png";

    stene[0] = document.createElement("img")
    stene[0].src = "data/zid2.png"
    stene[0+4*1] = document.createElement("img")
    stene[0+4*1].src = "data/zid3.png"
    stene[0+4*2] = document.createElement("img")
    stene[0+4*2].src = "data/zid3.png"
    stene[0+4*3] = document.createElement("img")
    stene[0+4*3].src = "data/zid2.png"
    
    bot1 = document.createElement("img")
    bot1.src = "data/simplesoldier1.png"
    bot1m = document.createElement("img")
    bot1m.src = "data/metek.png"
    bot2 = document.createElement("img")
    bot2.src = "data/simplesoldier1.png"
    bot2m = document.createElement("img")
    bot2m.src = "data/metek.png"

    dvigalo = document.createElement("img")
    dvigalo.src = "data/elevator.png"
    preproga = document.createElement("img")
    preproga.src = "data/preprogaR.png"
    tla = document.createElement("img")
    tla.src = "data/parket.png"

    tick();
}

function klikPonovno() {
    location.reload();
}
  
function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    requestAnimationFrame(tick);
}
function colliding(x1,y1,width1,height1,x2,y2,width2,height2){
    if(x1 > x2 && x1 < x2 + width2 && y1 > y2 && y1 < y2 + height2){
        collision = true
    }else if(x1 + width1 > x2 && x1 + width1 < x2 + width2 && y1 > y2 && y1 < y2 + height2){
        collision = true
    }else if(x1 > x2 && x1 < x2 + width2 && y1 + height1 > y2 && y1 + height1 < y2 + height2){
        collision = true
    }else if(x1 + width1 > x2 && x1 + width1 < x2 + width2 && y1 + height1 > y2 && y1 + height1 < y2 + height2){
        collision = true
    }else if(x2 > x1 && x2 < x1 + width1 && y2 > y1 && y2 < y1 + height1){
        collision = true
    }else if(x2 + width2 > x1 && x2 + width2 < x1 + width1 && y2 > y1 && y2 < y1 + height1){
        collision = true
    }else if(x2 > x1 && x2 < x1 + width1 && y2 + height2 > y1 && y2 + height2 < y1 + height1){
        collision = true
    }else if(x2 + width2 > x1 && x2 + width2 < x1 && y2 + height2 > y1 && y2 + height2 < y1 + height1){
        collision = true
    }
    else{
        collision = false
        //console.log(collision)
    }   
}

function update() {
    // Logiko sprogramirajte tukaj
    

    // x in y roke/pištole
    if(cR < Math.PI/2 && cR > -Math.PI){
        cR += Math.PI*0.15
    }else if(cR > Math.PI/2*1 && cR < Math.PI){
        cR += -Math.PI*1.85
    }
    cY2 = cY
    cX2 = cX
    cY2 += Math.sin((cR+Math.PI))*-49
    cX2 += Math.cos((cR+Math.PI))*-49
    
    // obrne se proti miški
    if(smrt == false){
        cR = Math.atan2(mouse.y - cY - clovek.height/128, mouse.x - cX - clovek.width/128);
        cR2 = Math.atan2(mouse.y - cY2 - clovek.height/128, mouse.x - cX2 - clovek.width/128);
    }
    
    //strel
    if(strel && smrt == false){
        mY += Math.sin((strelR+Math.PI))*-mSpeed
        mX += Math.cos((strelR+Math.PI))*-mSpeed
    }
    if (mouse.pressed && !lastMousePressed) {
        // Ravnokar sem kliknil        
        if(smrt == false && sts > 0 && reload == false){
            sts += -1
            mX = cX2
            mY = cY2
            mR = Math.atan2(mouse.y - mY - metek.height/64, mouse.x - mX - metek.width/64);
            strelR = cR2-0.125+Math.random()/4
            strel = true
        }
    }
    if(keyboard["r"] && sts < maxsts && stm > 0 && smrt == false){
        reload = true
        reloadTime = 0
        console.log("reload1")
    }if(reload){
        reloadTime++
    }
    if(reload == true && reloadTime > 20 && stm > 6){
        stm += -(maxsts-sts)
        sts = maxsts
        console.log("reload2")
        reload = false
    }else if(reload == true && reloadTime > 20 && stm < 7){
        sts = stm
        stm = 0
        console.log("reload2")
        reload = false
    }
    // smrt
    if(smrt && keyboard[" "]){
        location.reload()
    }
    colliding(cX-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, bot1mX, bot1mY,bot1m.width,bot1m.height/2)
    if(collision && bot1strel == true){
        smrt = true
    }
    colliding(cX-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, bot2mX, bot2mY,bot2m.width,bot2m.height/2)
    if(collision && bot1strel == true){
        smrt = true
    }

    //premikanje
    
    if(smrt == false){
        if (keyboard["A"] && cX-clovek.width/4 > 0 || keyboard["a"] && cX-clovek.width/4 > 0) {
            colliding(cX-5-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, stene[1], stene[2],stene[0].width,stene[0].height/2)
            if(collision){
            }else{
                colliding(cX-5-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*1], stene[2+4*1],stene[0+4*1].width/2,stene[0+4*1].height)
                if(collision == false){
                    colliding(cX-5-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*2], stene[2+4*2],stene[0+4*2].width/2,stene[0+4*2].height*1.5)    
                    if(collision == false){
                        colliding(cX-5-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*3], stene[2+4*3],stene[0+4*3].width,stene[0+4*3].height/2)
                        if(collision == false){    
                            cX -= hSpeed;
                            colA = false
                        }
                    } 
                }            
            }
            
        }if (keyboard["d"] && cX + clovek.width/4 < canvas.width || keyboard["D"] && cX + clovek.width/4 < canvas.width) {
            colliding(cX+5-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, stene[1], stene[2],stene[0].width,stene[0].height/2)
            if(collision){               
            }else{
                colliding(cX+5-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*1], stene[2+4*1],stene[0+4*1].width/2,stene[0+4*1].height)
                if(collision == false){
                    colliding(cX+5-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*2], stene[2+4*2],stene[0+4*2].width/2,stene[0+4*2].height*1.5)
                    if(collision == false){
                        colliding(cX+5-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*3], stene[2+4*3],stene[0+4*3].width,stene[0+4*3].height/2)
                        if(collision == false){
                            cX += hSpeed;
                            colD =false
                        }
                    }
                }
            }
            
        }
        if (keyboard["s"]&& cY + clovek.height/4 < canvas.height || keyboard["S"]&& cY + clovek.height/4 < canvas.height){
            colliding(cX-clovek.width/4,cY+5-clovek.height/4,clovek.width/2,clovek.height/2, stene[1], stene[2],stene[0].width,stene[0].height/2)
            if(collision){
            }else{
                colliding(cX-clovek.width/4,cY+5-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*1], stene[2+4*1],stene[0+4*1].width/2,stene[0+4*1].height)
                if(collision == false){
                    colliding(cX-clovek.width/4,cY+5-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*2], stene[2+4*2],stene[0+4*2].width/2,stene[0+4*2].height*1.5)    
                    if(collision == false){
                        colliding(cX-clovek.width/4,cY+5-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*3], stene[2+4*3],stene[0+4*3].width,stene[0+4*3].height/2)
                        if(collision == false){
                            cY += hSpeed;
                            colS =false
                        }
                    }
                }
            }
            
        }if (keyboard["w"]&& cY - clovek.height/4 > 0 || keyboard["W"]&& cY - clovek.height/4 > 0){
            colliding(cX-clovek.width/4,cY-5-clovek.height/4,clovek.width/2,clovek.height/2, stene[1], stene[2],stene[0].width,stene[0].height/2)
            if(collision){
            }else{
                colliding(cX-clovek.width/4,cY-5-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*1], stene[2+4*1],stene[0+4*1].width/2,stene[0+4*1].height)
                if(collision == false){
                    colliding(cX-clovek.width/4,cY-5-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*2], stene[2+4*2],stene[0+4*2].width/2,stene[0+4*2].height*1.5)
                    if(collision == false){
                        colliding(cX-clovek.width/4,cY-5-clovek.height/4,clovek.width/2,clovek.height/2, stene[1+4*3], stene[2+4*3],stene[0+4*3].width,stene[0+4*3].height/2)
                        if(collision == false){
                            cY -= hSpeed;
                            colW =false
                        }
                    }
            }
            }
        }
    }
    
    //dvigalo
    colliding(cX-clovek.width/4,cY-clovek.height/4,clovek.width/2,clovek.height/2, dvigX+dvigalo.width/2,dvigY,dvigalo.width/2,dvigalo.height)
    if(collision){
        stage++
        if(stage == 1){
            console.log("dvigalo "+ stage)
            cX = 640,cY = 100, cR = Math.PI/2
            bot1smrt = false
            bot1X = 600
            bot1.src = "data/simplesoldier1.png"
        }else if(stage == 2){
            stene[1+4*3] = -80
            stene[2+4*3] = 500
            cX = 640,cY = 100, cR = Math.PI/2
            bot1smrt = false
            bot1X = 600,bot1Y = 300
            bot1.src = "data/simplesoldier1.png"
            bot2X =100,bot2Y = 600,bot2smrt = false;
            bot2.src = "data/simplesoldier1.png"
            preprogaY = 200;
            console.log("dvigalo "+ stage)
        }else{
            cX = 640,cY = 100, cR = Math.PI/2
            bot1smrt = false, bot1X = 600
            bot1.src = "data/simplesoldier1.png"
            bot2X =100,bot2Y = 600,bot2smrt = false;
            bot2.src = "data/simplesoldier1.png"
        }

    }
    
    // zid
    colliding(stene[1+4*1],stene[2+4*1],stene[0+4*1].width/2,stene[0+4*1].height,mX,mY,metek.width/2,metek.height/2)
    if(mX > stene[1] && mX < stene[1] +stene[0].width && mY > stene[2] && mY < stene[2] + stene[0].height/2 ||collision){
        strel = false
    }
    colliding(stene[1+4*2],stene[2+4*2],stene[0+4*2].width/2,stene[0+4*2].height*2,mX,mY,metek.width/2,metek.height/2)
    if(collision){
        strel = false
    }
    colliding(stene[1+4*3],stene[2+4*3],stene[0+4*3].width,stene[0+4*3].height/2,mX,mY,metek.width/2,metek.height/2)
    if(collision){
        strel = false
    }
    colliding(stene[1+4*1],stene[2+4*1],stene[0+4*1].width/2,stene[0+4*1].height,bot1mX,bot1mY,bot1m.width/1.5,bot1m.height)
    if(bot1mX > stene[1] && bot1mX < stene[1] + stene[0].width && bot1mY > stene[2] && bot1mY < stene[2] + stene[0].height/2 || collision == true){
        bot1strel = false
    }
    colliding(stene[1+4*2],stene[2+4*2],stene[0+4*2].width/2,stene[0+4*2].height*2,bot1mX,bot1mY,bot1m.width/1.5,bot1m.height)
    if(collision){
        bot1strel = false
    }
    colliding(stene[1+4*3],stene[2+4*3],stene[0+4*3].width,stene[0+4*3].height/2,bot1mX,bot1mY,bot1m.width/1.5,bot1m.height)
    if(collision){
        bot1strel = false
    }
    colliding(stene[1+4*1],stene[2+4*1],stene[0+4*1].width/2,stene[0+4*1].height,bot2mX,bot2mY,bot2m.width/1.5,bot2m.height)
    if(bot2mX > stene[1] && bot2mX < stene[1] + stene[0].width && bot2mY > stene[2] && bot2mY < stene[2] + stene[0].height/2 || collision == true){
        bot2strel = false
    }
    colliding(stene[1+4*2],stene[2+4*2],stene[0+4*2].width/2,stene[0+4*2].height*2,bot2mX,bot2mY,bot2m.width/1.5,bot2m.height)
    if(collision){
        bot2strel = false
    }
    colliding(stene[1+4*3],stene[2+4*3],stene[0+4*3].width,stene[0+4*3].height/2,bot2mX,bot2mY,bot2m.width,bot2m.height)
    if(collision){
        bot2strel = false
    }
    
    // bot 1
    botTime ++
    colliding(mX, mY, metek.width, metek.height, bot1X-bot1.width/4, bot1Y-bot1.height/4, bot1.width/2, bot1.height/2)
    if(collision){
        bot1smrt = true
        bot1.src = "data/explosion.png"
        botTime = 0
    }
    if(bot1smrt && botTime > 10){
        bot1X = canvas.width*2
    }
    if(bot1smrt == false){
        bot1R = Math.atan2(cY - bot1Y - bot1.height/32, cX - bot1X - bot1.width/32)+Math.PI/2;
        if(botTime % 30 == 0){
            bot1strelR = bot1R-Math.PI/2
            bot1mY = bot1Y
            bot1mX = bot1X
            bot1strel = true       

        }
    }
    if(bot1strel){
        bot1mY += Math.sin((bot1strelR+Math.PI))*-mSpeed
        bot1mX += Math.cos((bot1strelR+Math.PI))*-mSpeed
    }
    // bot 2
    bot2Time ++
    colliding(mX, mY, metek.width, metek.height, bot2X-bot2.width/4, bot2Y-bot2.height/4, bot2.width/2, bot2.height/2)
    if(collision){
        bot2smrt = true
        bot2.src = "data/explosion.png"
        bot2Time = 0
    }
    if(bot2smrt && bot2Time > 10){
        bot2X = canvas.width*2
    }
    if(bot2smrt == false){
        bot2R = Math.atan2(cY - bot2Y - bot2.height/32, cX - bot2X - bot2.width/32)+Math.PI/2;
        if(bot2Time % 30 == 0){
            bot2strelR = bot2R-Math.PI/2
            bot2mY = bot2Y
            bot2mX = bot2X
            bot2strel = true       

        }
    }
    if(bot2strel){
        bot2mY += Math.sin((bot2strelR+Math.PI))*-mSpeed
        bot2mX += Math.cos((bot2strelR+Math.PI))*-mSpeed
    }
    
    
    
    if (!mouse.pressed && lastMousePressed) {
        // Ravnokar sem spustil
    }  
    
    
    lastMousePressed = mouse.pressed;
}


function draw() {
    // Risanje sprogramirajte tukaj

    // Narisemo ozadje
    context.fillStyle = "saddlebrown";
    context.fillRect(0,0,canvas.width,canvas.height);

    //razni krogi pod igralci
    
    
    drawImageRotated(context, tla, 0, 0, canvas.width,canvas.height,0)

    // igralci
    drawImageRotated(context, stene[0], stene[1], stene[2], stene[0].width, stene[0].height/2, stene[3]);
    drawImageRotated(context, stene[0+4*1], stene[1+4*1], stene[2+4*1], stene[0+4*1].width/2, stene[0+4*1].height, stene[3+4*1]);
    drawImageRotated(context, stene[0+4*2], stene[1+4*2], stene[2+4*2], stene[0+4*2].width/2, stene[0+4*2].height*1.5, stene[3+4*2]);
    drawImageRotated(context, stene[0+4*3], stene[1+4*3], stene[2+4*3], stene[0+4*3].width, stene[0+4*3].height/2, stene[3+4*3]);

    drawImageRotated(context, preproga, preprogaX, preprogaY, preproga.width*2, preproga.height*2, 0);
    drawImageRotated(context, dvigalo, dvigX, dvigY, dvigalo.width, dvigalo.height, dvigR)

    drawImageRotated(context, metek, mX-metek.width/2, mY- metek.height/2, metek.width/2, metek.height/2, mR);
    drawImageRotated(context, bot1m, bot1mX, bot1mY, bot1m.width/1.5, bot1m.height/1.5, bot1strelR)
    drawImageRotated(context, bot2m, bot2mX, bot2mY, bot2m.width/1.5, bot2m.height/1.5, bot2strelR)

    drawImageRotated(context, bot1, bot1X-bot1.width/2, bot1Y-bot1.height/2, bot1.width, bot1.height, bot1R)
    drawImageRotated(context, bot2, bot2X-bot2.width/2, bot2Y-bot2.height/2, bot2.width, bot2.height, bot2R)
    drawImageRotated(context, clovek, cX - clovek.width/4, cY - clovek.height/4, clovek.width/2, clovek.height/2, cR);
    //smrt
    if(smrt){
        context.fillStyle = "midnightblue";
        context.fillRect(0,0,canvas.width,canvas.height);
        context.fillStyle = "FloralWhite";
        context.beginPath();
        context.font = "60px fantasy";
        context.fillText("You died", canvas.width/2-200, canvas.height/2)
        context.font = "30px serif";
        context.fillText("Nadstropje: "+ stage,canvas.width/2-190,canvas.height/2+50)
        context.font = "30px serif";
        context.fillText("Press space to restart", canvas.width/2-250, canvas.height-50)

    }
    
    //besedilo
    if(smrt == false){
        context.fillStyle = "FloralWhite";
        context.beginPath();
        context.font = "20px serif";
        context.fillText("Metki: "+ sts + "/" + stm,50,40)
        context.fillText("Nadstropje: "+ stage,canvas.width/2,40)
        context.font = "15px serif";
        if(reload){
            context.fillText("Reloading", cX-40, cY-60)
        }
    }

}