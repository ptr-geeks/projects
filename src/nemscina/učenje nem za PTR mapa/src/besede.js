class nemGl {
    constructor(b, perfekt, prevod, pravilen) {
        this.b = b;
        this.prevod = prevod;
        this.perfekt = perfekt;
        this.pravilen = pravilen;
        this.tip = "gl";
    }
}

class nemSam {
    constructor(prevod, predlog, b, mn, ) {
        this.b = b;
        this.prevod = prevod;
        this.predlog = predlog;
        this.mn = mn;

        this.tip = "sam";
    }
}

class nemOstalo {
    constructor(b, prevod) {
        this.b = b;
        this.prevod = prevod;
        this.tip = "drugo";
    }
}

export const A2_12_gl = {ime: "A2 1-2 glagoli", elementi: [
    new nemGl(),
]};

export const A2_12_sam = {ime: "A2 1-2 samostalniki", elementi: [
    new nemSam("grad", "die", "Burg", "-en"),
    new nemSam("proizvodnja", "die", "Produktion", "-en"      ),
    new nemSam( "kostum", "das", "Kostüm", "-e"     ),
    new nemSam(  "maša", "die", "Messe", "-n"    ),
    new nemSam(   "denar", "das", "Geld", "/"  ),
    new nemSam(  "otok", "die", "Insel", "-n"    ),
    new nemSam( "sirov fondi", "das", "Käsefondue",     ),
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
    new nemSam(      ),
    new nemSam(      ),
]};

export const A2_12_ostalo = {ime: "A2 1-2 druge beseda", elementi: [
    new nemOstalo(),
]};