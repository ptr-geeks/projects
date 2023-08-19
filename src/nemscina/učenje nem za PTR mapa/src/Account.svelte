<script lang="ts">
    import { makeRequest } from "./server";
    import Textfield from "@smui/textfield";
    import Button from "@smui/button";
    import Backup from "./Backup.svelte";

    let fd;
    let f;

    let staroGeslo = "";
    let novoGeslo = "";

    async function spremeniGeslo() {
        fd = new FormData();
        // console.log(staroGeslo);
        fd.append("oldPassword", staroGeslo); // vprašaj Mitjo, če je to varno !!!
        fd.append("password", novoGeslo);

        f = await makeRequest("/user/get/password_change", "PATCH", fd);
    }

</script>

<style>

</style>

<div style="margin-left: 10px;">

<h3>Spremeni geslo</h3>

<p>Vpiši staro geslo: </p>
<Textfield label="staro geslo" bind:value={staroGeslo}></Textfield>

<p>Vpiši novo geslo: </p>
<Textfield label="novo geslo" bind:value={novoGeslo}></Textfield>

<div class="big-break"></div>

<Button variant="raised" on:click={() => {
    spremeniGeslo();
    staroGeslo = "";
    novoGeslo = "";
}}>Spremeni geslo</Button>

</div>












