<script lang="ts">
    import { dataset_dev, element } from "svelte/internal";

    import Accordion, { Panel, Header, Content } from '@smui-extra/accordion';
    import Button, { Icon, Label } from '@smui/button';
    import Select, { Option } from '@smui/select';
    import Textfield from '@smui/textfield';
    import LayoutGrid, { Cell } from '@smui/layout-grid';

    import * as data from "./data.js";


    import { makeRequest } from "./server.js";
    import { navigate } from "svelte-navigator";
    import InnerGrid from "@smui/layout-grid/src/InnerGrid.svelte";

  let nacin = "seznami-default"; 

  let seznamZaseben = true;

  let fd;
  let f;

  let javniSeznami = [];
  let zasebniSeznami = [];


  async function narediDefaultSezname() {
    fd = new FormData();
    fd.append("ime", "nemB"); 
    fd.append("zaseben", false); 

    f = await makeRequest("/lists/new", "POST", fd);
  }

  // narediDefaultSezname();

  async function naložiUporabnikoveSezname() {
    f = await makeRequest("/lists/my", "GET");
    zasebniSeznami = f.data;
  }

  naložiUporabnikoveSezname();

  async function naložiJavneSezname() {
    f = await makeRequest("/lists/public", "GET");
    javniSeznami = f.data;
  }

  naložiJavneSezname();




  let bValue_NovB = "";
  let mnValue_NovB = "";
  let jValue_NovB = "nem"; 
  let pValue_NovB = ""; 
  let selectGlPravilen = true; 
  let perfektValue_NovB = "";
  let sprg_ich_sedValue_NovB = "";  
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

  let novBText;
  let novB = [];

  let gl_pravilen;

  let id_seznama; 
  let id_besede; 

  let imeNovegaSeznama = "";

  let nemB = [];

  for(let i = 0; i < data.seznami.length; i++) {
    nemB = [...nemB, ...data.seznami[i].elementi]
  }


  /*

  class Seznam {
    constructor(ime, elementi, dostopnost) {
      this.ime = ime;
      this.elementi = elementi;
      this.dostopnost = dostopnost;
    }
  }

  class NemGl {
    constructor(b, j, p, pravilen, sprgSed, perfekt ) {
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

  */


  async function dokončajBesedo(tipNoveB) { 
    if(novBText !== "") {
      if(tipNoveB === "gl") {
        novBText = novGlText;
        if (nemB.find(beseda => beseda.b === novB[1])) return
        novB = novBText.split(" ");
        if(novB[2] === "j") gl_pravilen = true;

        fd = new FormData();
        fd.append("beseda", novB[1]); 
        fd.append("jezik", "nem"); 
        fd.append("prevod", novB[0]); 
        fd.append("tip", "gl"); 
        fd.append("list_id", "nemB"); 
        fd.append("pravilen", gl_pravilen); 
        fd.append("perfekt", novB[2]); 
        // fd.append("spregatev_sedanjik", novB[2]); 

        f = await makeRequest("/words/new", "POST", fd);

      } else if(tipNoveB === "sam") {
        novBText = novSamText;
        if (nemB.find(beseda => beseda.b === novB[2])) return
        novB = novBText.split(" ");

        console.log(novB);
        
        fd = new FormData();
        fd.append("beseda", novB[2]); 
        fd.append("jezik", "nem"); 
        fd.append("prevod", novB[0]); 
        fd.append("tip", "sam"); 
        fd.append("list_id", "nemB"); 
        fd.append("predlog", novB[1]); 
        if(novB[3] !== undefined) {
          fd.append("mnozina", novB[3]); 
        }

        f = await makeRequest("/words/new", "POST", fd);


        
      } else if(tipNoveB === "ostalo") {
        novBText = novOstaloText;
        if (nemB.find(beseda => beseda.b === novB[1])) return
        novB = novBText.split(" ");
        
        fd = new FormData();
        fd.append("beseda", novB[1]); 
        fd.append("jezik", "nem"); 
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
  h3 {
    margin-left: 10px;
  }
</style>


<Accordion>
  <!--<Panel>
    <Header>Dodaj novo besedo</Header>
    <Content>
      <div>
        <p>samostalnik: </p> <Textfield bind:value={novSamText}></Textfield>
        <Button on:click={() => dokončajBesedo("sam")}>Dodaj samostalnik</Button>
        <p>glagol: </p> <Textfield bind:value={novGlText}></Textfield>
        <Button on:click={() => dokončajBesedo("gl")}>Dodaj glagol</Button>
        <p>drugo: </p> <Textfield bind:value={novOstaloText}></Textfield>
        <Button on:click={() => dokončajBesedo("ostalo")}>Dodaj drugo besedno vrsto</Button>
      </div>
    </Content>
  </Panel>-->
  
  <Panel>
    <Header>Dodaj nov seznam</Header>
    <Content>
      <div>
        <p>Ime seznama: </p><Textfield bind:value={imeNovegaSeznama}></Textfield>

        {#if localStorage.getItem("isAdmin") === "true"}
        {#if seznamZaseben === true}
        <Button variant="raised" on:click = {() => {seznamZaseben = false}}>
          <Label>Ustvari javen seznam</Label>
        </Button>
        {/if}
        {#if seznamZaseben === false}
        <Button variant="raised" on:click = {() => {seznamZaseben = true}}>
          <Label>Ustvari zaseben seznam</Label>
        </Button>
        {/if}
        {/if}
        <Button variant="raised" on:click={async () => {
          if (imeNovegaSeznama !== "") { 

            fd = new FormData();
            fd.append("ime", imeNovegaSeznama); 
            console.log(imeNovegaSeznama);
            
            if(localStorage.getItem("isAdmin") === "true") fd.append("zaseben", seznamZaseben); 
            else fd.append("zaseben", true); 

            fd.append("jezik", "nem"); 


            f = await makeRequest("/lists/new", "POST", fd);

            await naložiUporabnikoveSezname();
            await naložiJavneSezname();

          }
        }}>Dodaj seznam</Button>
      </div>
    </Content>
  </Panel>

<!--
  {#each zasebniSeznami as seznam, i}
    <Panel>
      <Header>{seznam.ime}</Header>
      <Content>

        {#if seznam.dostopnost === "zasebno"}
        <div> 
          
          <Button on:click={async () => {         
            fd = new FormData();
            fd.append("ime", seznam.ime); 
            fd.append("zaseben", true); 

            f = await makeRequest(`/lists/${id_seznama}`, "PATCH", fd);
            }}>
            <Label>Spremeni ime seznama</Label>
          </Button>

          <Button on:click={async () => {
            f = await makeRequest(`/lists/${id_seznama}`, "DELETE", fd);
          }}>
            <Label>Izbriši seznam</Label>
          </Button>
          
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
                  seznam.elementi.push(beseda); 
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
        </div>
        {/if}
      </Content>
    </Panel>
  {/each}

  {#each javniSeznami as seznam, i}
    <Panel>
      <Content>
        <table>
          <tr>
            <th>Seznam besed</th>
          </tr>
          {#each seznam.words as beseda}
          <tr>
            <td  style="text-align: center;">{beseda.b}</td>
          </tr>
          {/each}
        </table> 
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
            <td style="text-align: center;">{beseda.b}</td>
            <td>
              <Textfield bind:value={beseda.b}></Textfield>
              <Textfield bind:value={beseda.prevod}></Textfield>
            </td>
          </tr>
          {/each}
        </table> 
      </div>
    </Content>
  </Panel> -->
</Accordion> 

<h3>Javni seznami</h3>
<LayoutGrid>
    {#each javniSeznami as seznam}
        <Cell>
            <div class="demo-cell">
                <div style="margin: 0 10px 10px">
                    <h3>{seznam.ime}</h3>
                    <div class="break" />
                    Lastnik: <b>{seznam.user_name}</b>
                    <div class="break" />
                    {#if seznam.zaseben === true}
                    <p>Seznam je v zasebni lasti</p>
                    {/if}
                    {#if seznam.zaseben === false}
                    <p>Seznam je v javni lasti</p>
                    {/if}
                    <div class="big-break" />

                        <Button on:click={() => navigate(`/seznam/${seznam.id}`)} variant="raised">
                            <Icon class="material-icons">book</Icon>
                            <Label>Preberi več</Label>
                        </Button>
                        <div class="break" />

                        {#if localStorage.getItem("isAdmin") === "true"}
                        <Button on:click={async () => {
                          f = await makeRequest(`/list/${seznam.id}`, "DELETE");
                          await naložiJavneSezname();
                          await naložiUporabnikoveSezname();
                        }} variant="raised">
                          <Icon class="material-icons">delete</Icon>
                          <Label>Izbriši seznam</Label>
                      </Button>
                      {/if}
                      <div class="break" />
              
                </div>
            </div>
        </Cell>
    {/each}
</LayoutGrid>

<h3>Moji seznami</h3>
<LayoutGrid>
    {#each zasebniSeznami as seznam}
        <Cell>
            <div class="demo-cell">
                <div style="margin: 0 10px 10px">
                    <h3>{seznam.ime}</h3>
                    <div class="break" />
                    Lastnik: <b>{seznam.user_name}</b>
                    <div class="break" />
                    {#if seznam.zaseben === true}
                    <p>Seznam je v zasebni lasti</p>
                    {/if}
                    {#if seznam.zaseben === false}
                    <p>Seznam je v javni lasti</p>
                    {/if}
                    <div class="big-break" />

                        <Button on:click={() => navigate(`/seznam/${seznam.id}`)} variant="raised">
                            <Icon class="material-icons">book</Icon>
                            <Label>Preberi več</Label>
                        </Button>
                        <div class="break" />
                        <Button on:click={async () => {
                          f = await makeRequest(`/list/${seznam.id}`, "DELETE");
                          await naložiUporabnikoveSezname();
                          await naložiJavneSezname();
                        }} variant="raised">
                          <Icon class="material-icons">delete</Icon>
                          <Label>Izbriši seznam</Label>
                      </Button>
                      <div class="break" />
              
                </div>
            </div>
        </Cell>
    {/each}
</LayoutGrid>





