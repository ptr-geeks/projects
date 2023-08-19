<script>
  import { Router, Link, Route } from "svelte-navigator";
  import Main from "./Main.svelte";
  import Seznami from "./Seznami.svelte";
  import Ucenje from "./Ucenje.svelte";
  import Besedila from "./Besedila.svelte";
  import O_programu from "./O_programu.svelte";
  import Login from "./Login.svelte";
  import Register from "./Register.svelte";
  import Seznam from "./Seznam.svelte";
  import Account from "./Account.svelte";


  import UcenjeAng from "./ang/Ucenje.svelte";
// itd. dodajaš importe za svoje strani (glej imena datotek)
// import MojePoljubnoImeStrani from "./ImeDatoteke.svelte";
// seveda mora biti .svelte datoteka locirana v isti mapi kot App.svelte, drugače boš moral spremeniti tudi lokacijo datoteke, npr.
// import MojePoljubnoImeStrani from "./poddirektorij/ImeDatoteke.svelte";

  import { skritNav, skritAngNav } from './stores.js';
  import { dataset_dev } from "svelte/internal";

  import { navigate } from "svelte-navigator";
  // import GumbKiSkrijeNav from './GumbKiSkrijeNav.svelte';

  import Select, { Option } from '@smui/select';
  import IconButton from '@smui/icon-button';
  import TopAppBar, { Row, Section, Title, AutoAdjust } from '@smui/top-app-bar';
  import Icon from '@smui/select/icon';

  let jezik = "nem"; 
  let topAppBar;
  

</script>

<Router>
  {#if !($skritNav)}
    <nav class="main-navbar">
      <div class="container">
          <Link to="/">Domov</Link>
          {#if jezik === "nem"}<Link to="/seznami">Seznami</Link>{/if}
          {#if jezik === "nem"}<Link to="/ucenje">Učenje</Link>{/if}
          {#if jezik === "ang"}<Link to="/ang/ucenje">Učenje</Link>{/if}
          {#if jezik === "nem"}<Link to="/besedila">Besedila</Link>{/if}
          <Link to="/o_programu">O programu</Link>

          <Select style="margin-left: 15px; font-size: 50px" variant="outlined" bind:value={jezik}>
          <Option style="font-size: 50px" value="nem">🇩🇪</Option>
          <!--<Option style="font-size: 50px" value="ang">🇬🇧</Option>
          --></Select>

          <IconButton style="margin: 0;" class="material-icons" aria-hidden="true" on:click={() => {
						localStorage.clear();
						navigate("/login");
					}}>
            <div style="margin: 0 0 0 0.1em;">logout</div>
					</IconButton>
          <IconButton style="margin: 0;" class="material-icons" aria-hidden="true" on:click={() => {
						navigate("/account");
					}}>
            <div style="margin: 0 0 0 0.1em;">settings</div>
          </IconButton>
      </div>
    
      <!--
     itn. dodajaš povezave do svojih strani v stilu nečesa takega
        <Link to="/url/do/tvoje/strani">Kaj želiš, da se prikaže</Link>
    Seveda, če boš kasneje preklopil na drug dizajnerski jezik, boš moral odstraniti ta del, saj se ne sklada/ujema z dizajnerskim jezikom tvoje izbire, ampak za zdaj je dovolj dobro.
      -->
    </nav>
  {/if}

  

  <div>
    <Route path="/seznami"><Seznami /></Route>
    <Route path="/ucenje"><Ucenje /></Route>
    <Route path="/besedila"><Besedila /></Route>
    <Route path="/o_programu"><O_programu /></Route>
    <Route path="/login"><Login /></Route>
    <Route path="/register"><Register /></Route>
    <Route path="/seznam/:id" let:params><Seznam id={params.id} /></Route>
    <Route path="/account"><Account /></Route>

    <Route path="/"><Main /></Route>

    <!-- ang podstrani -->
    <Route path="/ang/ucenje"><UcenjeAng /></Route>
      
    <!--
          tukaj notri dejansko definiraš, katere podstrani imaš na voljo.
          Takoj ko boš dodal novo podstran, jo moraš tudi tukaj definirati, drugače je ne bo sam od sebe pobral.
          Seveda je ta trenuten način zelo preprost, kasneje še lahko definiraš URL-je, tako da pridobivaš enolične identifikatorje preko URL-ja (npr. /objava/322 - v tem primeru v kodi dobiš 322). Če te to zanima, mi lahko napišeš.
          Generalno se vse ostalo definira približno takole:
          <Route path="/url/do/tvoje/strani"><MojePoljubnoImeStrani /></Route>
      -->
  </div>
</Router>

<!--  <GumbKiSkrijeNav />  -->


<style>
  .container {
    margin: auto;
}
  .main-navbar {
    background-color: #333;
    /*color: #fff;*/
}

</style>