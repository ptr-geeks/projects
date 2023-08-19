<script lang="ts">
    import { skritNav } from './stores.js';
  
  function skrijOdkrij() {
    // posodobimo skritNav, pri čemer negiramo trenutnaVrednostSpremenljivke, ki je trenutna vrednost spremenljivke, ki jo posodabljamo, torej skritNav.
    skritNav.update((trenutnaVrednostSpremenljivke) => !trenutnaVrednostSpremenljivke);
  }
</script>

<button on:click={skrijOdkrij}>
  {#if $skritNav}
    Pokaži navigacijo
  {:else}
    Skrij navigacijo
  {/if}
</button>