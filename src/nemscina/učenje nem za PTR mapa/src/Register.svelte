<script lang="ts">
    import Paper from "@smui/paper";
    import Textfield from "@smui/textfield";

    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/button";

    import { navigate, Link } from "svelte-navigator";

    import { makeRequest } from "./server";

    async function login() {
        let fd = new FormData();
        fd.append("username", email);
        fd.append("pass", password);

        let r = makeRequest("/user/new", "POST", fd)
    }

    let email = "";
    let password = "";
    let name = "";

</script>

<style>
    .center {
        width: 100%;
        height: 100%;
    }
</style>

<main>
    <div class="center">
        <Paper>
            <h1>Registracija</h1>
            <Textfield type="text" bind:value={email} label="Uporabniško ime" style="width: 80%;">
                <Icon class="material-icons" slot="leadingIcon">person</Icon>
            </Textfield>
            <p />
            <Textfield on:submit={async () => await login()} type="password" bind:value={password} label="Geslo" style="width: 80%;">
                <Icon class="material-icons" slot="leadingIcon">password</Icon>
            </Textfield>
            <p />
            <Button on:click={async () => await login()} variant="raised">
                <Label>REGISTRACIJA</Label>
            </Button>
            <div class="medium-break"></div>
            <Button on:click={() => navigate("/login")} variant="raised">
                <Label>PRIJAVA</Label>
            </Button>
        </Paper>
    </div>
</main>