// Globalne spremenljivke
var canvas, context;
var stricek;
var bX = 50, bY = 550, bRotation = 0;
var  G= 0.281;
var bYvel=0;
var Y_TLA = 550;
var scrollX=0;
var DwX = 650;
var DwY = 420;
var DbY = 600;
var DbY2 = 400;
var zadtip = "";
var mrtu = false ;
var ziv = false ;
var fadeT =0;
var drevesa = [
    {
        x: 1000,
        y: DwY,
    },
    {
        x: 1540,
        y: DwY,
    },
    {
        x:2045,
        y: DwY,
    }, {
        x:2554,
        y: DwY,
    }, 
     {
        x:3034,
        y: DwY,
    },
    {
        x:3450,
        y: DwY,
    },
    {
        x:3900,
        y: DwY,
    },
    {
        x:4240,
        y: DwY,
    },
    {
        x:4980,
        y: DwY,
    },
    {
        x:5734,
        y: DwY,
    },
    {
        x:6432,
        y: DwY,
    },
    {
        x:7786,
        y: DwY,
    },
    {
        x:8186,
        y: DwY,
    },
    {
        x:8654,
        y: DwY,
    },
    {
        x:9486,
        y: DwY,
    },   
]





var bombe = [
    {
        x: 1100,
        y: DbY2,
    },
    {
        x: 1240,
        y: DbY,
    },
    {
        x:1745,
        y: DbY,
    }, 
    {
        x:1545,
        y: DbY,
    }, 
    {
        x:1645,
        y: DbY2,
    }, 
    {
        x:1900,
        y: DbY,
    }, 
    {
        x:2116,
        y: DbY2,
    }, 
    {
        x:2200,
        y: DbY2,
    }, 
    {
        x:2354,
        y: DbY,
    },
    {
        x:2445,
        y: DbY,
    }, 
    {
        x:2545,
        y: DbY,
    }, 
    {
        x:2845,
        y: DbY,
    }, 
     {
        x:3150,
        y: DbY,
    },
    {
        x:3130,
        y: DbY2,
    },
    {
        x:3370,
        y: DbY,
    },
    {
        x:3450,
        y: DbY,
    },
    {
        x:3600,
        y: DbY2,
    },
    {
        x:3830,
        y: DbY,
    },
    {
        x:3900,
        y: DbY,
    },
    {
        x:4240,
        y: DbY,
    },
    {
        x:4430,
        y: DbY,
    },
    {
        x:4640,
        y: DbY,
    },
    {
        x:4830,
        y: DbY,
    },
    {
        x:5080,
        y: DbY2,
    },
    {
        x:5180,
        y: DbY,
    },
    {
        x:5340,
        y: DbY,
    },
    {
        x:5565,
        y: DbY,
    },
    {
        x:5804,
        y: DbY2,
    },
    {
        x:6104,
        y: DbY,
    },
    {
        x:6220,
        y: DbY,
    },
    {
        x:6432,
        y: DbY,
    },
    {
        x:7786,
        y: DbY,
    },
    {
        x:8186,
        y: DbY,
    },
    {
        x:8354,
        y: DbY,
    },
    {
        x:8654,
        y: DbY,
    },
    {
        x:8554,
        y: DbY,
    },
    {
        x:8800,
        y: DbY2,
    },
    {
        x:9000,
        y: DbY,
    }, 
    {
        x:9340,
        y: DbY,
    }, 
    {
        x:9420,
        y: DbY,
    }, 
    {
        x:9600,
        y: DbY2,
    }, 
    {
        x:6634,
        y: DbY,
    },   {
        x:6822,
        y: DbY,
    },   {
        x:7032,
        y: DbY,
    },   {
        x:7234,
        y: DbY,
    },     
    {
        x:7544,
        y: DbY,
    }, 
    {
        x:7634,
        y: DbY,
    },         
]
function main() {
    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    flag = document.createElement("img")
    flag.src = "data/flag.png";
    drevo2 = document.createElement("img")
    drevo2.src = "data/drevo2.png";
    stricek2 = document.createElement("img");
    stricek2.src = "data/stricek2.png";
    bomba= document.createElement("img");
    bomba.src = "data/bomba.png";     
    stricek = document.createElement("img");
    stricek.src = "data/stricek.png";
    ozadje3 = document.createElement("img");
    ozadje3.src = "data/ozadje3.webp";
    died =document.createElement("img");
    died.src = "data/died.jpg";
    win =document.createElement("img");
    win.src = "data/win.jpg";
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
    bRotation += 0.25;
    var canJump = false;
    if (keyboard["a"]) {
        bX -= 5;
        zadtip="a"
    } else if (keyboard["d"]) {
        bX += 5;
        zadtip = "b"
    }
    bYvel = bYvel +G;
    bY = bY + bYvel;
    if(bY> Y_TLA){
        bY=Y_TLA
        bYvel= 0;
        canJump = true;
    }
    if (bX>canvas.width +scrollX - stricek.width - 500 ){
        scrollX += 5 ;
    }else if (bX < scrollX + 500 ) {
     scrollX -= 5;
    }
   if (keyboard["s"]) {
    stricek.width/4,stricek.height/4;
    }
   if (bX> DwX - stricek.width/2 && bX< DwX + 250 && bY>DwY && bY<DwY+250){
      bX= DwX - stricek.width/2
   }
   if (bY> DwY - stricek.width/2 && bY< DwX +250 && bX>DwX && bX<DwX+250){
        bY= DwY - stricek.width/2;
        bYvel= 0;
        canJump = true
    }
    for (var i = 0; i < drevesa.length; i++){
        if (bX> drevesa[i].x - stricek.width/2 && bX< drevesa[i].x + 250 && bY>drevesa[i].y && bY<drevesa[i].y+250){
            bX= drevesa[i].x- stricek.width/2
         }
         
        
        
         if (bY> drevesa[i].y - stricek.width/2 && bY< drevesa[i].x+250 && bX>drevesa[i].x && bX<drevesa[i].x+250){
              bY= drevesa[i].y - stricek.width/2;
              bYvel= 0;
              canJump = true
          }
          
    }
    if ((keyboard["w"]||keyboard[" "]) && canJump) {
        bYvel -=12;
    }

    for (var i = 0; i < bombe.length; i++){
        if (bX > bombe[i].x - stricek.width/2 && bX < bombe[i].x + 50 && 
            bY > bombe[i].y - stricek.height/2 && bY < bombe[i].y + 50)
        {
            mrtu = true;
        }
    }

    // Dopolni
   
        if (bX > 10000 - stricek.width/2 && bX < 10000 + 250 && 
            bY > DwY - stricek.height/2 && bY < DwY + 250)
        {
            ziv = true;
        }
    




    if (mrtu) {
        fadeT += 0.02;
        if (fadeT > 1) fadeT = 1;
    }
    if (ziv) {
        fadeT += 0.02 ;
        if (fadeT > 1 ) fadeT =1
    }
}
function draw() {
    var w = 2000;
    var h = 800;
    context.drawImage(ozadje3,-(scrollX % w)-w, 0, w,h);
    context.drawImage(ozadje3,-(scrollX % w), 0 ,w,h);
    context.drawImage(ozadje3,-(scrollX % w)+w, 0, w,h);
    context.drawImage(bomba,900-scrollX,600,50,50);

    for (var i = 0; i < bombe.length; i++){
        context.drawImage(bomba,bombe[i].x-scrollX,bombe[i].y,50,50);
    }

    if (zadtip == "a"){
        context.drawImage (stricek2,bX-scrollX,bY,stricek2.width/2,stricek2.height/2)
    } else {
        context.drawImage (stricek,bX-scrollX,bY,stricek.width/2,stricek.height/2)
    }
    context.drawImage(flag,10000-scrollX,DwY,250,250);
    context.drawImage(drevo2,DwX-scrollX,DwY,250,250);
    for (var i = 0; i < drevesa.length; i++){
        context.drawImage(drevo2,drevesa[i].x-scrollX,drevesa[i].y,250,250);
    }
    if (ziv) {
        context.globalAlpha = fadeT
        context.drawImage(win,0,0,canvas.width,canvas.height);
        context.globalAlpha = 1;
    }
    if (mrtu) {
        context.globalAlpha = fadeT;
        context.drawImage(died,0,0,canvas.width,canvas.height);
        context.globalAlpha = 1;
    }
}