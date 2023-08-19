<!-- <script lang="ts">
    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
</script>


<div>
    <Accordion>
        <Panel>
            <Header>Present</Header>
            <Content>
                <h2>Present Simple</h2>
                <p>Uporablja se za: </p>
                <ul>
                    <li>Navade, ponavljajoča dejanja in rutine</li>
                    <li>Splošne resnice</li>
                    <li>Urnike</li>
                    <li>Komentiranje in preglede športni dogodkov</li>
                    <li>Stalna stanja</li>    
                </ul>

                <h2>Present Continuous</h2>
                <p>Uporablja se za: </p>
                <ul>
                    <li>Akcije, ki se dogajajo v trenutku govorjenja ali okoli trenutka govorjenja</li>
                    <li>Preteklo dejanje, ki ima vidne posledice v sedanjosti</li>
                    <li>Preteklo dejanje, ki se je zgodilo ob neznanem času v preteklosti</li>
                    <li>Z besedami kot so <i>danes, danes zjutraj/popoldne/zvečer, ta teden/mesec</i> oz. z besedami, ki nakazujejo na čas, ki v trenutku govorjenja še ni zaključen</li>
                    <li>Ravno končana dejanja</li>    
                </ul>

                <h2>Present Perfekt (Simple)</h2>
                <p>Uporablja se za: </p>
                <ul>
                    <li>Dejanja, začeta v preteklosti, ki se nadaljujejo do sedanjosti</li>
                    <li></li>
                    <li>Začasna stanja</li>
                    <li>Spreminjajoče ali razvijajoče situacije</li>
                    <li>Ponavljajoča dejanja, posebej za izrazitev nadležnosti (annoyance) ali kritike</li>    
                </ul>
            
                <h2>Present Perfekt Continuous</h2>
                <p>Uporablja se za: </p>
                <ul>
                    <li>Poudarek na trajanju nekega dejanja, ki se je začelo v preteklosti in se nadaljuje do sedanjosti.</li>
                    <li>Dejanje, ki se je začlelo v preteklosti in je trajalo nekaj časa in ima vidne posledice v sedanjosti</li>
                </ul>


                // PREVERI IN POPRAVI VSE TO ZGORAJ !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 












                <h2>Past Simple</h2>
                <p>Uporablja se za: </p>
                <ul>
                    <li>Dejanja, začeta v preteklosti, ki se nadaljujejo do sedanjosti</li>
                    <li></li>
                    <li>Začasna stanja</li>
                    <li>Spreminjajoče ali razvijajoče situacije</li>
                    <li>Ponavljajoča dejanja, posebej za izrazitev nadležnosti (annoyance) ali kritike</li>    
                </ul>


            </Content>
        </Panel>
        <Panel>
            <Header>Past</Header>
            <Content>
              
              
            </Content>
        </Panel>
        <Panel>
            <Header>Future</Header>
            <Content>
              
              
            </Content>
        </Panel>
      </Accordion>
</div>



-->



<!--

<script lang="ts">
  
    let nacin = "default screen"; 
    let nacinUcenja = "";
    let nacinGumba = "preveri";
    let izbraniSeznam; 
    let pomožniSeznam; 
  
    let ucenjeZ1vrstoB = true;
    let ucenjeZ1vrstoB_vB = "sam";
  
    let ucenjeSed = false;
    let ucenjePret = false;
    let ucenjePerfekt = true;
  
    let ugPrevod = "";
    let ugPredlog = "";
    let ugMnožina = "";
    
    let ugPerfekt = "";
  
    let seznamNepravilnoUganjenihB = [];
    let sVB = []; // samo nek seznam za pomoč
  
  
  
    let bVS = 0;  // beseda v seznamu oz. številka katera beseda po vrsti v seznamu je to
  
    import Button, { Group, Label, Icon } from '@smui/button';
    import Select, { Option } from '@smui/select';
    import Textfield from '@smui/textfield';
    // import IconButton from '@smui/icon-button';
    
    import { navigate } from "svelte-navigator";
    
    import { skritNav } from '../stores.js';
  
    import * as data from "../data.js";
      import { element } from 'svelte/internal';
  
      import { makeRequest } from "../server";
  
  
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    }
  
  
    let f;
    let fd;
  
    let seznami = [];
  
    async function pridobiJavneSezname() {
      f = await makeRequest("/lists/public", "GET");
      
      for(let i = 0; i < f.data.length; i++) {
        if(f.data[i].jezik === "ang") seznami.push(f.data[i]);
      }
      // console.log(seznami);
    }
  
    async function pridobiZasebneSezname() {
      f = await makeRequest("/lists/my", "GET");
      if(f.data !== seznami) {
        for(let i = 0; i < f.data.length; i++) {
          if(f.data[i].jezik === "ang") seznami.push(f.data[i]);
        }

        pomožniSeznam = [...new Map(seznami.map(v => [v.id, v])).values()]; // jej, ta neki random program iz spleta deluje in se stvari ne podvajajo :) :) :) :) !!! - https://fullstackheroes.com/tutorials/javascript/5-ways-to-remove-duplicate-objects-from-array-based-on-property/ - VIR !!!!!!!! :) :) :) :) :) :) :) :) :) :) :)  !!!
        seznami = pomožniSeznam;

      }
    }
  
    pridobiJavneSezname();
    pridobiZasebneSezname();
  
    async function pridobiBesedeIzIzbranegaSeznama() {
      f = await makeRequest(`/list/${izbraniSeznam.id}`, "GET");
      izbraniSeznam = f.data;
  
      skritNav.update(trenutnaVrednostSpremenljivke => !trenutnaVrednostSpremenljivke);
      // ta skritNav pokaže ali skrije nav (to čisto zgoraj)
      shuffleArray(izbraniSeznam.words);
      sVB = izbraniSeznam.words;
      nacin = "način učenja";
    }
  
  
  </script>
  
  
  
  
  <div class="container">
    
  {#if izbraniSeznam !== undefined}
  
  
  {#if nacin === "način učenja"}
  <div class="nacin-ucenja">
  
    <div style="position: absolute; top: 5px; left: 5px;">
      <Button variant="raised" on:click={() => {
        skritNav.update(tVS => !tVS);
        navigate("/");
        }}>
        <Icon class="material-icons">home</Icon>
        <Label>Domov</Label>
      </Button>
    </div>
  
    {#if nacinGumba === "preveri"}
       <input type="text" bind:value={ugPrevod}> 
      <p>{izbraniSeznam.words[bVS].beseda}</p>  
    {/if}
    {#if nacinGumba === "resitev"}
      {#if ugPrevod === izbraniSeznam.words[bVS].prevod} 
      <p style="color: green;">{ugPrevod}</p> 
      {/if}
      {#if ugPrevod !== izbraniSeznam.words[bVS].prevod} 
      <p style="color: red;">{ugPrevod}</p> 
      {/if}
  
      <p>{izbraniSeznam.words[bVS].beseda}</p>
    {/if}
    {#if nacinGumba === "naprej"}
      <p style="color: green;">{izbraniSeznam.words[bVS].prevod}</p> 
      <p>{izbraniSeznam.words[bVS].beseda}</p>
    {/if}
  
  
  
  
  
  
  
  
  
    {#if ucenjeZ1vrstoB_vB === "sam"}
      {#if nacinGumba === "preveri"}
      <Select bind:value={ugPredlog}> <Option value="der">der</Option><Option value="die">die</Option><Option value="das">das</Option> </Select>   
      <input type="text" bind:value={ugMnožina}> 
      {/if}
      {#if nacinGumba === "resitev"}
        {#if ugPredlog === izbraniSeznam.words[bVS].predlog} 
        <p style="color: green;">{ugPredlog}</p> 
        {/if}
        {#if ugPredlog !== izbraniSeznam.words[bVS].predlog} 
        <p style="color: red;">{ugPredlog}</p> 
        {/if}
  
        {#if ugMnožina === izbraniSeznam.words[bVS].mn} 
        <p style="color: green;">{ugMnožina}</p> 
        {/if}
        {#if ugMnožina !== izbraniSeznam.words[bVS].mn} 
        <p style="color: red;">{ugMnožina}</p> 
        {/if}
      {/if}
      {#if nacinGumba === "naprej"}
        <p style="color: green;">{izbraniSeznam.words[bVS].predlog}</p> 
        <p style="color: green;">{izbraniSeznam.words[bVS].množina}</p> 
      {/if}
    {/if}
  
  
  
  
  
  
  
  
  
  
  
    {#if ucenjeZ1vrstoB_vB === "gl"}
      {#if ucenjeSed === true}
  
  
      {#if nacinGumba === "preveri"}
      <div>
        <p>ich: </p> <input type="text" bind:value={izbraniSeznam.words[bVS].beseda}>          <p> wir: </p> <input type="text" value={izbraniSeznam.words[bVS].beseda}>
        <p>du: </p> <input type="text" bind:value={izbraniSeznam.words[bVS].beseda}>           <p> ihr: </p> <input type="text" bind:value={izbraniSeznam.words[bVS].beseda}>
        <p>er, sie, es: </p> <input type="text" bind:value={izbraniSeznam.words[bVS].beseda}>  <p> sie, Sie: </p> <input type="text" value={izbraniSeznam.words[bVS].beseda}>
      </div>
      {/if}
      {#if nacinGumba === "resitev"}
        {#if ugPredlog === izbraniSeznam.words[bVS].predlog} 
        <p style="color: green;">{ugPredlog}</p> 
        {/if}
        {#if ugPredlog !== izbraniSeznam.words[bVS].predlog} 
        <p style="color: red;">{ugPredlog}</p> 
        {/if}
  
        {#if ugMnožina === izbraniSeznam.words[bVS].mn} 
        <p style="color: green;">{ugMnožina}</p> 
        {/if}
        {#if ugMnožina !== izbraniSeznam.words[bVS].mn} 
        <p style="color: red;">{ugMnožina}</p> 
        {/if}
      {/if}
      {#if nacinGumba === "naprej"}
        <p style="color: green;">{izbraniSeznam.words[bVS].predlog}</p> 
        <p style="color: green;">{izbraniSeznam.words[bVS].množina}</p> 
      {/if}
      {/if}
  
  
  
      {#if ucenjePerfekt === true} 
      
      {#if nacinGumba === "preveri"}
        <Textfield label="perfekt" bind:value={ugPerfekt}></Textfield>
      {/if}
      {#if nacinGumba === "resitev"}
        {#if ugPerfekt === izbraniSeznam.words[bVS].perfekt} 
        <p style="color: green;">{ugPerfekt}</p> 
        {/if}
        {#if ugPerfekt !== izbraniSeznam.words[bVS].perfekt} 
        <p style="color: red;">{ugPerfekt}</p> 
        {/if}
      {/if}
      {#if nacinGumba === "naprej"}
        <p style="color: green;">{izbraniSeznam.words[bVS].perfekt}</p> 
      {/if}    
      
      {/if}
  
  
  
  
    {/if}
  
  
  
  
  
  
  
      <br>
  
    <div class="nacin-ucenja-button">
    {#if nacinGumba === "preveri"}
    <Button style="margin-top: 15px;" touch variant="raised" on:click={() => {
      if(ugPerfekt === izbraniSeznam.words[bVS].perfekt) nacinGumba = "naprej"
      else {
        seznamNepravilnoUganjenihB.push(izbraniSeznam.words[bVS]);
        nacinGumba = "resitev" // preveri 
      }
    }}>Preveri</Button>
    {/if}
    {#if nacinGumba === "resitev"}
    <Button touch variant="raised" on:click={() => {
      nacinGumba = "naprej" // resitev
    }}>Rešitev</Button>
    {/if}
    {#if nacinGumba === "naprej"}
    <Button touch variant="raised" on:click={() => {
      nacinGumba = "preveri";  // naslednja beseda (naprej)
      bVS++;
  
      if(bVS >= izbraniSeznam.words.length) {
        if(seznamNepravilnoUganjenihB.length !== 0) {
          bVS = 0;
          izbraniSeznam.words = seznamNepravilnoUganjenihB;
          seznamNepravilnoUganjenihB = [];
        } else {
          izbraniSeznam.words = sVB;
          console.log(sVB);
        }
      }
      console.log(bVS);
    }}>Naprej</Button>
    {/if}
    </div>
  
  
  
    
  
    <Button style="position: absolute; top: 5px; right: 5px;" variant="raised" on:click={() => {
      nacin = "default screen"
      skritNav.update(trenutnaVrednostSpremenljivke => !trenutnaVrednostSpremenljivke);
    }}>Zapri</Button>
  
  </div>
  {/if}
  
  
  
  
  
  
  {/if}
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {#if nacin === "default screen"}
  <div style="display: flex; justify-content: center; align-items: center; width: 100%;">
    <p style="margin-right: 20px;">Izberi seznam: </p>
      <Select bind:value={izbraniSeznam}> 
      {#if seznami !== null}
      {#each seznami as seznam, i}
        <Option value={seznam}>{seznam.ime}</Option> 
      {/each}
      {/if}
    </Select>
  </div>
  
  <div class="big-break"></div>
  
  <div>
    <Group>
      {#if nacinUcenja !== "u_perfekt"}
      <Button variant="outlined" on:click={() => {
        ucenjeZ1vrstoB_vB = "gl";
        nacinUcenja = "u_perfekt";
      }}>Učenje perfekta</Button>
      {/if}
      {#if nacinUcenja === "u_perfekt"}
      <Button variant="raised" on:click={() => {
        nacinUcenja = "";
      }}>Učenje perfekta</Button>
      {/if}
  
      {#if nacinUcenja !== "u_sam"}
      <Button variant="outlined" on:click={() => {
        ucenjeZ1vrstoB_vB = "sam";
        nacinUcenja = "u_sam";
      }}>Učenje samostalnikov</Button>
      {/if}
      {#if nacinUcenja === "u_sam"}
      <Button variant="raised" on:click={() => {
        nacinUcenja = "";
      }}>Učenje samostalnikov</Button>
      {/if}
    </Group>
  </div>
  
  <div class="big-break"></div>
  
  <div>
  
  <Button on:click={() => {
    if(izbraniSeznam !== undefined && nacinUcenja !== "") {
      pridobiBesedeIzIzbranegaSeznama();
      // skritNav.update(trenutnaVrednostSpremenljivke => !trenutnaVrednostSpremenljivke);
      // // ta skritNav pokaže ali skrije nav (to čisto zgoraj)
      // console.log(izbraniSeznam);
      // shuffleArray(izbraniSeznam.words);
      // sVB = izbraniSeznam.words;
      // nacin = "način učenja";
    }
  }}>Način učenja</Button>
  </div>
  
  
  
  
  <!--

  {#if nacinUcenja === "nU"} 
  <input type="checkbox" bind:checked={ucenjeZ1vrstoB}>
  <p>Učenje samo: </p> 
  <Select bind:value={ucenjeZ1vrstoB_vB} on:change={() => console.log(ucenjeZ1vrstoB_vB)}> 
  <Option value="sam">samostalnikov</Option><Option value="gl">glagolov</Option><Option value="ostalo">ostalih vrst besed</Option> </Select> 
  
  {#if ucenjeZ1vrstoB === true}
  {#if ucenjeZ1vrstoB_vB === "gl"}
  <p>sedanjik: </p><input type="checkbox" bind:checked={ucenjeSed}>
  <p>preteklik: </p><input type="checkbox" bind:checked={ucenjePret}>
  <p>perfekt: </p><input type="checkbox" bind:checked={ucenjePerfekt}>
  
  {/if}
  {/if}
  
  
  {/if}


  -->

  
  <!--
  <Textfield label="Začni na: (številka)" bind:value={bVS}></Textfield>
  
  

  {/if}
  
  
  
  
  
  
  
  
  
  
  
  
  
   
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  </div>
  
  <style>
    button {
      margin: 10px;
    }
    p {
      font-size: 25px;
      text-align: center;
    }
    .container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
    }
  
    .nacin-ucenja .nacin-ucenja-button{
      display: flex;
      justify-content: center;
      align-items: center; 
    }
  
  </style>






-->


















































