<script lang="ts">
    import Paper from "@smui/paper";
    import Textfield from "@smui/textfield";
    import Icon from '@smui/textfield/icon';
    import Button, {Label} from "@smui/button";
    import IconButton from "@smui/icon-button";
    import { navigate } from "svelte-navigator";
    import Snackbar, {Actions} from "@smui/snackbar";
    import Notification from "./Notification.svelte";
    import Tooltip, {Wrapper} from "@smui/tooltip";
    import HelperText from "@smui/textfield/helper-text";
    import { makeRequest } from "./server";

    // <b style="color: rgba(0, 77, 50, 1);">Beži</b><span style="color: rgba(0, 128, 83, 1);">App</span>

    async function login() {
        let fd = new FormData();
        fd.append("username", email);
        fd.append("pass", password);

        let r = await makeRequest("/user/login", "POST", fd)

        localStorage.setItem("key", r.data.token);
        localStorage.setItem("isAdmin", r.data.is_admin);

        navigate("/");
    }

    let url = localStorage.getItem("baseurl")

    let email = "";
    let password = "";

    export let loginType = "account";

    let snackbarWithClose: InstanceType<typeof Snackbar>;
</script>

<style>
    .center {
        width: 100%;
        height: 100%;
    }
    /*
    .center {
        margin: 0;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30%;
        -ms-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
        text-align: center;
    }

    @media only screen and (max-device-width: 800px) {
        .center {
            margin: 0;
            position: absolute;
            top: 45%;
            left: 50%;
            width: 80%;
            -ms-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            text-align: center;
        }
    }*/
</style>

<main>
    <Snackbar bind:this={snackbarWithClose}>
        <Label>Prijava neuspešna.</Label>
        <Actions>
            <IconButton class="material-icons" title="Dismiss">close</IconButton>
        </Actions>
    </Snackbar>
    <div class="center">
        <Paper>
            <h1>Prijava v Učenje nem<!--{#if loginType === "gimsis"}BežiApp (GimSIS){:else}{#if loginType === "account"}BežiApp{:else}Lo.Polis{/if}{/if}--></h1>
            <Textfield type="text" bind:value={email} label="Uporabniško ime" style="width: 80%;" helperLine$style="width: 80%;">
                <Icon class="material-icons" slot="leadingIcon">person</Icon>
            </Textfield>
            <p />
            <Textfield on:keypress={(key) => {
                if (key.key === "Enter") {
                    login();
                }
            }} type="password" bind:value={password} label="Geslo" style="width: 80%;" helperLine$style="width: 80%;">
                <Icon class="material-icons" slot="leadingIcon">key</Icon>
            </Textfield>
            <p />
            <Button on:click={async () => await login()} variant="raised">
                <Label>PRIJAVA</Label>
            </Button>
            <div class="medium-break"></div>
            <Button on:click={() => navigate("/register")} variant="raised">
                <Label>REGISTRACIJA</Label>
            </Button>

            
            {#if loginType === "gimsis"}
                <p/>
                <Notification/>
            {/if}
        </Paper>
        <p/>
    </div>
    {#if loginType === "gimsis"}
        <!--<div style="bottom: 15px; position: fixed; left: 15px; right: 15px;">-->
        <!--</div>-->
    {/if}
</main>