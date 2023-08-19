<script lang="ts">
  import { glagoli } from "./glagoli";
  import { makeRequest } from "./server";
  let fd;
  let f;

  let nacin = "default screen"; 

  const token = localStorage.getItem("key");
    if (token === null || token === undefined || token === "") {
        localStorage.removeItem("key");
        window.location.href = "/login";
    }


</script>
  
<style>
  a:hover {
    color: rgb(108, 189, 255);
  } 
  

</style>

<div style="display: flex;
justify-content: center;
align-items: center; margin:0;">
  <h1 style="margin-bottom: 0; margin-top: 12px;">Dobrodošli na programu za učenje nemščine</h1>

</div>


<div style="display: flex;
justify-content: center;
align-items: center; margin:0;">
<h4 style="margin-bottom: 0; margin-top: 10px;">in kasneje mogoče tudi drugih jezikov</h4>

</div>




<div style="margin-left: 10px;">
  <h2 style="margin:0;">Na kratko o programu</h2>
  <p>Ta program je namenjen učenju nemščine, predvsem ponavljanju in učenju nepravilnih stvari, kot so predlogi in množina pri samostalnikih, 
    nekateri časi in druge nepravilnosti pri glagolih ter na sploh učenje novih nemških besed. Več o tem programu pa si lahko preberete 
    <a style="text-decoration: none;" href="/o_programu">tukaj</a>.</p>

  <div class="big-break"></div>

  <h2 style="margin:0;">Kako uporabljati ta program?</h2>
  <p style="margin-bottom:0;">Program je še kar čudno narejen, zato boste v tem odseku izvedeli, kako ta program približno deluje.</p>
  <p style="margin-top:0;">V zgornji vrstici se nahaja kar nekaj povezav. Spodaj so navodila za uporabo vsake.</p>

  <div class="big-break"></div>

  <h3 style="margin:0;">Domov</h3>
  <p>Domov vas pripelje sem, kjer se trenutno nahajate</p>

  <div class="big-break"></div>

  <h3 style="margin:0;">Seznami</h3>
  <p>Seznami vas pripeljejo do podstrani na katerih se nahajajo seznami. Če niste prijavljeni, na tej podstrani ne boste videli nič, drugače pa se tu nahajajo vsi 
    javni in zasebni (vaši) seznami. Na vrhu je gumb, ob kliku katerega lahko ustvarite nov zaseben seznam, ki ga lahko vidite samo vi. S klikom preberi več se vam 
    odpre več informacij o seznamu, vključno z vsemi besedami, ki so vključene v ta seznam. Če ste avtor tega seznama oz. ste ta seznam ustvarili vi, lahko tudi 
    urejate seznam, lahko ga izbrišete in urejate besede, ki se nahajajo v seznamu.  
  </p>

  <div class="big-break"></div>
  
  <h3 style="margin:0;">Učenje</h3>
  <p>Učenje vas pripelje do podstrani na katerih poteka dejansko učenje. Najprej morate izbrati seznam besed, iz katerega hočete, da se učite 
    (npr. če želite vaditi nepravilne glagole, kliknete nepravilni glagoli itd.), nato izberete, katero podrobnejšo stvar se želite učiti 
    (npr. preteklik, perfekt, der/die/das, množina itd.) ter nato kliknete gumb Način učenja za pričetek učenja. Ob tem se vam bodo pojavile
    nove stvari: gumb Domov, ki vodi do podstrani Domov, gumb Zapri, ki zapre način učenja in vas vrne na začetni zaslon podstrani Učenje 
    in še glavni del, kjer se vam bo prikazala nemška beseda pod njo pa stvari, ki jih morate vpisati. Ko vpišete svoj odgovor kliknete gumb 
    Preveri in pokazalo se vam bo, ali ste pravilno odgovorili (zelena barva odgovora - pravilno, rdeča - napačno), ob ponovnem kliku pa se 
    vam bo pokazala še rešitev (če ste odgovorili narobe, drugače se vam rešitev ne bo prikazala). Da nadaljujete in se vam prikaže naslednja 
    beseda naot kliknete gumb Naprej. 
  </p>
  <p></p>

  <h4 style="margin:0;">Učenje perfekta</h4>
  <p>Pri učenju perfekta morate v polje vpisati glagol haben ali sein (odvisno od glagola), ki mora biti spregan v 3. osebi ednine (er/sie/es), 
    torej morate napisati hat ali ist ter nato še sam glagol v perfektu. 
  </p>

  <div class="big-break"></div>

  <h3 style="margin:0;">Besedila</h3>
  <p>Na podstrani Besedila se bodo najverjetneje nahajali razni generatorji naključnih besedil in mogoče tudi naloge v stilu gap fill 
    (take naloge pomenijo, da dobite besedilo, v katerem manjkajo nekatere besede, vi pa morate na tista mesta umestiti smiselne besede), 
  vendar je podstran še v razvoju in nisem prepričan, kdaj bo dokončana in na voljo.</p>

  <div class="big-break"></div>

  <h3 style="margin:0;">O programu</h3>
  <p>Na tej podstrani lahko izveste vse kar hočete vedeti o programu, razvijalcih in drugih stvareh.</p>

  <div class="big-break"></div>

  <h3 style="margin:0;">Izbira jezika</h3>
  <p>S tem gumbom lahko izbirate med različnimi jeziki, vendar je zaenkrat edina opcija nemščina. Če imate kakšne predloge za jezik in na 
    kakšen način bi ga dodal, lahko pišete na naslov<b>, ki a še nisem dodal</b>. V elektronskem sporočilu mi prosim napišite tudi, zakaj 
    bi radi dodali ta jezik, zelo priporočljivo pa je, da mi piše več ljudi za isti jezik, saj za samo enega uporabnika najverjetneje ne 
    bom dodal novega jezika.</p>

  <div class="big-break"></div>

  <h3 style="margin:0;">Odjava</h3>
  <p>S klikom na ta gumb se odjavite.</p>

  <div class="big-break"></div>

  <h3 style="margin:0;">Nastavitve</h3>
  <p>S klikom na ta gumb si lahko spremenite geslo. Vpisati morate staro geslo in nato še novo gelso ter klikniti gumb Spremeni geslo.</p>
  <p>Druge nastavitve zaenkrat še niso dodane.</p>


  <div class="big-break"></div>


</div>