<script lang="ts">
    import Button from "@smui/button";

    // program za delanje nemških števil
    /*let neki;
    function narediNeki() {
        neki = '["null", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwolf"';

        for(let i = 0; i < 6; i++) {
            neki = `${neki}, "${števila[i+3]}zehn"`;
        } 
        neki = `${neki}, "zwanzig"`;
        for(let i = 0; i < 9; i++) {
            neki = `${neki}, "${števila[i+1]}undzwanzig"`;
        }
        neki = `${neki}, "dreißig", "einunddreißig"]`;
    }*/


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
    let mestoBesedeVseznamu; 
    let določiGlagol = false;  // ali lahko že v naprej določimo glagol

    let osebek_locked;

    let žeUporabljeniSamVbesedilu = []; // pač ja
    let sklonPredmeta = "4";

    let vozilo; // to je vozilo, uporabljeno v stavku
    let kraj; // to je kraj, uporabljen v stavku, npr. šola, univerza itd. ... !!!
    let mesto; // to je mesto, uporabljen v stavku
    let znamenitost; // to je znamenitost, uporabljen v stavku

    let t = {
        u: 0,
        d: "",
        dŠt: 1,
        dVm: 31,
        m: "Januar",
        l: 2023, // popravi še vse to   <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------------------------------------------- POPRAVI TO !!!!!!!!!!!!!!
        v: "",
        vArray: []
    }; // čas
    
    let stavki = [];
    let poved; // več stavkov skupaj

    


    // ZGODBICE !!!
    let vrstaZgodbice;
    let glagoliVzgodbici = [];
    let mestaVzgodbici = [];
    let štGlagolaVarrayuGlVzgodbici;
    let štMestaVarrayuMestaVzgodbici;
    let štKrajevVarrayuKrajiVzgodbici;
    let iskanoMesto;
    let iskanKraj;
    let iskanGlagol;

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
            if(this.predlog === "der") {
                this.predlog3_sklon = "dem";
                this.predlog4_sklon = "den";
                this.nedoločniČlen = "ein";
                this.nedoločniČlen3_sklon = "einem";
                this.nedoločniČlen4_sklon = "einen";
                this.osebniZaimek = "er";
            }
            else if(this.predlog === "die") {
                this.predlog3_sklon = "der";
                this.predlog4_sklon = "die";
                this.nedoločniČlen = "eine";
                this.nedoločniČlen3_sklon = "einer";
                this.nedoločniČlen4_sklon = "eine";
                this.osebniZaimek = "sie";
            }
            else if(this.predlog === "das") {
                this.predlog3_sklon = "dem";
                this.predlog4_sklon = "das";
                this.nedoločniČlen = "ein";
                this.nedoločniČlen3_sklon = "einem";
                this.nedoločniČlen4_sklon = "ein";
                this.osebniZaimek = "es";
            }
        }
    }

    const osebniZaimki = ["ich", "du", "er", /*"sie" ,*/"es", "wir", "ihr", "sie", "Sie"];

    const osebe = ["Karl", "Mitja", "Žiga", "Tjaša", "Vid", "Tim", "Nik", "Gal", "Aleksej", "Anže", "Laura", "Naja", "Maca", "Erika", "Mark", "Marcel", "Ajd", 
                   "Boštjan", "Nicholas", "Jurij", "Luka", "Nataša", "Martin", "Anja"];
    
    const osebe_ž = ["Tjaša", "Laura", "Naja", "Maca", "Erika", "Nataša", "Anja"];
                
    const osebe_m = ["Karl", "Mitja", "Žiga", "Vid", "Tim", "Nik", "Gal", "Aleksej", "Anže", "Mark", "Marcel", "Ajd", "Boštjan", "Nicholas", "Jurij", "Luka", "Martin"];
        
    const osebe_sr = ["Lofi", "Piki", "Tačko", "Muca", "Muri", "Crisp", "Fluffy"];
                

    const vezniki = ["denn", "aber", "und"];

    const mesta = ["Wien", "Ljubljana", "Maribor", "Celje", "Novo mesto", "Zürich", "Berlin", "Klagenfurt", "Leibach", "London", "Paris", "Trst", "Ptuj", "Fužinama", "Mirna peč"];

    const predlogi = ["nach", "zu", "mit", "in", ];

    const števila = ["null", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf", "dreizehn", "vierzehn", "fünfzehn", 
                     "sechzehn", "siebzehn", "achtzehn", "zwanzig", "einundzwanzig", "zweiundzwanzig", "dreiundzwanzig", "vierundzwanzig", "fünfundzwanzig", 
                     "sechsundzwanzig", "siebenundzwanzig", "achtundzwanzig", "neunundzwanzig", "dreißig", "einunddreißig"];

    const meseci = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];

    const kraji = [
    new nemSam("grad", "die", "Burg", "-en"),
    new nemSam("univerza", "die", "Uni", "-en"      ),
    new nemSam("šola", "die", "Schule", "-n"     ),
    new nemSam("cerkev", "die", "Kirche", "-n"    ),
    new nemSam("trg", "der", "Markt", "Märkte"  ),
    new nemSam("letalšče", "der", "Flughafen", "Flughäfen"     ),
    new nemSam("pristanišče", "der", "Hafen", "Häfen"    ),];

    const znamenitosti = [
    new nemSam("grad", "die", "Burg", "-en"),
    new nemSam("cerkev", "die", "Kirche", "-n"    ),
    new nemSam("muzej", "das", "Museum", "Museen"),  
    ];
 
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
    new pravGlagol("machen", "macht", "hat gemacht", "delati"),  
    new nepravGlagol("beginnen", "beginnt", "hat begonnen", "začeti"), 
    new pravGlagol("besuchen", "besucht", "hat gebesucht", "obiskati"),  
    new nepravGlagol("denken", "denkt", "hat gedacht", "misliti"), 
    new nepravGlagol("um_steigen", "steigt um", "ist umgestiegen", "prestopiti"), 
    new nepravGlagol("ein_steigen", "steigt ein", "ist eingestiegen", "vstopiti"), 
    new nepravGlagol("aus_steigen", "steigt aus", "ist ausgestiegen", "izstopiti"), 
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
    new nemSam( "potovanje", "die", "Reise", "-n"    ),
    new nemSam( "izlet", "der", "Ausflug", "Auflüge"    ),
    
    ];


    function poiščiBesedoVseznamu(b, seznam) {  // ta algoritem še poskusi popraviti, ker je trash !!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<------------------------- TO !!!
        for(let i = 0; i < seznam.length; i++) {
            if(seznam[i].b === b) {
                mestoBesedeVseznamu = i;
                return;
            } 
        }
        console.log("ERROR!", seznam, seznam.length, mestoBesedeVseznamu);
    }




    function narediStavek() {
        st = "";
        bVst = [];

        narediOsebek();
        narediGlagol();
        narediPDK();

        if(jeDeljivGlVst === true) bVst.push(DglVst02);

        dokončajStavek();
    }

    function narediOsebek() {
        if(nacin !== "zgodbica" && Math.floor(Math.random()*2) === 1) {
            oVst = osebniZaimki[Math.floor(Math.random()*osebniZaimki.length)];
            bVst.push(oVst);
        } else {
            oVst = osebniZaimki[Math.floor(Math.random()*osebniZaimki.length)];
            if(oVst === "ich") bVst.push("ich");
            if(oVst === "du") bVst.push("du");
            if(oVst === "er") bVst.push(osebe_m[Math.floor(Math.random()*osebe_m.length)]);
            /*if( oVst === "sie") bVst.push(osebe_ž[Math.floor(Math.random()*osebe_ž.length)]);*/
            if(oVst === "es") bVst.push(osebe_sr[Math.floor(Math.random()*osebe_sr.length)]);
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
        }
    }
    
    function narediGlagol() {
        if(nacin === "zgodbica" && določiGlagol === true) {
            določiGlagol = false;
            glagol = glagoli[mestoBesedeVseznamu]; 
        } 
        else glagol = glagoli[Math.floor(Math.random()*glagoli.length)];

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
        }
    }


    function narediPredmet(beseda) {
        if(žeUporabljeniSamVbesedilu.includes(beseda)) {
            if(sklonPredmeta === "4") {
                bVst.push(`${beseda.predlog4_sklon} ${beseda.b}`);
            } 
        } else {
            if(sklonPredmeta === "4") {
                bVst.push(`${beseda.nedoločniČlen4_sklon} ${beseda.b}`);
            } 
        }
    }



    function narediPDK() {
        if(glagol.b === "fahren" || glagol.b === "fliegen" || glagol.b === "ab_fahren" || glagol.b === "ab_fliegen"  || glagol.b === "gehen") {
            if(glagol.b === "fahren" || glagol.b === "ab_fahren") {
                vozilo = vozila[Math.floor(Math.random()*(vozila.length-2))]; // 2 je število vozil, pri katerih ne uporabimo glagola fahren
                bVst.push(`mit ${vozilo.predlog3_sklon} ${vozilo.b}`);
            } else if (glagol.b === "fliegen" || glagol.b === "ab_fliegen") {
                vozilo = vozila[Math.floor(Math.random()*2 + vozila.length-2)] // obe 2 sta število vozil, pri katerih ne  uporabimo glagola fahren
                bVst.push(`mit ${vozilo.predlog3_sklon} ${vozilo.b}`);
            } else if (glagol.b === "gehen") {
                bVst.push("zu Fuß");
            } 
            if(nacin !== "zgodbica") {
                if(Math.floor(Math.random()*2) === 1) {
                    kraj = kraji[Math.floor(Math.random()*(kraji.length))];
                    bVst.push(`zu ${kraj.predlog3_sklon} ${kraj.b}`);
                } else if(Math.floor(Math.random()*2) === 1) {
                    mesto = mesta[Math.floor(Math.random()*(mesta.length))];
                    bVst.push(`nach ${mesto}`);
                } else bVst.push("nach Hause");
            } else {
                štMestaVarrayuMestaVzgodbici = Math.floor(Math.random()*(mesta.length));
                mesto = mesta[štMestaVarrayuMestaVzgodbici];
                mestaVzgodbici.splice(štMestaVarrayuMestaVzgodbici, 1);
                bVst.push(`nach ${mesto}`);
            }
            

        } else if(glagol.b === "geben") {
            bVst.push(samostalniki[Math.floor(Math.random()*samostalniki.length)].b);
        } else if(glagol.b === "beginnen") {
            if(nacin === "zgodbica" && vrstaZgodbice === "potovanje") {
                štMestaVarrayuMestaVzgodbici = Math.floor(Math.random()*mesta.length);
                mesto = mesta[štMestaVarrayuMestaVzgodbici];
                mestaVzgodbici.splice(štMestaVarrayuMestaVzgodbici, 1);
                if(Math.floor(Math.random()*2) === 1) {
                    bVst.push(`in ${mesto}`);
                } else {
                    bVst.push(`in ${mesto}. Dort ist ${kraji[Math.floor(Math.random()*kraji.length)].b} in der Nähe`);
                }
            }
        } else if(glagol.b === "besuchen") {
            if(nacin === "zgodbica" && vrstaZgodbice === "potovanje") {
                znamenitost = znamenitosti[Math.floor(Math.random()*znamenitosti.length)];
                bVst.push(`${znamenitost.nedoločniČlen} ${znamenitost.b}`);
            }
        } else if(glagol.b === "ein_steigen" || glagol.b === "aus_steigen" || glagol.b === "um_steigen") {
            if(nacin === "zgodbica" && vrstaZgodbice === "potovanje") {
                if(Math.floor(Math.random()*2) === 1) {
                    štMestaVarrayuMestaVzgodbici = Math.floor(Math.random()*mesta.length);
                    mesto = mesta[štMestaVarrayuMestaVzgodbici];
                    mestaVzgodbici.splice(štMestaVarrayuMestaVzgodbici, 1);
                    bVst.push(`an der Station ${mesto}`);
                } else {
                    štMestaVarrayuMestaVzgodbici = Math.floor(Math.random()*mesta.length);
                    mesto = mesta[štMestaVarrayuMestaVzgodbici];
                    mestaVzgodbici.splice(štMestaVarrayuMestaVzgodbici, 1);
                    bVst.push(`in ${mesto}`);
                }
            }
        }
    }

    function narediPDČ(ura, dan, mesec, leto) {
        t.vArray = [];
        if(ura === true) t.vArray.push(`um ${Math.floor(Math.random()*24)}:${Math.floor(Math.random()*4)*15}`);
        else t.vArray.push("");

        if(leto === true) { 
            t.l = Math.floor(Math.random()*23+2000); 
            t.vArray.push(`in Jahr ${t.l}`);
        } else t.vArray.push("");

        if(mesec === true) {
            t.m = meseci[Math.floor(Math.random()*12)];
            t.vArray.push(t.m);

        } else t.vArray.push("");

        if(dan === true) {
            t.dVm = (t.m==="April" || t.m==="Juni" || t.m==="September" || t.m==="November") ? 30 : (t.m==="Februar" && t.l % 4 === 0) ? 29 : (t.m==="Februar" && t.l % 4 !== 0)? 28 : 31;
            t.dŠt = Math.floor(Math.random()*t.dVm+1);
            if(t.dŠt === 1) t.d = `ersten`;
            else if(t.dŠt === 3) t.d = `dritten`;
            else t.d = `${števila[t.dŠt]}ten`; // tukaj je že -ten namesto -te, mogoče bo treba kasneje popraviti !!!!!!!!!!!
            t.vArray.push(`am ${t.d}`);
        } else t.vArray.push("");

        t.v = `${t.v} ${t.vArray[0]}`;
        t.v = `${t.v} ${t.vArray[3]}`;
        t.v = `${t.v} ${t.vArray[2]}`;
        t.v = `${t.v} ${t.vArray[1]}`;

        bVst.push(t.v);

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

    function narediVelikoZačetnico() {
        stArray = st.split("");
        St = `${stArray[0].toUpperCase()}${st.slice(1)}`
    }

    function narediStavekZvelikoZačetnico() {
        narediStavek(); 
        narediVelikoZačetnico();
    }



    
    function narediZgodbico() {
        if(vrstaZgodbice === "potovanje") {
            štKrajev = Math.floor(Math.random()*3+6);
            načiniPotovanja = ["gehen", "fahren", "fliegen"];
            glagoliVzgodbici = načiniPotovanja;
            for(let i=0; i < štKrajev-3; i++) {
                glagoliVzgodbici.push(načiniPotovanja[Math.floor(Math.random()*2+1)])
            }
            mestaVzgodbici = mesta;

            narediOsebek();
            // oVst;
            osebek_locked = bVst[0];

            poiščiBesedoVseznamu("machen", glagoli);
            določiGlagol = true;
            narediGlagol();
            
            narediPDČ(false, true, true, false);
            
            if(Math.floor(Math.random()*2) === 1) poiščiBesedoVseznamu("Reise", samostalniki);  // ta algoritem še poskusi popraviti, ker je trash !!!
            else poiščiBesedoVseznamu("Ausflug", samostalniki);  // ta algoritem še poskusi popraviti, ker je trash !!! 
            narediPredmet(samostalniki[mestoBesedeVseznamu]);
            žeUporabljeniSamVbesedilu.push(samostalniki[mestoBesedeVseznamu].b);

            dokončajStavek();
            
            narediVelikoZačetnico();
            st = `${St}.`;

            besedilo = `${besedilo} ${st}`;
            
            for(let i = 0; i < štKrajev; i++) {
                bVst = [];
                st = "";

                

                if(i === 0) {
                    bVst.push(oVst);

                    poiščiBesedoVseznamu("beginnen", glagoli);
                    določiGlagol = true;
                    narediGlagol();

                    narediPDK();
                                    
                    dokončajStavek();
                    
                    narediVelikoZačetnico();
                    st = `${St}.`;
                    besedilo = `${besedilo} ${st}`;
                }
                if(i === 1) {
                    bVst.push("Dann");

                    štGlagolaVarrayuGlVzgodbici = Math.floor(Math.random()*glagoliVzgodbici.length);
                    iskanGlagol = glagoliVzgodbici[štGlagolaVarrayuGlVzgodbici];
                    glagoliVzgodbici.splice(štGlagolaVarrayuGlVzgodbici, 1);
                    // console.log(iskanGlagol, glagoliVzgodbici);
                    poiščiBesedoVseznamu(iskanGlagol, glagoli);
                    določiGlagol = true;
                    narediGlagol();

                    bVst.push(oVst);
                }
                if(i > 1 && i < štKrajev-1) {
                    bVst.push(oVst);

                    štGlagolaVarrayuGlVzgodbici = Math.floor(Math.random()*glagoliVzgodbici.length);
                    iskanGlagol = glagoliVzgodbici[štGlagolaVarrayuGlVzgodbici];
                    glagoliVzgodbici.splice(štGlagolaVarrayuGlVzgodbici, 1);
                    // console.log(iskanGlagol, glagoliVzgodbici);
                    poiščiBesedoVseznamu(iskanGlagol, glagoli);
                    določiGlagol = true;
                    narediGlagol();
                }
                if(i > 0 && i < štKrajev-1) {
                    narediPDK();

                    dokončajStavek();
                    narediVelikoZačetnico();
                    st = `${St}.`;
                    stavki.push(st);
                    st = "";
                    bVst = [];

                    if(Math.floor(Math.random()*3) !== 1 && i > 1 && (vozilo.b === "Flieger" || vozilo.b === "Flugzeug" || vozilo.b === "Zug" || vozilo.b === "Bus")) {
                        bVst.push(oVst);

                        poiščiBesedoVseznamu("ein_steigen", glagoli);
                        določiGlagol = true;
                        narediGlagol();

                        // narediPDK(); // dokončaj še to in stavek/poved na sploh !!!!!!

                        bVst.push("dort");

                        bVst.push(DglVst02);

                        dokončajStavek();
                        narediVelikoZačetnico();
                        st = `${St}.`;
                        stavki.push(st);
                        st="";
                        bVst=[];

                        if(Math.floor(Math.random()*2) === 1) {
                            bVst.push(oVst);

                            poiščiBesedoVseznamu("um_steigen", glagoli);
                            določiGlagol = true;
                            narediGlagol();

                            narediPDK(); // dokončaj še to in stavek/poved na sploh !!!!!!

                            bVst.push(DglVst02);

                            dokončajStavek();
                            narediVelikoZačetnico();
                            st = `${St}.`;
                            stavki.push(st);
                            st="";
                            bVst=[];

                        }

                        if(Math.floor(Math.random()*2) === 1) {        
                            bVst.push("Dann");

                            poiščiBesedoVseznamu("aus_steigen", glagoli);
                            določiGlagol = true;
                            narediGlagol();

                            bVst.push(oVst);

                            narediPDK(); // dokončaj še to in stavek/poved na sploh !!!!!!

                            bVst.push(DglVst02);
                        } else {
                            bVst.push(oVst);

                            poiščiBesedoVseznamu("aus_steigen", glagoli);
                            določiGlagol = true;
                            narediGlagol();     

                            narediPDK(); // dokončaj še to in stavek/poved na sploh !!!!!!      

                            bVst.push(DglVst02);        
                        }

                        dokončajStavek();
                        narediVelikoZačetnico();
                        st = `${St}.`;
                        stavki.push(st);
                        st="";
                        bVst=[];

                        for(let i = 0; i < stavki.length; i++) {
                            besedilo = `${besedilo} ${stavki[i]}`;
                        }
                        stavki = [];

                    }

                    if(Math.floor(Math.random()*1) === 0) {                            

                        if(Math.floor(Math.random()*2) === 1) {
                            bVst.push("Dort");

                            poiščiBesedoVseznamu("besuchen", glagoli);
                            določiGlagol = true;
                            narediGlagol();

                            bVst.push(oVst);

                            narediPDK();
                        } else {
                            bVst.push(oVst);

                            poiščiBesedoVseznamu("besuchen", glagoli);
                            določiGlagol = true;
                            narediGlagol();

                            narediPDK();

                            bVst.push("dort");
                        }
                        dokončajStavek();
                        narediVelikoZačetnico();
                        st = `${St}.`;
                        stavki.push(st);
                        st="";
                        bVst=[];
                        
                        if(Math.floor(Math.random()*3) === 2) {
                            bVst.push(oVst);

                            poiščiBesedoVseznamu("denken", glagoli);
                            določiGlagol = true;
                            narediGlagol();

                            dokončajStavek();
                            narediVelikoZačetnico();

                            st = `${St}, `;
                            
                            stavki.push(st);
                            
                            st = "";
                            bVst=[];
                            
                            bVst.push(znamenitost.osebniZaimek);
                            bVst.push("ist");
                            if(Math.floor(Math.random()*2) === 1) bVst.push("schön");
                            else if(Math.floor(Math.random()*2) === 1)  bVst.push("sehr schön");
                            else if(Math.floor(Math.random()*2) === 1)  bVst.push("nicht schön");
                            else if(Math.floor(Math.random()*2) === 1)  bVst.push("hässlich");
                            else bVst.push("sehr hässlich");
                            
                            dokončajStavek();

                            bVst = [];

                            st = `${st}.`
                            stavki.push(st);
                        }

                        for(let i = 0; i < stavki.length; i++) {
                            besedilo = `${besedilo} ${stavki[i]}`;
                        }
                        stavki = [];

                    } else {
                        besedilo = `${besedilo} ${st}`;
                    }
                }
                if(i === štKrajev-1) {
                    bVst.push("zuletzt");

                    poiščiBesedoVseznamu("denken", glagoli);
                    določiGlagol = true;
                    narediGlagol();    

                    if(oVst === "ihr") bVst.push("ihr");
                    else bVst.push(osebek_locked);

                    dokončajStavek();
                    narediVelikoZačetnico();
                    st = `${St}, `;
                    stavki.push(st);
                    st = "";
                    bVst=[];

                    if(žeUporabljeniSamVbesedilu.includes("Reise") === true) poiščiBesedoVseznamu("Reise", samostalniki);
                    else poiščiBesedoVseznamu("Ausflug", samostalniki);
                    narediPredmet(samostalniki[mestoBesedeVseznamu]);

                    bVst.push("war");
                    if(Math.floor(Math.random()*2) === 1) bVst.push("schön");
                    else if(Math.floor(Math.random()*2) === 1)  bVst.push("sehr schön");
                    else if(Math.floor(Math.random()*2) === 1)  bVst.push("nicht schön");
                    else bVst.push("hässlich");

                    dokončajStavek();
                    st = `${st}.`;
                    stavki.push(st);
                    st = "";
                    bVst=[];

                    for(let i = 0; i < stavki.length; i++) {
                        besedilo = `${besedilo} ${stavki[i]}`;
                    }
                    stavki = [];
                }
                
            }
        }




        
    }


    function narediVečstavčnoPoved() {
        štSt = Math.floor(Math.random()*2); // 2 je max. število stavkov v neki povedi !!!  - za 0 dela, ostalo pa ???
        if(štSt === 0) {
            if(nacin === "zgodbica") {
                vrstaZgodbice = "potovanje";
                narediZgodbico();
            } else {
                narediStavekZvelikoZačetnico();
                besedilo = `${besedilo} ${St}.`;
            }
            
        }
        else if(štSt === 1) {
            if(nacin === "zgodbica") {
                vrstaZgodbice = "potovanje";
                narediZgodbico();
            } else {
                narediStavekZvelikoZačetnico();

                stavki.push(St);

                narediStavek(); 
                stavki.push(st);

                veznik = vezniki[Math.floor(Math.random()*vezniki.length)];
                if(veznik === "und") nAv = "";
                else nAv = ",";
                besedilo = `${besedilo} ${stavki[0]}${nAv} ${veznik} ${stavki[1]}.`;
                stavki = [];
            }
            
            
        } else if(štSt > 1) {
            if(nacin === "zgodbica") {
                vrstaZgodbice = "potovanje";
                narediZgodbico();
            } else {
                narediStavekZvelikoZačetnico();

                besedilo = `${besedilo} ${St}.`;

                stavki.push(St);

                for(let i = 0; i < štSt; i++){
                    narediStavek(); 
                    stavki.push(st);
                }

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
            
            
        }
    }

</script>

<!-- <p style="margin-left: 15px; font-size: 20px;">{st}</p> -->
<p style="margin-left: 15px; font-size: 20px;">{besedilo}</p>

<Button variant="raised" style="margin-left: 10px;" on:click={() => {
    nacin = "zgodbica";
    besedilo = "";
    narediVečstavčnoPoved();
}}>Generiraj naključno zgodbico o potovanju</Button>


<style>




</style>



















