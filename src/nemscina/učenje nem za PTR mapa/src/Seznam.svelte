<script lang="ts">
  import { makeRequest } from "./server";

  import Button from "@smui/button";
  import Textfield from "@smui/textfield";

  /*import { glagoli } from "./glagoli";*/



  export let id;

  let f;
  let fd;

  let seznam = null;

  async function naložiSeznam() {
    f = await makeRequest(`/list/${id}`, "GET");  
    seznam = f.data;
    if(seznam.words === undefined || seznam.words === null) seznam.words = [];
    // console.log(f.data);
    // console.log(seznam);
    // console.log(seznam.words);
  }

  naložiSeznam();


  let novSamText = "";
  let novGlText = "";
  let novOstaloText = "";
  let novBText;
  let novB;

  let gl_pravilen;


  async function dokončajBesedo(tipNoveB) { 

      if(tipNoveB === "gl" && novGlText !== "") {
        novBText = novGlText;
        // if (nemB.find(beseda => beseda.b === novB[1])) return <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<----------------------- DOKONČAJ ŠE TO; DA SE BESEDE NE PONAVLJAJO !!!!!!!!!! PRI VSEH TREH VRSTAH BESED !!!!!!!!!!!!!!!
        novB = novBText.split(" ");
        if(novB[2] === "j") gl_pravilen = true;

        fd = new FormData();
        fd.append("beseda", novB[1]); 
        fd.append("jezik", "nem"); 
        fd.append("prevod", novB[0]); 
        fd.append("tip", "gl"); 
        fd.append("list_id", id); 
        fd.append("pravilen", gl_pravilen); 
        fd.append("perfekt", novB[2]); 
        // fd.append("spregatev_sedanjik", novB[2]); <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<-----------------------------------------------------------

        f = await makeRequest("/words/new", "POST", fd);

      } else if(tipNoveB === "sam" && novSamText !== "") {
        novBText = novSamText;
        // if (nemB.find(beseda => beseda.b === novB[2])) return
        novB = novBText.split(" ");

        console.log(novB);
        
        fd = new FormData();
        fd.append("beseda", novB[2]); 
        fd.append("jezik", "nem"); 
        fd.append("prevod", novB[0]); 
        fd.append("tip", "sam"); 
        fd.append("list_id", id); 
        fd.append("predlog", novB[1]); 
        if(novB[3] !== undefined) {
          fd.append("mnozina", novB[3]); 
        }

        f = await makeRequest("/words/new", "POST", fd);


        
      } else if(tipNoveB === "ostalo" && novOstaloText !== "") {
        novBText = novOstaloText;
        // if (nemB.find(beseda => beseda.b === novB[1])) return <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<----------------------------------------------------
        novB = novBText.split(" ");
        
        fd = new FormData();
        fd.append("beseda", novB[1]); 
        fd.append("jezik", "nem"); 
        fd.append("prevod", novB[0]); 
        fd.append("tip", "ostalo"); 
        fd.append("list_id", id); 

        f = await makeRequest("/words/new", "POST", fd);
      }
      novBText = "";

      naložiSeznam();
      console.log("HI");


  } 

</script>

<style>
p {
  margin: 0;
  width: fit-content;
}
</style>

<!--
<button on:click={async () => {
  for(let i = 0; i < glagoli.elementi.length; i++) {

    fd = new FormData();
    fd.append("beseda", glagoli.elementi[i].b); 
    fd.append("prevod", glagoli.elementi[i].prevod); 
    fd.append("pravilen", false); 
    fd.append("perfekt", glagoli.elementi[i].perfekt);
    fd.append("spregatev_sedanjik", glagoli.elementi[i].sedanjik);
    fd.append("jezik", "nem");
    fd.append("list_id", id);
    fd.append("tip", "gl");

    f = await makeRequest("/words/new", "POST", fd)
  }
}}>Začni botati</button>-->




<div style="margin-left: 10px;">


  {#if seznam !== null}

<h2>Ime seznama: {seznam.ime}</h2>
<h3>Lastnik: {seznam.user_name}</h3>
{#if seznam.zaseben === true}
<h3>Seznam je v zasebni lasti</h3>
{/if}
{#if seznam.zaseben === false}
<h3>Seznam je v javni lasti</h3>
{/if}




<div class="big-break"></div>

<h3 style="margin: 0;">Dodaj novo besedo</h3>

<div class="medium-break"></div>

<div>  <!-- label="samostalnik" label="glagol" label="drugo"-->
  <table>
    <tr>
      <td><h3 style="width: fit-content;margin-right: 10px;">samostalnik: </h3></td> 
      <td><Textfield bind:value={novSamText}></Textfield></td> 
      <td><Button on:click={() => dokončajBesedo("sam")}>Dodaj samostalnik</Button></td>
    </tr>
    <tr>
      <td><h3 style="width: fit-content;margin-right: 10px;">glagol: </h3></td> 
      <td><Textfield bind:value={novGlText}></Textfield></td>
      <td><Button on:click={() => dokončajBesedo("gl")}>Dodaj glagol</Button></td>
    </tr>
    <tr>
      <td><h3 style="width: fit-content;margin-right: 10px;">drugo: </h3></td> 
      <td><Textfield bind:value={novOstaloText}></Textfield></td>
      <td><Button on:click={() => dokončajBesedo("ostalo")}>Dodaj drugo besedno vrsto</Button></td>
    </tr>
  </table>
</div>


<div class="big-break"></div>






<h3>Besede v seznamu: </h3>

{#if seznam.zaseben === true || (seznam.zaseben === false && localStorage.getItem("isAdmin") === "true")}
<tr>
  <th>Beseda</th>
  <th>Uredi besedo</th>
  <th>Izbriši besedo</th>
</tr>
{/if}

{#if seznam.words.length !== 0}
{#each seznam.words as beseda}
<tr>
  <td style="display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;"><p>{beseda.beseda}</p></td>
  {#if seznam.zaseben === true || (seznam.zaseben === false && localStorage.getItem("isAdmin") === "true")}
  <td><button>Uredi besedo</button></td>
  <td><button on:click={async () => {
    console.log(beseda.id);

    f = await makeRequest(`/word/${beseda.id}`, "DELETE");
    naložiSeznam();

  }}>Izbriši besedo</button></td>
  {/if}
</tr>
{/each}
{/if}

{/if}

</div>