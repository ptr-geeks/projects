


// Globalne spremenljivke


var canvas, context;

var wl;
var wq;
var wk;
var wf;
var wr;
var wh;
var bf;
var bg;
var bl;
var q2;
var bk;
var sah;
var bX = 473, bY = 51, bRotation = 0;
var sqsize = 78; 
var sely=-1; 
var selx= -1; 



var mreza = [
    ["BF","BH","BR","BK","BQ","BR","BH","BF"],
    ["BL","BL","BL","BL","BL","BL","BL","BL"],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["","","","","","","",""],
    ["WL","WL","WL","WL","WL","WL","WL","WL"],
    ["WF","WH","WR","WK","WQ","WR","WH","WF"],
]
    
function main() {
    // Zacetek programa
    // Najdemo canvas in si ga shranimo v globalno spremenljivko
   
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    sah = document.createElement("img");
    sah.src = "data/sah.jpg";

    wq = document.createElement("img");
    wq.src = "data/WQ.png";

    wk = document.createElement("img");
    wk.src = "data/WK.png";

    wf = document.createElement("img");
    wf.src = "data/WF.png";

    wr = document.createElement("img");
    wr.src = "data/WR.png";

    wh = document.createElement("img");
    wh.src = "data/WH.png";

    bk = document.createElement("img");
    bk.src = "data/BK.png";

    q2 = document.createElement("img");
    q2.src = "data/q2.png";

    bf = document.createElement("img");
    bf.src = "data/BF.png";

    bh = document.createElement("img");
    bh.src = "data/BH.png";

    br = document.createElement("img");
    br.src = "data/BR.png";

    bl = document.createElement("img");
    bl.src = "data/BL.png";

    wl = document.createElement("img");
    wl.src = "data/Wl.png";


    document.addEventListener("mousedown", click);


    tick();
}
function click(e){
    console.log("click", e.clientX, e.clientY)
    console.log("click mreza", Math.floor((e.clientX-bX)/sqsize), Math.floor((e.clientY-bY)/sqsize))

    var mx=Math.floor((e.clientX-bX)/sqsize);
    var my=Math.floor((e.clientY-bY)/sqsize);

    if (mx >= 0 && mx <= 7 && my >= 0 && my <= 7) {
        
        // Klik v sahovnici

        console.log("click polje", mreza[my][mx]);

        if (selx == -1 && sely == -1)  {
            selx = mx;
            sely = my;
        } else{
    
            var allow = false;
            var mozna = moznaPolja(mreza[sely][selx], selx, sely);
            for (var i=0;i<mozna.length;i++) {
                if (mozna[i].x == mx && mozna[i].y == my) {
                    allow = true;
                    break;
                }
            }

            if (allow) {
                prestavi(mx, my);
            }

            /*
            if (mreza[sely][selx] == "WH" || mreza[sely][selx] == "BH") {
                // konj
                if (
                    mx == selx + 2 && my == sely + 1 ||
                    mx == selx + 1 && my == sely + 2 ||
                    mx == selx - 1 && my == sely + 2 ||
                    mx == selx - 2 && my == sely + 1 ||
                    mx == selx - 2 && my == sely - 1 ||
                    mx == selx + 2 && my == sely - 1 ||
                    mx == selx + 1 && my == sely - 2 ||
                    mx == selx - 1 && my == sely - 2
    
                ) {
    
                    prestavi(mx, my)
                }
    
            }
    
            else if (mreza[sely][selx] == "WK" || mreza[sely][selx] == "BK") {
                // kralj
                console.log("move king", mreza[sely][selx], sely,selx);
                if (
                    mx == selx + 1 && my == sely + 1 ||
                    mx == selx - 1 && my == sely - 1 ||
                    mx == selx - 1 && my == sely + 1 ||
                    mx == selx + 1 && my == sely - 1 ||
                    mx == selx + 1 && my == sely + 0 ||
                    mx == selx - 1 && my == sely + 0 ||
                    mx == selx + 0 && my == sely - 1 ||
                    mx == selx + 0 && my == sely + 1
                ) {
                    console.log("move king YES");
                    prestavi(mx, my)
    
                }
            }
    
    
            else if (mreza[sely][selx] == "BL") {
                // kmet
                if (
                    sely == 1 && my == 3 || my == sely + 1
                ) {
                    prestavi(mx, my)
                }
            }
    
            else if (mreza[sely][selx] == "WL") {
                // kmet
                if (
                    sely == 6 && my == 4 || my == sely - 1
                ) {
                    prestavi(mx, my)
                }
            }
    
            
            else if (mreza[sely][selx] == "WF" || mreza[sely][selx] == "BF") {
                // trdnava
                var allow = false;
                var mozna = moznaPolja(mreza[sely][selx], selx, sely);
                for (var i=0;i<mozna.length;i++) if (mozna[i].x == mx && mozna[i].y == my) allow = true;
                if (allow) prestavi(mx, my)
            }
            
            else if (mreza[sely][selx] == "WQ" || mreza[sely][selx] == "BQ") {
                // kraljica
                if( 
                    mx -selx -my+ sely ==0 ||
                    mx -selx -my- sely ==0 ||
                    mx == selx || my == sely
    
                )   
                    
    
                
    
                    prestavi(mx, my)
    
            }
             else if (mreza[sely][selx] == "WR" || mreza[sely][selx] == "BR") {
                // tekač
                
                if (
                    mx -selx -my+ sely ==0 ||
                    mx -selx -my- sely ==0 
                )
    
                    prestavi(mx, my)
            }
            */
            selx = -1;
            sely = -1;
        }
    } else {
        // Klik izven sahovnice
    }

}

function prestavi(x,y){
    //var trenutni = mreza[y][x];
    mreza[y][x] = mreza[sely][selx];
    mreza[sely][selx] = "";
    //mreza[sely][selx] =trenutni;

}

function moznaPolja(figura, x , y){
    var result = [];
    var barva = figura[0];
    var nasprotnaBarva = barva == "W" ? "B" : "W"; 
    
    //trdnava
    if (figura == "WF" || figura == "BF") {

        for(var i = 1; i< 8 ; i++){
            if (x+i <= 7 && (mreza[y][x+i] == "" || mreza[y][x+i][0] == nasprotnaBarva)) {
                result.push({x:x+i,y:y});
                if (mreza[y][x+i][0] == nasprotnaBarva) break;
            } else break;
        }
        for(var i = 1; i< 8 ; i++){
            if (x-i >= 0 && (mreza[y][x-i] == "" || mreza[y][x-i][0] == nasprotnaBarva)) {
                result.push({x:x-i,y:y});
                if (mreza[y][x-i][0] == nasprotnaBarva) break;
            } else break;
        }
        for(var i = 1; i< 8 ; i++){
            if (y+i <= 7 && (mreza[y+i][x] == "" || mreza[y+i][x][0] == nasprotnaBarva)) {
                result.push({x:x,y:y+i});
                if (mreza[y+i][x][0] == nasprotnaBarva) break;
            } else break;
        }
        for(var i = 1; i< 8 ; i++){
            if (y-i >= 0 && (mreza[y-i][x] == "" || mreza[y-i][x][0] == nasprotnaBarva)) {
                result.push({x:x,y:y-i});
                if (mreza[y-i][x][0] == nasprotnaBarva) break;
            } else break;
        }

        //kraljica
    } else if (figura == "WQ" || figura == "BQ") {

        for(var i = 1; i< 8 ; i++){
            if (x+i <= 7 && (mreza[y][x+i] == "" || mreza[y][x+i][0] == nasprotnaBarva)) {
                result.push({x:x+i,y:y});
                if (mreza[y][x+i][0] == nasprotnaBarva) break;
            } else break;
        }
        for(var i = 1; i< 8 ; i++){
            if (x-i >= 0 && (mreza[y][x-i] == "" || mreza[y][x-i][0] == nasprotnaBarva)) {
                result.push({x:x-i,y:y});
                if (mreza[y][x-i][0] == nasprotnaBarva) break;
            } else break;
        }
        for(var i = 1; i< 8 ; i++){
            if (y+i <= 7 && (mreza[y+i][x] == "" || mreza[y+i][x][0] == nasprotnaBarva)) {
                result.push({x:x,y:y+i});
                if (mreza[y+i][x][0] == nasprotnaBarva) break;
            } else break;
        }
        for(var i = 1; i< 8 ; i++){
            if (y-i >= 0 && (mreza[y-i][x] == "" || mreza[y-i][x][0] == nasprotnaBarva)) {
                result.push({x:x,y:y-i});
                if (mreza[y-i][x][0] == nasprotnaBarva) break;
            } else break;
        }
        for(var i = 1; i< 8 ; i++){
            if (x+i <= 7 && y+i <= 7 &&(mreza[y+i][x+i] == "" || mreza[y+i][x+i][0] == nasprotnaBarva)) {
                result.push({x:x+i,y:y+i});
                if (mreza[y+i][x+i][0] == nasprotnaBarva) break;
            } else break;

        }
        for(var i = 1; i< 8 ; i++){
            if (x-i >= 0 && y-i >= 0 &&(mreza[y-i][x-i] == "" || mreza[y-i][x-i][0] == nasprotnaBarva)) {
                result.push({x:x-i,y:y-i});
                if (mreza[y-i][x-i][0] == nasprotnaBarva) break;
            } else break;

        }
        for(var i = 1; i< 8 ; i++){
            if (x+i <= 7 && y-i >= 0 &&(mreza[y-i][x+i] == "" || mreza[y-i][x+i][0] == nasprotnaBarva)) {
                result.push({x:x+i,y:y-i});
                if (mreza[y-i][x+i][0] == nasprotnaBarva) break;
            } else break;

        }
        for(var i = 1; i< 8 ; i++){
            if (x-i>= 0 && y+i <= 7 &&(mreza[y+i][x-i] == "" || mreza[y+i][x-i][0] == nasprotnaBarva)) {
                result.push({x:x-i,y:y+i});
                if (mreza[y+i][x-i][0] == nasprotnaBarva) break;
            } else break;

        }
       
        //tekač
    } else if (figura == "WR" || figura == "BR") {

        for(var i = 1; i< 8 ; i++){
            if (x+i <= 7 && y+i <= 7 &&(mreza[y+i][x+i] == "" || mreza[y+i][x+i][0] == nasprotnaBarva)) {
                result.push({x:x+i,y:y+i});
                if (mreza[y+i][x+i][0] == nasprotnaBarva) break;
            } else break;

        }
        for(var i = 1; i< 8 ; i++){
            if (x-i >= 0 && y-i >= 0 &&(mreza[y-i][x-i] == "" || mreza[y-i][x-i][0] == nasprotnaBarva)) {
                result.push({x:x-i,y:y-i});
                if (mreza[y-i][x-i][0] == nasprotnaBarva) break;
            } else break;

        }
        for(var i = 1; i< 8 ; i++){
            if (x+i <= 7 && y-i >= 0 &&(mreza[y-i][x+i] == "" || mreza[y-i][x+i][0] == nasprotnaBarva)) {
                result.push({x:x+i,y:y-i});
                if (mreza[y-i][x+i][0] == nasprotnaBarva) break;
            } else break;

        }
        for(var i = 1; i< 8 ; i++){
            if (x-i>= 0 && y+i <= 7 &&(mreza[y+i][x-i] == "" || mreza[y+i][x-i][0] == nasprotnaBarva)) {
                result.push({x:x-i,y:y+i});
                if (mreza[y+i][x-i][0] == nasprotnaBarva) break;
            } else break;

        }
        
    }


   // mx == selx + 2 && my == sely + 1 ||1
    //                mx == selx + 1 && my == sely + 2 ||1
    //                mx == selx - 1 && my == sely + 2 ||1
    //                mx == selx - 2 && my == sely + 1 ||1
    //               mx == selx - 2 && my == sely - 1 ||1
    //                mx == selx + 2 && my == sely - 1 ||1
    //                mx == selx + 1 && my == sely - 2 ||1
     //               mx == selx - 1 && my == sely - 2/1

        //konj
    else if (figura == "WH" || figura == "BH") {

        if (y+1 <= 7 && x+2 <= 7 && (mreza[y+1][x+2] == "" || mreza[y+1][x+2][0] == nasprotnaBarva)) result.push({x:x+2,y:y+1});
        if (y+2 <= 7 && x+1 <= 7 && (mreza[y+2][x+1] == "" || mreza[y+2][x+1][0] == nasprotnaBarva)) result.push({x:x+1,y:y+2});
        if (y-2 >= 0 && x+1 <= 7 && (mreza[y-2][x+1] == "" || mreza[y-2][x+1][0] == nasprotnaBarva)) result.push({x:x+1,y:y-2});
        if (y+2 <= 7 && x-1 >= 0 && (mreza[y+2][x-1] == "" || mreza[y+2][x-1][0] == nasprotnaBarva)) result.push({x:x-1,y:y+2});
        if (y-2 >= 0 && x-1 >= 0 && (mreza[y-2][x-1] == "" || mreza[y-2][x-1][0] == nasprotnaBarva)) result.push({x:x-1,y:y-2});
        if (y-1 >= 0 && x-2 >= 0 && (mreza[y-1][x-2] == "" || mreza[y-1][x-2][0] == nasprotnaBarva)) result.push({x:x-2,y:y-1});
        if (y+1 <= 7 && x-2 >= 0 && (mreza[y+1][x-2] == "" || mreza[y+1][x-2][0] == nasprotnaBarva)) result.push({x:x-2,y:y+1});
        if (y-1 >= 0 && x+2 <= 7 && (mreza[y-1][x+2] == "" || mreza[y-1][x+2][0] == nasprotnaBarva)) result.push({x:x+2,y:y-1});

            
    }
    //kralj
    else if (figura == "WK" || figura == "BK") {

        if (y+1 <= 7 && x+1 <= 7 && (mreza[y+1][x+1] == "" || mreza[y+1][x+1][0] == nasprotnaBarva)) result.push({x:x+1,y:y+1});
        if (y-1 >= 0 && x-1 >= 0 && (mreza[y-1][x-1] == "" || mreza[y-1][x-1][0] == nasprotnaBarva)) result.push({x:x-1,y:y-1});
        if (y+1 <= 7 && x-1 >= 0 && (mreza[y+1][x-1] == "" || mreza[y+1][x-1][0] == nasprotnaBarva)) result.push({x:x-1,y:y+1});
        if (y-1 >= 0 && x+1 <= 7 && (mreza[y-1][x+1] == "" || mreza[y-1][x+1][0] == nasprotnaBarva)) result.push({x:x+1,y:y-1});
        if (y+1 <= 7 && (mreza[y+1][x+0] == "" || mreza[y+1][x+0][0] == nasprotnaBarva)) result.push({x:x,y:y+1});
        if (y-1 >= 0 && (mreza[y-1][x+0] == "" || mreza[y-1][x+0][0] == nasprotnaBarva)) result.push({x:x,y:y-1});
        if (x-1 >= 0 && (mreza[y+0][x-1] == "" || mreza[y+0][x-1][0] == nasprotnaBarva)) result.push({x:x-1,y:y});
        if (x+1 <= 7 && (mreza[y+0][x+1] == "" || mreza[y+0][x+1][0] == nasprotnaBarva)) result.push({x:x+1,y:y});




            
    }

    else if ( figura == "BL") {
        if (y+1 <= 7 && x+1 <= 7 && (mreza[y+1][x+1][0] == nasprotnaBarva)) result.push({x:x+1,y:y+1});
        if (y+1 <= 7 && x-1 >= 0 && (mreza[y+1][x-1][0] == nasprotnaBarva)) result.push({x:x-1,y:y+1});    
        if (y+1 <= 7 && (mreza[y+1][x+0] == "")) result.push({x:x,y:y+1});
        if (y == 1 && mreza[y+1][x+0] == "" && mreza[y+2][x+0] == "") result.push({x:x,y:y+2});

    }
    else if ( figura == "WL") {
        if (y-1 >= 0 && x-1 >= 0 && (mreza[y-1][x-1][0] == nasprotnaBarva)) result.push({x:x-1,y:y-1});
        if (y-1 >= 0 && x+1 <= 7 && (mreza[y-1][x+1][0] == nasprotnaBarva)) result.push({x:x+1,y:y-1});    
        if (y-1 >= 0 && (mreza[y-1][x+0] == "")) result.push({x:x,y:y-1});
        if (y == 6 && mreza[y-1][x+0] == "" && mreza[y-2][x+0] == "") result.push({x:x,y:y-2});
   
   



    }
     return result;
}



    


  
function tick() {
    // Funkcija tick se poklice veckrat na sekundo
    update(); // najprej izracunajmo novo stanje igre
    draw(); // potem pa stanje izrisimo na canvas
    requestAnimationFrame(tick);
}

function update() {
    // Logiko sprogramirajte tukaj
    
    //bRotation += 0.25;  

    if (keyboard["a"]) {
        bX -= 5;
    } else if (keyboard["d"]) {
        bX += 5;
    }


    if (keyboard["w"]) {
        bY -= 5;
        
    } else if (keyboard["s"]) {
        bY += 5;
    }


    
 }


function draw() {
    // Risanje sprogramirajte tukaj

    // Narisemo ozadje
    context.fillStyle = "#CCEEFF";
    context.fillRect(0,0,canvas.width,canvas.height);


    // Sahovnica
    drawImageRotated(context, sah, bX, bY, sah.width*0.7, sah.height*0.7, 0);

    // Figure
    //drawImageRotated(context, q2, bX, bY, q2.width*0.12, q2.height*0.1, 0);

    
    var offX = 10;
    
    
    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "WQ"){
                drawImageRotated(context, wq, offX+bX+j*sqsize, bY+i *sqsize, wq.width*0.1, wq.height*0.08, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "WK"){
                drawImageRotated(context, wk , offX+bX+j*sqsize, bY+i *sqsize, wk.width*0.12, wk.height*0.08, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "WF"){
                drawImageRotated(context, wf , offX+bX+j*sqsize, bY+i *sqsize, wf.width*0.12, wf.height*0.08, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "WR"){
                drawImageRotated(context, wr , offX+bX+j*sqsize, bY+i *sqsize, wr.width*0.14, wr.height*0.10, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "WH"){
                drawImageRotated(context, wh , offX+bX+j*sqsize, bY+i *sqsize, wh.width*0.10, wh.height*0.08, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "BQ"){
                drawImageRotated(context, q2, offX+bX+j*sqsize, bY+i *sqsize, q2.width*0.17, q2.height*0.13, 0);
            }
            
        }
    }


    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "BK"){
                drawImageRotated(context, bk, offX+bX+j*sqsize, bY+i *sqsize, bk.width*0.17, bk.height*0.18, 0);
            }
            
        }
    }
    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "BH"){
                drawImageRotated(context, bh , offX+bX+j*sqsize, bY+i *sqsize, bh.width*0.14, bh.height*0.10, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "BR"){
                drawImageRotated(context, br , offX+bX+j*sqsize, bY+i *sqsize, br.width*0.14, br.height*0.10, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "BF"){
                drawImageRotated(context, bf , offX+bX+j*sqsize, bY+i *sqsize, bf.width*0.14, bf.height*0.10, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "BL"){
                drawImageRotated(context, bl , offX+bX+j*sqsize, bY+i *sqsize, bl.width*0.13, bl.height*0.10, 0);
            }
            
        }
    }

    for(var i=0; i< mreza.length; i++) 
    {
        for(var j=0; j< mreza[i].length; j++) 
        {
            if( mreza[i][j] == "WL"){
                drawImageRotated(context, wl , offX+bX+j*sqsize, bY+i *sqsize, wl.width*0.12, wl.height*0.10, 0);
            }
            
        }
    }
    

    if (selx != -1 && sely != -1){context.lineWidth = 3;
        context.strokeStyle = "red";
        context.strokeRect(bX + selx * sqsize, bY + sely*sqsize, sqsize , sqsize);
        
        var mozna = moznaPolja(mreza[sely][selx], selx, sely);
        for (var i = 0; i < mozna.length; i++) {
            context.fillStyle = "#7BCDFF88";
            context.fillRect(bX + mozna[i].x * sqsize, bY + mozna[i].y*sqsize, sqsize , sqsize);        
        }
    }



}

