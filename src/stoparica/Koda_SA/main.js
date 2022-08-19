

var ButPress = false;
var intervalH, intervalA, startT, msInSec, i, c, b, a, g, lastSec, alrm, cas, d, hour, min, o, element, p;
p = 0;
var pr = 0;
var t = 0;
var x = document.getElementById("myAudio"); 
var stop1 = document.getElementById("stop1"); 
var voice = document.getElementById("voice");
var buzz = document.getElementById("buzz");


lastSec = 0;

function barva(){
    
    element = document.getElementById("Circle");
    element.classList.add("Alarm");
    var intervalB = setInterval(function(){
        p++;
        if (p % 2 == 0){
            element.classList.remove("Alarm");
        } else if (p % 2 == 1){
            element.classList.add("Alarm");
        }
        if (p == 60){
            clearInterval(intervalB);
        }
    }, 100)
   
}

function alarm(){
    alrm = document.getElementById("Date").value;
    intervalA = setInterval(function(){
        d = new Date();
        hour = d.getHours();
        min = d.getMinutes();
        sec = d.getSeconds();
        if (sec < 10){
            sec = '0' + sec;
        }
        if (hour < 10){
            hour = '0' + hour;
        }
        if (min < 10){
        cas = hour + ':0' + min + ':' + sec;
        } else if(min==10 || min > 10){
            cas = hour + ':' + min + ':' + sec;
        }
        if (cas == alrm){
            voice.play();
            cas = 0;
            alrm = -1;
            barva();
            return 0;
        }   
    }, 500);
}

function start(){
    clearInterval(intervalH); 
    lastSec=0;
    pr++;
    startT = new Date();
    intervalH = setInterval(function(){
        msInSec = new Date() - startT;
        i = msInSec % 1000;
        a = i / 10;
        b = Math.floor(a);
        c = Math.floor(msInSec / 1000);
        if (lastSec<c){
            x.play();
            lastSec= c;
        }
        if (c < 10){
            g = "0" + c;
        }
        if (c==10){
            g = c;
        }
        if (c>10){
            g=c;
        }
        if (b < 10){
            o = "0" + b;
        }
        if (b == 10){
            o = b;
        }
        if (b > 10){
            o = b;
        }

        document.getElementById("Ms").innerHTML =  o; 
        document.getElementById("Sec").innerHTML = g;

        }, 1);
        if (pr == 1){
            var element = document.getElementById("Start");
            element.classList.add("disabled");
           
        }
    
}
function stop(){
    x.pause();
    x.currentTime = 0;
    if(pr==1){
    stop1.play();
    t = 1;
    }
    document.getElementById("Start").style.visibility = 'visible';
    clearInterval(intervalH);
    pr = 0;
    var element = document.getElementById("Start");
            element.classList.remove("disabled");
}
function reset(){
    x.pause();
    x.currentTime = 0;
    clearInterval(intervalH);
    if(t==1){
    buzz.play();
    t = 0;
    }
    document.getElementById("Start").style.visibility = 'visible';
    document.getElementById("Ms").innerHTML = "00";
    document.getElementById("Sec").innerHTML = "00";
    
    pr = 0;
    var element = document.getElementById("Start");
            element.classList.remove("disabled");
}