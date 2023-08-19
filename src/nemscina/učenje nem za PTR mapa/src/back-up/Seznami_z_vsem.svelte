<script lang="ts">
    import { dataset_dev, element } from "svelte/internal";

    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Label } from '@smui/button';
    import Select, { Option } from '@smui/select';
    import Textfield from '@smui/textfield';

    import * as data from "../data.js";


    import { makeRequest } from "../server.js";

  let nacin = "seznami-default"; 
  // default screen je home screen
  // default screen 2 je podstran za učenje
  // nacin učenja je podpodstran za učenje/ponavljanje stvari
  // dodaj besdo je podpodstran za dodajanje besed

  let fd;
  let f;


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
  let novSamText = "";
  let novGlText = "";
  let novOstaloText = "";
  /*let novSamB = [];
  let novGlB = [];
  let novOstaloB = [];*/
  let tipNoveB; 
  let novBText;
  let novB;

  let gl_pravilen;

  let id_seznama; 
  let id_besede; 

  let imeNovegaSeznama = "";
  // seznami so importani iz data.js
  let trenutniSeznam = [];


  const sprg_sed = [];

  let nemGl = [];
  let nemSam = [];
  let nemOstalo = [];
  let nemB = [];

  class Seznam {
    constructor(ime, elementi, dostopnost) {
      this.ime = ime;
      this.elementi = elementi;
      this.dostopnost = dostopnost;
    }
  }

  class NemGl {
    b: string;      // to na začetku neki nrdi da ne teži z errori, Mitja že ve kaj
    jezik: string;  // to je ker moraš definirati vse tipe spremenljivk v TypeScriptu in ti teži, ampak JS to briga, zato ne vpliva na program
    prevod: string; 
    pravilen: boolean;
    sprgSed: string[];  
    perfekt: string;
    tip: string;

    constructor(b, j, p, pravilen, /*sprgSed,*/ perfekt ) {
      this.b = b;
      this.jezik = j;
      this.prevod = p;
      this.pravilen = pravilen;
      // this.sprgSed = sprgSed;  // Array
      this.perfekt = perfekt;
      this.tip = "gl";

    }
  }

  class NemSam {
    constructor(b, j, p, pr, mn) {
    this.b = b;
    this.jezik = j;
    this.prevod = p;
    this.predlog = pr;
    this.mn = mn;
    this.tip = "sam";
    }
  }

  class NemOstalo {
    constructor(b, j, p) {
      this.b = b;
      this.jezik = j;
      this.prevod = p; 
      this.tip = "ostalo";
    }
  }

  /*function dokončajB() {  
    if (nemB.find(beseda => beseda.b === bValue_NovB)) {  // :):):):):):):):):):) - to deluje, da se ne podvajao stvari :):):):):)::):):):)
      return
    }

    
    if(selectVrstaValue === "sam") {
      nemSam.push(new NemSam(bValue_NovB, jValue_NovB, pValue_NovB, selectPrValue, mnValue_NovB));
      // console.log(nemSam);
    } else if(selectVrstaValue === "gl") {
      sprg_sed.push(sprg_ich_sedValue_NovB, sprg_du_sedValue_NovB, sprg_ese_sedValue_NovB, sprg_wir_sedValue_NovB, sprg_ihr_sedValue_NovB, sprg_Ssie_sedValue_NovB);
      nemGl.push(new NemGl(bValue_NovB, jValue_NovB, pValue_NovB, selectGlPravilen, sprg_sed, perfektValue_NovB));
      // console.log(nemGl);
    } else if(selectVrstaValue === "prid") {
      nemPrid.push(new NemPrid(bValue_NovB, jValue_NovB, pValue_NovB, ));
      // console.log(nemPrid);
    } else {
      nemOstalo.push(new NemOstalo(bValue_NovB, jValue_NovB, pValue_NovB));
      // console.log(nemOstalo));
    }
    

    nemB = [];
    nemB.push(...nemGl, ...nemSam, ...nemPrid, ...nemOstalo); // error // to samo ni v redu !!!!!!!!!!!!!!! ?????????????
    console.log(nemB);
    
  }*/


  /*
  async function dokončajBesedo() { // ------------------------------------<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    if(novSamText !== "") {
      novSamB = novSamText.split(" ");
      if (nemB.find(beseda => beseda.b === novSamB[2])) {  // :):):):):):):):):):) - to deluje, da se ne podvajao stvari :):):):):)::):):):)
        return
      }

      fd = new FormData();
      fd.append("beseda", novSamB[2]); 
      fd.append("jezik", ""); 
      fd.append("prevod", novSamB[2]); 
      fd.append("tip", novSamB[2]); 
      fd.append("list_id", novSamB[2]); 
      fd.append("predlog", novSamB[2]); 
      fd.append("mnozina", novSamB[2]); 
      fd.append("pravilen", novSamB[2]); 
      fd.append("spregatev_sedanjik", novSamB[2]); 
      fd.append("perfekt", novSamB[2]); 

      nemSam.push(new NemSam(novSamB[2], data.jezik, novSamB[0], novSamB[1], novSamB[3]));
      
      f = await makeRequest("/words/new", "POST", fd);
      novSamText = "";

    } else if(novGlText !== "") {
      novGlB = novGlText.split(" ");
      if (nemB.find(beseda => beseda.b === novGlB[1])) {  // :):):):):):):):):):) - to deluje, da se ne podvajao stvari :):):):):)::):):):)
        return
      }
      nemGl.push(new NemGl(novGlB[1], data.jezik, novGlB[0], novGlB[2]));
      novGlText = "";
    } else {
      novOstaloB = novOstaloText.split(" ");
      if (nemB.find(beseda => beseda.b === novOstaloB[1])) {  // :):):):):):):):):):) - to deluje, da se ne podvajao stvari :):):):):)::):):):)
        return
      }
      nemOstalo.push(new NemOstalo(novOstaloB[1], data.jezik, novOstaloB[0]));
      novOstaloText = "";
    }
    nemB = [];  nemB.push(...nemSam, ...nemGl, ...nemOstalo); 
    console.log(nemB);  
  }

  */

  async function dokončajBesedo(tipNoveB) { // ------------------------------------<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
    if(novBText !== "") {
      if(tipNoveB === "gl") {
        novBText = novGlText;
        if (nemB.find(beseda => beseda.b === novB[1])) return
        novB = novBText.split(" ");
        if(novB[2] === "j") gl_pravilen = true;

        fd = new FormData();
        fd.append("beseda", novB[1]); 
        fd.append("jezik", ""); 
        fd.append("prevod", novB[0]); 
        fd.append("tip", "gl"); 
        fd.append("list_id", "nemB"); 
        fd.append("pravilen", gl_pravilen); 
        fd.append("perfekt", novB[3]); 
        // fd.append("spregatev_sedanjik", novSamB[2]); 

        f = await makeRequest("/words/new", "POST", fd);

      } else if(tipNoveB === "sam") {
        novBText = novSamText;
        if (nemB.find(beseda => beseda.b === novB[2])) return
        
        fd = new FormData();
        fd.append("beseda", novB[2]); 
        fd.append("jezik", ""); 
        fd.append("prevod", novB[0]); 
        fd.append("tip", "sam"); 
        fd.append("list_id", "nemB"); 
        fd.append("predlog", novB[1]); 
        fd.append("mnozina", novB[3]); 

        f = await makeRequest("/words/new", "POST", fd);
        
      } else if(tipNoveB === "ostalo") {
        novBText = novOstaloText;
        if (nemB.find(beseda => beseda.b === novB[1])) return
        
        fd = new FormData();
        fd.append("beseda", novB[1]); 
        fd.append("jezik", ""); 
        fd.append("prevod", novB[0]); 
        fd.append("tip", "ostalo"); 
        fd.append("list_id", "nemB"); 

        f = await makeRequest("/words/new", "POST", fd);
      }
      novBText = "";
    } else return  // naredi za tu kaj drugega !!!!!!!!!!!!!

  } 


</script>
  
<style>

</style>


<!--
{#if nacin === "dodaj besedo"}

<button on:click={() => nacin = "seznami-default"}>X</button>

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

<button id="dokončajB" on:click={dokončajB}>Dodaj besedo</button>
{/if}
-->

<!--
{#if nacin === "dodaj seznam"}

<p>Ime seznama: </p><input type="text" bind:value={imeNovegaSeznama}>
<button on:click={() => {
  seznami.push(new Seznam(imeNovegaSeznama, []));
  imeNovegaSeznama = "";

  // console.log(seznami);
  // console.log(imeNovegaSeznama);
  nacin = "seznami-default"
}}>Dodaj seznam</button>

{/if}
-->

<!--
{#if nacin === "seznami-default"}     
-->

<!--
<button on:click={() => {
  nacin = "dodaj besedo"
}}>Dodaj novo besedo</button> 
-->

<!-- SEZNAMI !!! -->

<Accordion>
  <Panel>
    <Header>Dodaj novo besedo</Header>
    <Content>
      <div>
        <!--
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
        -->

        <p>samostalnik: </p> <Textfield bind:value={novSamText}></Textfield>
        <Button on:click={() => dokončajBesedo("sam")}>Dodaj samostalnik</Button>
        <p>glagol: </p> <Textfield bind:value={novGlText}></Textfield>
        <Button on:click={() => dokončajBesedo("gl")}>Dodaj glagol</Button>
        <p>drugo: </p> <Textfield bind:value={novOstaloText}></Textfield>
        <Button on:click={() => dokončajBesedo("ostalo")}>Dodaj drugo besedno vrsto</Button>


        <!-- tega gumba dokončajB se ne sme izbrisati !!!!!!!!!!!! 
        <button id="dokončajB" on:click={dokončajB}>Dodaj besedo</button> -->
      </div>
    </Content>
  </Panel>
  
  <Panel>
    <Header>Dodaj nov seznam</Header>
    <Content>
      <div>
        <p>Ime seznama: </p><Textfield bind:value={imeNovegaSeznama}></Textfield>
        <Button on:click={async () => {
          if (data.seznami.find(seznam => seznam.ime === imeNovegaSeznama)) return
          if (imeNovegaSeznama !== "") { 
            
            fd = new FormData();
            fd.append("ime", imeNovegaSeznama); 
            fd.append("zaseben", true); 

            f = await makeRequest("/lists/new", "POST", fd);

            imeNovegaSeznama = "";
            data.seznami = data.seznami;
          }
        }}>Dodaj seznam</Button>
      </div>
    </Content>
  </Panel>


  {#each data.seznami as seznam, i}
    <Panel>
      <Header>{seznam.ime}</Header>
      <Content>

        {#if seznam.dostopnost === "zasebno"}
        <div> <!--    <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-------------------------------------------------------------------------      -->
          
          <Button on:click={async () => {         
            fd = new FormData();
            fd.append("ime", seznam.ime); 
            fd.append("zaseben", true); 

            f = await makeRequest(`/lists/${id_seznama}`, "PATCH", fd);
            }}>
            <Label>Spremeni ime seznama</Label>
          </Button>
          
          <!--{#if nacin === "spremeni ime seznama"}
          <Button on:click={() => nacin = "default screen"}>
            <Label>Zapri</Label>
          </Button>
          {/if}-->

          <!--  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<----------------------------------------------- to bo Mitja še uredil !!! -->
          <!--<Button on:click={async () => {
            fd = new FormData();
            fd.append("ime", seznam.ime); 
            fd.append("zaseben", true); 

            f = await makeRequest(`/lists/${id_seznama}`, "PATCH", fd);
            }}>
            <Label>Dodaj besedo</Label>
          </Button>
          -->

          <!--
          {#if nacin === "dodaj besedo iz seznama vseh besed"}
          <Button on:click={() => nacin = "default screen"}>
            <Label>Zapri</Label>
          </Button>
          {/if}-->

          <Button on:click={async () => {
            f = await makeRequest(`/lists/${id_seznama}`, "DELETE", fd);
            /*for(let i=0; data.seznami.length; i++){
              if(data.seznami[i].ime === seznam.ime){
                data.seznami.splice(i);
                console.log(data.seznami);
                data.seznami=data.seznami;
              }
            }*/
          }}>
            <Label>Izbriši seznam</Label>
          </Button>

          <!--{#if nacin === "spremeni ime seznama"}
          <p>Novo ime seznama: </p><Textfield bind:value={seznam.ime}></Textfield>
          <!- kako narediti da se imena seznamov ne morejo podvajati ???????????!!!!!!!!!! ->
          {/if}-->

          
          {#if nacin === "dodaj besedo iz seznama vseh besed"}

          <table>
            <tr>
              <th>Beseda</th>
              <th>Dodaj besedo</th>
            </tr>
            {#each nemB as beseda, i}
            <tr>
              <td>{beseda.b}</td>
              <td>
                <Button on:click={() => {
                  seznam.elementi.push(beseda); // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<---------------------------------------------   to bo Mitja še uredil !!!
                  data.seznami = data.seznami;
                  console.log(data.seznami, seznam, nemB);
                }}>Dodaj</Button>
              </td>
            </tr>
            {/each}
          </table> 

          {/if}


          <Accordion>
            <Panel>
              <Header>Uredi besede v seznamu</Header>
              <Content>
                <table>
                  <tr>
                    <th>Beseda</th>
                    <th>Uredi besedo</th>
                  </tr>
                  {#each seznam.elementi as beseda, i}
                  <tr>
                    <td>{beseda.b}</td>
                    <td>
                      <Button on:click={async () => {  
                        fd = new FormData();
                        fd.append("beseda", beseda.b); 
                        fd.append("prevod", beseda.prevod); 
                        if(beseda.tip === "sam") {
                          fd.append("predlog", beseda.predlog); 
                          fd.append("mnozina", beseda.mn); 
                        } 
                        if(beseda.tip === "gl") {
                          fd.append("pravilen", beseda.pravilen); 
                          fd.append("perfekt", beseda.perfekt);
                          // fd.append("spregatev_sedanjik", beseda.sprgSed);
                        }

                        f = await makeRequest(`/word/${id_besede}`, "PATCH", fd);
                      }}>Uredi</Button>
                    </td>
                  </tr>
                  {/each}
                </table> 
              </Content>
            </Panel>
          </Accordion>


          <!-- <Button on:click={() => }>
            <Label>Izbriši seznam</Label>
          </Button>
           <Button on:click={() => } disabled>
            <Label>Disabled</Label>
          </Button>
          <Button on:click={() => } ripple={false}>
            <Label>No Ripple</Label>
          </Button> -->
        </div>
        {/if}

        {#if seznam.dostopnost === "javno"}
        <table>
          <tr>
            <th>Seznam besed</th>
          </tr>
          {#each seznam.elementi as beseda}
          <tr>
            <td>{beseda.b}</td>
          </tr>
          {/each}
        </table> 
        {/if}

      </Content>
    </Panel>
  {/each}

  <Panel>
    <Header>Seznam vseh besed</Header>
    <Content>
      <div>      
        <table>
          <tr>
            <th>Beseda</th>
            <th>Uredi besedo</th>
          </tr>
          {#each nemB as beseda}
          <tr>
            <td>{beseda.b}</td>
            <td>
              <Textfield bind:value={beseda.prevod}></Textfield>
              <Textfield bind:value={beseda.b}></Textfield>
            </td>
          </tr>
          {/each}
        </table> 
      </div>
    </Content>
  </Panel>
</Accordion>

<!--
<button on:click={() => {
  nacin = "dodaj seznam"
}}>Dodaj nov seznam</button> 

<button on:click={() => {
  nacin = "uredi seznam vseh besed";
}}>Seznam vseh besed</button> 
-->

<!--
{/if}    
-->

<!--
{#if nacin === "uredi seznam vseh besed"}

<button on:click={() => {
  nacin = "seznami-default";
}}>Zapri seznam vseh besed</button> 

<table>
  <tr>
    <th>Beseda</th>
    <th>Uredi besedo</th>
  </tr>
  {#each nemB as beseda, i}
  <tr>
    <td>{beseda.b}</td>
    <td>
      <button on:click={() => {
        // pač urediš vse možno na neki besedi tukaj
      }}>Uredi</button>
    </td>
  </tr>
  {/each}
</table> 

{/if}
-->














<!--


<Button on:click={() => nacin = "spremeni ime seznama"}>
  <Label>Spremeni ime seznama</Label>
</Button>
<Button on:click={() => {
  nacin = "dodaj besedo iz seznama vseh besed";
  trenutniSeznam = seznam.elementi;
  }}>
  <Label>Dodaj besedo iz seznama vseh besed</Label>
</Button>
<Button on:click={() => nacin = "izbriši seznam"}>
  <Label>Izbriši seznam</Label>
</Button>


-->








