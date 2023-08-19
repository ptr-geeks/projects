<script lang="ts">
    let nacin = ""; // nacin pove, kaj se dogaja, lahko je zgodbica, default (""), ...

    let besedilo = "";
    let st = ""; // stavek
    let stArray; // stavek Array z vsemi črkami
    let St = ""; // stavek z prvo črko kot veliko začetnico
    let stavek = "";
    let štSt; // število stvakov v besedilu
    let štBvSt; // število besed v stavku
    let bVst = []; // besede v stavku
    let glagol;
    let jeDeljivGlVst; // je deljiv glagol v stavku?
    let jeVečGlVst = false; // je več glagolov v stavku?
    let DglVst; // deljiv glagol v stavku 
    let DglVstText; // deljiv glagol v stavku text
    let glHelp; // glagol za pomoč
    let glHelp2; // glagol za pomoč 2
    let DglVstHelp; // deljiv glagol za pomoč 
    let DglVst02; // drugi del deljivega glagola v stavku
    let oVst; // oseba v stavku
    let štO; // število oseb (za pri sie - množina)
    let sieHelp; // pomoč pri množini (sie)
    let pomožnoBesedilo;
    let veznik; // veznik v stavku
    let nAv; // nič ali vejica pri večstavčnih povedih, glede na veznik in drugo

    let vozilo; // to je vozilo, uporabljeno v stavku
    let kraj; // to je kraj, uporabljen v stavku, npr. šola, univerza itd. ... !!!
    let mesto; // to je mesto, uporabljen v stavku
    
    let stavki = [];
    let poved; // več stavkov skupaj

    


    // ZGODBICE !!!

    //potovanje
    let štKrajev; // število obiskanih krajev na poti
    let načiniPotovanja; // glagoli, s katerimi potujejo

    class nepravGlagol {
        constructor(b, sedanjik, perfekt, prevod, ) {
            this.b = b;
            this.sedanjik = sedanjik;
            this.perfekt = perfekt;
            this.tip = "gl";
            this.prevod = prevod;
            this.pravilen = false;
            this.deljiv = this.b.includes("_");
        }
    }

    class pravGlagol {
        constructor(b, sedanjik, perfekt, prevod, ) {
            this.b = b;
            this.sedanjik = sedanjik;
            this.perfekt = perfekt;
            this.tip = "gl";
            this.prevod = prevod;
            this.pravilen = true;
            this.deljiv = this.b.includes("_");
        }
    }
    
    class nemSam {
        constructor(prevod, predlog, b, mn, ) {
            this.b = b;
            this.prevod = prevod;
            this.predlog = predlog;
            this.mn = mn;
            this.tip = "sam";
            if(this.predlog === "der") this.predlod3_sklon = "dem";
            else if(this.predlog === "die") this.predlod3_sklon = "der";
            else if(this.predlog === "das") this.predlod3_sklon = "dem";
        }
    }

    const osebniZaimki = ["ich", "du", "er", /*"sie" ,*/"es", "wir", "ihr", "sie", "Sie"];

    const osebe = ["Karl", "Mitja", "Žiga", "Tjaša", "Vid", "Tim", "Nik", "Gal", "Aleksej", "Anže", "Laura", "Naja", "Maca", "Erika", "Mark", "Marcel", "Ajd", 
                   "Boštjan", "Nicholas", "Jurij", "Luka", "Nataša", "Martin", ];

    const vezniki = ["denn", "aber", "und"];

    const mesta = ["Wien", "Ljubljana", "Maribor", "Celje", "Novo mesto", "Zürich", "Berlin", "Klagenfurt"];

    const predlogi = ["nach", "zu", "mit",];
    
    const kraji = [
    new nemSam("grad", "die", "Burg", "-en"),
    new nemSam("univerza", "die", "Uni", "-en"      ),
    new nemSam("šola", "die", "Schule", "-n"     ),
    new nemSam("cerkev", "die", "Kirche", "-n"    ),
    new nemSam("trg", "der", "Markt", "Märkte"  ),
    new nemSam("letalšče", "der", "Flughafen", "Flughäfen"     ),
    new nemSam("pristanišče", "der", "Hafen", "Häfen"    ),];


    const vozila = [
    new nemSam("avto", "das", "Auto", "-s"),
    new nemSam("avto", "der", "Wagen", ""),
    new nemSam("kolo", "das", "Fahrrad", "Fahrräder"      ),
    new nemSam("kolo", "das", "Rad", "Räder"      ),
    new nemSam("vlak", "der", "Zug", "Züge"     ),
    new nemSam("avtobus", "der", "Bus", "-se"    ),

    new nemSam("letalo", "das", "Flugzeug", "-e"  ),
    new nemSam("letalo", "der", "Flieger", ""     ),];


    const glagoli = [
    new nepravGlagol("ab_fahren", "fährt ab", "ist abgefahren", "odpeljati se"), 
    new nepravGlagol("ab_fliegen", "fliegt ab", "ist abgeflogen", "odleteti"), 
    new nepravGlagol("ab_geben", "gibt", "hat abgegegeben", "izročiti, oddati"), 
    new nepravGlagol("fahren", "fährt", "ist gefahren", "peljati (se)"), 
    new nepravGlagol("fliegen", "fliegt", "ist geflogen", "leteti"), 
    new nepravGlagol("geben", "gibt", "hat gegeben", "dati"), 
    new nepravGlagol("gehen", "geht", "ist gegangen", "iti"), 
    ];


    const samostalniki = [
    new nemSam("grad", "die", "Burg", "-en"),
    new nemSam("proizvodnja", "die", "Produktion", "-en"      ),
    new nemSam( "kostum", "das", "Kostüm", "-e"     ),
    new nemSam(  "maša", "die", "Messe", "-n"    ),
    new nemSam(   "denar", "das", "Geld", "/"  ),
    new nemSam(  "otok", "die", "Insel", "-n"    ),
    new nemSam(  "reka", "der", "Fluss", "Flüsse"    ),
    new nemSam(  "muzej", "das", "Museum", "Mussen"    ),
    new nemSam(  "palček", "der", "Zwerg", "-e"    ),
    new nemSam(   "plaža", "der", "Strand", "Strände"   ),
    new nemSam(   "košara", "der", "Korb", "Körbe"   ),
    new nemSam( "banka", "die", "Bank", "Bänke"     ),
    new nemSam( "stadion", "das", "Stadion", "Stadien"     ),
    new nemSam( "torta", "die", "Torte", "-n"     ),
    new nemSam(  "kuverta", "der", "Umschlag", "Umschläge"    ),
    new nemSam( "letalšče", "der", "Flughafen", "Flughäfen"     ),
    new nemSam( "pristanišče", "der", "Hafen", "Häfen"    ),
    ];




    function narediStavek() {
        st = "";
        bVst = [];

        // štBvSt = Math.floor(Math.random()*7+3)
        štBvSt = 3;
        for(let i = 0; i < štBvSt; i++) {
            if(i === 0 && nacin !== "zgodbica") {
                if(Math.floor(Math.random()*2) === 1) {
                    oVst = osebniZaimki[Math.floor(Math.random()*osebniZaimki.length)];
                    bVst.push(oVst);
                } else {
                    oVst = osebniZaimki[Math.floor(Math.random()*osebniZaimki.length)]
                    if(oVst === "ich") bVst.push("ich");
                    if(oVst === "du") bVst.push("du");
                    if(oVst === "er" ||/* oVst === "sie" ||*/ oVst === "es") bVst.push(osebe[Math.floor(Math.random()*osebe.length)]);
                    if(oVst === "wir") bVst.push("wir");
                    if(oVst === "ihr") bVst.push("ihr");
                    if(oVst === "sie") {
                        štO = Math.floor(Math.random()*3+2);
                        sieHelp = "";
                        for(let i = 0; i < štO; i++) {
                            if(i === 0) sieHelp = osebe[Math.floor(Math.random()*osebe.length)];
                            else if(i === štO - 1) sieHelp = `${sieHelp} und ${osebe[Math.floor(Math.random()*osebe.length)]}`;
                            else sieHelp = `${sieHelp}, ${osebe[Math.floor(Math.random()*osebe.length)]}`;
                        }
                        bVst.push(sieHelp);
                    }
                    if(oVst === "Sie") bVst.push("Sie");
                }
            }
            if(i === 1) {
                glagol = glagoli[Math.floor(Math.random()*glagoli.length)]

                if(glagol.deljiv === true) {
                    jeDeljivGlVst = true;

                    if(oVst === "wir" || oVst === "sie" || oVst === "Sie") {
                        DglVst = glagol.b.split("_");
                        bVst.push(DglVst[1]);
                        DglVst02 = DglVst[0];
                    } 
                    else if(oVst === "er"/* || oVst === "sie"*/ || oVst === "es") {
                        if(glagol.pravilen === false) {
                            DglVst = glagol.sedanjik.split(" ");
                            bVst.push(DglVst[0]);
                            DglVst02 = DglVst[1];
                        } else {
                            DglVst = glagol.b.split("_");
                            DglVstHelp = DglVst[1].slice(0, DglVst[1].length - 2); // odtrani zadnja 2 characterja v stringu ()
                            DglVstHelp = `${DglVstHelp}t`; // doda -t na konec besede
                            bVst.push(DglVstHelp);
                            DglVst02 = DglVst[0];
                        }
                    } else if(oVst === "du") {
                        if(glagol.pravilen === false) {
                            DglVst = glagol.sedanjik.split(" ");
                            DglVstHelp = DglVst[0].slice(0, DglVst[0].length - 1);
                            DglVstHelp = `${DglVstHelp}st`;
                            bVst.push(DglVstHelp);
                            DglVst02 = DglVst[1];
                        } else {
                            DglVst = glagol.b.split("_");
                            DglVstHelp = DglVst[1].slice(0, DglVst[1].length - 2); // odtrani zadnja 2 characterja v stringu ()
                            DglVstHelp = `${DglVstHelp}st`; // doda -st na konec besede
                            bVst.push(DglVstHelp);
                            DglVst02 = DglVst[0];
                        }
                    } else if(oVst === "ich") {
                        DglVst = glagol.b.split("_");
                        DglVstHelp = DglVst[1].slice(0, DglVst[1].length - 1);
                        bVst.push(DglVstHelp);
                        DglVst02 = DglVst[0];
                    } else if(oVst === "ihr") {
                        DglVst = glagol.b.split("_");
                        DglVstHelp = DglVst[1].slice(0, DglVst[1].length - 2);
                        DglVstHelp = `${DglVstHelp}t`;   // ni vedno, ampak zaenkrat ... (???)
                        bVst.push(DglVstHelp);
                        DglVst02 = DglVst[0];
                    } else console.log(oVst);
                    /*
                    DglVst = "";
                    console.log(oVst);
                    oVst = "";*/



                } else {
                    jeDeljivGlVst = false;

                    if(oVst === "wir" || oVst === "sie" || oVst === "Sie") {
                        bVst.push(glagol.b);
                    } 
                    else if(oVst === "er" /*|| oVst === "sie" */|| oVst === "es") {
                        if(glagol.pravilen === false) {
                            bVst.push(glagol.sedanjik);
                        } else {
                            glHelp2 = glagol.b;
                            glHelp = glHelp2.slice(0, glHelp2.length - 2); // odtrani zadnja 2 characterja v stringu ()
                            glHelp = `${glHelp}t`; // doda -t na konec besede
                            bVst.push(glHelp);
                        }
                    } else if(oVst === "du") {
                        if(glagol.pravilen === false) {
                            glHelp2 = glagol.sedanjik;
                            glHelp = glHelp2.slice(0, glHelp2.length - 1);
                            glHelp = `${glHelp}st`;
                            bVst.push(glHelp);
                        } else {
                            glHelp2 = glagol.b;
                            glHelp = glHelp2.slice(0, glHelp2.length - 2);
                            glHelp = `${glHelp}st`; 
                            bVst.push(glHelp);
                        }
                    } else if(oVst === "ich") {
                        glHelp2 = glagol.b;
                        glHelp = glHelp2.slice(0, glHelp2.length - 1);
                        bVst.push(glHelp);
                    } else if(oVst === "ihr") {
                        glHelp2 = glagol.b;
                        glHelp = glHelp2.slice(0, glHelp2.length - 2);
                        glHelp = `${glHelp}t`; 
                        bVst.push(glHelp);
                    } else console.log(oVst);
                    /*
                    glHelp2 = "";
                    glHelp = "";
                    console.log(oVst);
                    oVst = "";*/
                }
            } 
            if(i === 2) {
                if(glagol.b === "fahren" || glagol.b === "fliegen" || glagol.b === "ab_fahren" || glagol.b === "ab_fliegen"  || glagol.b === "gehen") {
                    if(glagol.b === "fahren" || glagol.b === "ab_fahren") {
                        vozilo = vozila[Math.floor(Math.random()*(vozila.length-2))]; // 2 je število vozil, pri katerih ne uporabimo glagola fahren
                        bVst.push(`mit ${vozilo.predlod3_sklon} ${vozilo.b}`);
                    } else if (glagol.b === "fliegen" || glagol.b === "ab_fliegen") {
                        vozilo = vozila[Math.floor(Math.random()*2 + vozila.length-2)] // obe 2 sta število vozil, pri katerih ne  uporabimo glagola fahren
                        bVst.push(`mit ${vozilo.predlod3_sklon} ${vozilo.b}`);
                    } else if (glagol.b === "gehen") {
                        bVst.push("zu Fuß");
                    }
                    if(Math.floor(Math.random()*2) === 1) {
                        kraj = kraji[Math.floor(Math.random()*(kraji.length))];
                        bVst.push(`zu ${kraj.predlod3_sklon} ${kraj.b}`);
                    } else if(Math.floor(Math.random()*2) === 1) {
                        mesto = mesta[Math.floor(Math.random()*(mesta.length))];
                        bVst.push(`nach ${mesto}`);
                    } else bVst.push("nach Hause");

                    if(štBvSt === 3) {
                        if(jeDeljivGlVst === true) bVst.push(DglVst02)
                        // if(jeVečGlVst === true) bVst.push(DglVst02)
                        dokončajStavek();
                    }
                } else {
                    bVst.push(samostalniki[Math.floor(Math.random()*samostalniki.length)].b);
                    if(štBvSt === 3) {
                        if(jeDeljivGlVst === true) bVst.push(DglVst02)
                        // if(jeVečGlVst === true) bVst.push(DglVst02)
                        dokončajStavek();
                    }
                }
            } if(i === 3) return;
        }
    } 


    function dokončajStavek() {
        for(let i = 0; i < bVst.length; i++) {
            if(i === 0) st = `${st}${bVst[i]}`;
            else if(bVst[i] === undefined) {
                bVst.splice(i, 1);
                i++;
            }
            else st = `${st} ${bVst[i]}`;
        }
    }



    
    function narediZgodbico(vrsta) {
        nacin = "zgodbica";
        if(vrsta === "potovanje") {
            štKrajev = Math.floor(Math.random()*3+3);
            načiniPotovanja = ["gehen", "fahren", "fliegen"];
        }
        oVst = osebniZaimki[Math.floor(Math.random()*osebniZaimki.length)];
        if(oVst === "ich") bVst.push("ich");
        if(oVst === "du") bVst.push("du");
        if(oVst === "er" ||/* oVst === "sie" ||*/ oVst === "es") bVst.push(osebe[Math.floor(Math.random()*osebe.length)]);
        if(oVst === "wir") {
            štO = Math.floor(Math.random()*2+2);
            sieHelp = "";
            for(let i = 0; i < štO; i++) {
                if(i === 0) sieHelp = osebe[Math.floor(Math.random()*osebe.length)];
                else if(i === štO - 1) sieHelp = `${sieHelp} und ich`;
                else sieHelp = `${sieHelp}, ${osebe[Math.floor(Math.random()*osebe.length)]}`;
            }
            bVst.push(sieHelp);
        }
        if(oVst === "ihr") {
            štO = Math.floor(Math.random()*3+2);
            sieHelp = "";
            for(let i = 0; i < štO; i++) {
                if(i === 0) sieHelp = osebe[Math.floor(Math.random()*osebe.length)];
                else if(i === štO - 1) sieHelp = `${sieHelp} und ${osebe[Math.floor(Math.random()*osebe.length)]}`;
                else sieHelp = `${sieHelp}, ${osebe[Math.floor(Math.random()*osebe.length)]}`;
            }
            sieHelp = `${sieHelp}, ihr`;
            bVst.push(sieHelp);
        }
        if(oVst === "sie") {
            štO = Math.floor(Math.random()*3+2);
            sieHelp = "";
            for(let i = 0; i < štO; i++) {
                if(i === 0) sieHelp = osebe[Math.floor(Math.random()*osebe.length)];
                else if(i === štO - 1) sieHelp = `${sieHelp} und ${osebe[Math.floor(Math.random()*osebe.length)]}`;
                else sieHelp = `${sieHelp}, ${osebe[Math.floor(Math.random()*osebe.length)]}`;
            }
            bVst.push(sieHelp);
        }
        if(oVst === "Sie") bVst.push("Sie");

        if(vrsta === "potovanje") {
            for(let i = 0; i < štKrajev; i++) {
               narediStavek();

            }
        }




        
    }
















</script>

<p style="margin-left: 15px; font-size: 20px;">{st}</p>
<p style="margin-left: 15px; font-size: 20px;">{besedilo}</p>

<button on:click={() => {
    štSt = Math.floor(Math.random()*2); // 2 je max. število stavkov v neki povedi !!! 
    if(štSt === 0) {
        narediStavek(); 
        console.log(bVst);
        stArray = st.split("");
        St = `${stArray[0].toUpperCase()}${st.slice(1)}`
        besedilo = `${besedilo} ${St}.`;
    }
    else if(štSt === 1) {
        narediStavek(); 
        stArray = st.split("");
        St = `${stArray[0].toUpperCase()}${st.slice(1)}`
        stavki.push(St);

        narediStavek(); 
        stavki.push(st);
        console.log(stavki);

        veznik = vezniki[Math.floor(Math.random()*vezniki.length)];
        if(veznik === "und") nAv = "";
        else nAv = ",";
        besedilo = `${besedilo} ${stavki[0]}${nAv} ${veznik} ${stavki[1]}.`;
        stavki = [];
    } else if(štSt > 1) {
        narediStavek(); 
        stArray = st.split("");
        St = `${stArray[0].toUpperCase()}${st.slice(1)}`
        stavki.push(St);

        for(let i = 0; i < štSt; i++){
            narediStavek(); 
            stavki.push(st);
        }
        console.log(stavki);
        

        veznik = vezniki[Math.floor(Math.random()*vezniki.length)];
        if(veznik === "und") nAv = "";
        else nAv = ",";
        poved = stavki[0];
        for(let i = 0; i < štSt; i++) {
            poved = `${poved}${nAv} ${veznik} ${stavki[i+1]}`;
        }
        
        besedilo = `${besedilo} ${poved}.`;
        stavki = [];
    }
}}>KLIKNI !!!</button>


<button on:click={() => narediZgodbico("potovanje")}>Klikni2 !!!</button>


<style>




</style>