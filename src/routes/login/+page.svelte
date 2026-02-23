<script lang="ts">
    import CompanyLogo from "$lib/components/icons/CompanyLogo.svelte";
    import { m } from "$lib/paraglide/messages";
    import { setLocale } from "$lib/paraglide/runtime";
    import { login } from "./auth.remote";
    import 'flag-icons/css/flag-icons.min.css';
    import { goto } from "$app/navigation";

    let email = $state('');
    let password = $state('');
    let error = $state('');

    async function handleLogin() {
        try {
            error = '';
            await login({email, password});
            await goto('/');
        } catch (e) {
            error = m.login_error();
        }
    }
</script>

<div class="flex min-h-screen items-center flex-col justify-center">
    <CompanyLogo width={200} height={140}></CompanyLogo>
    <div class="card preset-outlined-surface-500 w-full max-w-md p-8">
        <h3 class="h3 mb-6 text-center">{m.login_title()}</h3>
        <form class="label-text space-y-4" onsubmit={handleLogin}>
            <label class="label">
                <span class="label-text">{m.login_email()}</span>
                <input class="input" type="email" placeholder="mail@greencrest.com.br" bind:value={email} required>
            </label>
            <label class="label">
                <span class="label-text">{m.login_password()}</span>
                <input class="input" type="password" placeholder={m.login_placeholder_password()} bind:value={password} required>
            </label>
            {#if error}
                <p class="text-error-500 text-sm">
                    {error}
                </p>
            {/if}
            <button class="btn preset-filled-primary-500 w-full" type="submit">{m.login_signin()}</button>
        </form>
    </div>
    <div class="flex flex-items space-x-1 mt-2">
    <button aria-hidden="true" onclick={() => setLocale('pt-br')}>
        <span class="fi fi-br"></span>
    </button>    
    <button aria-hidden="true" onclick={() => setLocale('en')}>
        <span class="fi fi-us"></span>
    </button> 
    </div>
</div>