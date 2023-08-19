<script lang="ts">
  /*let input = "";
  function f () {
    console.log(input);
  }*/


  let nacin = "default screen"; 
  // default screen je home screen
  // default screen 2 je podstran za učenje
  // nacin učenja je podpodstran za učenje/ponavljanje stvari
  // dodaj besdo je podpodstran za dodajanje besed

  
  let bValue_NovB = "";
  let mnValue_NovB = "";
  let jValue_NovB = "nem"; 
  let pValue_NovB = ""; 
  let selectGlPravilen = true; 
  let perfektValue_NovB = "";
  let sprg_ich_sedValue_NovB = "";  // naj bo to vse (spreganje) kasneje nekaj drugega !!!!!!!!!
  let sprg_du_sedValue_NovB = "";
  let sprg_ese_sedValue_NovB = "";
  let sprg_wir_sedValue_NovB = "";
  let sprg_ihr_sedValue_NovB = "";
  let sprg_Ssie_sedValue_NovB = "";
  let selectPrValue = "der";
  let selectVrstaValue = "sam";

  let imeNovegaSeznama = "";
  let novSeznam;


  const sprg_sed = [];

  const nemGl = [];
  const nemSam = [];
  const nemPrid = [];
  const nemOstalo = [];
  const nemB = [];


  class NemGl {
    b: string;      // to na začetku neki nrdi da ne teži z errori, Mitja že ve kaj
    jezik: string;  // to je ker moraš definirati vse tipe spremenljivk v TypeScriptu in ti teži, ampak JS to briga, zato ne vpliva na program
    prevod: string; 
    pravilen: boolean;
    skloniSed: string[];  
    perfekt: string;

    constructor(b, j, p, pravilen, skloniSed, perfekt) {
      this.b = b;
      this.jezik = j;
      this.prevod = p;
      this.pravilen = pravilen;
      this.skloniSed = skloniSed;  // Array
      this.perfekt = perfekt;
    }
  }

  class NemSam {
    constructor(b, j, p, pr, mn) {
    this.b = b;
    this.jezik = j;
    this.prevod = p;
    this.predlog = pr;
    this.mn = mn;
    }
  }

  class NemPrid {
    constructor(b, j, p, ) {
      this.b = b;
      this.jezik = j;
      this.prevod = p;
    }
  }

  class NemOstalo {
    constructor(b, j, p) {
      this.b = b;
      this.jezik = j;
      this.prevod = p;
    }
  }


  function dokončajB() {  
    if(selectVrstaValue === "sam" && nemSam.find(c => c.b !== bValue_NovB)) {
      nemSam.push(new NemSam(bValue_NovB, jValue_NovB, pValue_NovB, selectPrValue, mnValue_NovB));
      console.log(nemSam);
    } else if(selectVrstaValue === "gl" && nemGl.find(c => c.b !== bValue_NovB)) {
      sprg_sed.push(sprg_ich_sedValue_NovB, sprg_du_sedValue_NovB, sprg_ese_sedValue_NovB, sprg_wir_sedValue_NovB, sprg_ihr_sedValue_NovB, sprg_Ssie_sedValue_NovB);
      nemGl.push(new NemGl(bValue_NovB, jValue_NovB, pValue_NovB, selectGlPravilen, sprg_sed, perfektValue_NovB));
      console.log(nemGl);
    } else if(selectVrstaValue === "prid" && nemPrid.find(c => c.b !== bValue_NovB)) {
      nemPrid.push(new NemPrid(bValue_NovB, jValue_NovB, pValue_NovB, ));
      console.log(nemPrid);
    } else if(nemOstalo.find(c => c.b !== bValue_NovB)) {
      nemOstalo.push(new NemOstalo(bValue_NovB, jValue_NovB, pValue_NovB));
      console.log(nemOstalo);
    }
    nemB.push(...nemGl, ...nemSam, ...nemPrid, ...nemOstalo); // error // to samo ni v redu !!!!!!!!!!!!!!! ?????????????
    console.log(nemB);
  }

</script>
  
<style>

</style>

<!-- 

{#if nacin !== "način učenja"}
<nav>
  <div>
      <ul>
          <li><a href="#">Domov</a></li>
          <li><a href="#" on:click={() => {nacin = "default screen 2"}}>Učenje</a></li>
          <li><a href="#">Seznami</a></li>
          <li><a href="#">O nas</a></li>
          <li><a href="#">Credits</a></li>
          <li><a href="#">"tri črtice" (slikica)</a></li>
      </ul>
  </div>
</nav>
{/if} -->




<!-- LINKI ??????!?!!!!?!??!?!?!?!?!?!?!?!!!!!!!!!!!!!!  -->



{#if nacin === "dodaj besedo"}
<div>
  <p>beseda: </p> <input id="b-nrdNovB" type="text" bind:value={bValue_NovB} on:change={() => console.log(bValue_NovB)}>
  <p>prevod besede: </p> <input id="p-nrdNovB" type="text" bind:value={pValue_NovB}>
  <p>jezik: </p> <select name="" id="j-nrdNovB" bind:value={jValue_NovB}> <option value="nem">nem</option><option value="ang">ang</option> </select>
  <p>vrsta besede: </p> <select name="" id="vrsta-nrdNovB" bind:value={selectVrstaValue}> <option value="sam">samostalnik</option><option value="prid">pridevnik</option><option value="gl">glagol</option><option value="ostalo">drugo</option> </select>

  {#if selectVrstaValue === "sam"} <p>predlog: </p> <select name="" id="pr-nrdNovB" bind:value={selectPrValue} on:change={() => console.log(selectPrValue)}> <option value="der">der</option><option value="die">die</option><option value="das">das</option> </select> {/if}
  {#if selectVrstaValue === "sam"} <p>množina besede: </p> <input id="mn-nrdNovB" type="text" bind:value={mnValue_NovB}> {/if}


  {#if selectVrstaValue === "gl"} <p>glagol pravilen: </p> <input type="checkbox" name="" id="glPravilen-nrdNovB" bind:checked={selectGlPravilen}>
  <div>
    <p>spregatve glagolov: </p>
                
    <p>ich: </p> <input id="sprg-ich-sed" type="text" bind:value={sprg_ich_sedValue_NovB}>        <p> wir: </p> <input id="sprg-wir-sed" type="text" bind:value={sprg_wir_sedValue_NovB}>
    <p>du: </p> <input id="sprg-du-sed" type="text" bind:value={sprg_du_sedValue_NovB}>           <p> ihr: </p> <input id="sprg-ihr-sed" type="text" bind:value={sprg_ihr_sedValue_NovB}>
    <p>er, sie, es: </p> <input id="sprg-ese-sed" type="text" bind:value={sprg_ese_sedValue_NovB}><p> sie, Sie: </p> <input id="sprg-Ssie-sed" type="text" bind:value={sprg_Ssie_sedValue_NovB}>
  </div>
  {/if}
  {#if selectVrstaValue === "gl"} <p>perfekt: </p> <input id="perfekt-nrdNovB" type="text" bind:value={perfektValue_NovB}> {/if}

</div>

<button id="dokončajB" on:click={dokončajB}>Dodaj besedo v seznam</button>
<button on:click={() => {
  nacin = "končaj seznam";
  novSeznam = {
    ime: imeNovegaSeznama,
    besede: nemB,
  };
  
  // console.log(novSeznam);

  // naredi nov gumb (kako to narediš????????????!!!!!)

  // if(neki se zgodi) {skrij/pokaži nek element} - kako to narediš ???????!?!?!?!??!?!?!?!?!?!??!?!?!

  imeNovegaSeznama = "";
  novSeznam = [];

}}>Končaj seznam</button>
{/if}



{#if (nacin === "način učenja")}
  <button on:click={() => {
    nacin = "default screen 2"
  }}>Izhod iz načina učenja</button>
{/if}

{#if (nacin === "dodaj besedo")}
  <button on:click={() => {
  nacin = "default screen 2"
  }}>Zapri dodajalnik</button>
{/if}

{#if nacin === "default screen 2"}
  <button on:click={() => {
  nacin = "način učenja"
  }}>Način učenja</button>

  <button on:click={() => {
  nacin = "dodaj besedo"
  }}>Dodaj besedo</button>
{/if}






{#if nacin === "način učenja"}
<div>
  <input type="text" value="prevod">
  <select name="" id=""> <option value="der">der</option><option value="die">die</option><option value="das">das</option> </select>   <p>beseda</p>
  <input type="text" value="množina">
  <div>
    <p>ich: </p> <input id="sprg-ich-sed" type="text" >         <p> wir: </p> <input id="sprg-wir-sed" type="text" >
    <p>du: </p> <input id="sprg-du-sed" type="text" >           <p> ihr: </p> <input id="sprg-ihr-sed" type="text">
    <p>er, sie, es: </p> <input id="sprg-ese-sed" type="text">  <p> sie, Sie: </p> <input id="sprg-Ssie-sed" type="text">

  </div>
  <input type="text" value="perfekt">

  <button>Rešitev</button>
  <button>Naprej</button>

</div>
{/if}








<!-- loopati moram cel celoten seznam in zbrisati podvojene dele !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->



































 