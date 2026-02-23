<script lang="ts">
    import { getUsers, createUser } from "./users.remote";
    import { m } from "$lib/paraglide/messages";

    let firstName = $state('');
    let lastName = $state('');
    let email = $state('');
    let password = $state('');
    let role = $state('User');
    let error = $state('');
    let success = $state('');

    async function handleCreate() {
        try {
            error = '';
            success = '';
            await createUser({ firstName, lastName, email, password, role });
            getUsers().refresh();

            firstName = '';
            lastName = '';
            email = '';
            password = '';
            role = 'User';
            success = m.users_created();
        } catch (e) {
            error = e instanceof Error ? e.message : m.users_create_error()
        }
    }
</script>

<div class="p-6 max-w-4xl mx-auto space-y-6">
    <h1 class="h1">{m.users_title()}</h1>

    <div class="card preset-outlined-surface-500 p-6">
        <h2 class="h3 mb-4">{m.users_new()}</h2>

        {#if error}
            <p class="text-error-500 text-sm mb-2">{error}</p>
        {/if}
        {#if success}
            <p class="text-success-500 text-sm mb-2">{success}</p>
        {/if}

        <form class="space-y-4" onsubmit={handleCreate}>
            <div class="grid grid-cols-2 gap-4">
                <label class="label">
                    <span class="label-text">{m.users_firstname()}</span>
                    <input class="input" type="text" bind:value={firstName} required>
                </label>
                <label class="label">
                    <span class="label-text">{m.users_lastname()}</span>
                    <input class="input" type="text" bind:value={lastName} required>
                </label>
            </div>
            <label class="label">
                <span class="label-text">{m.login_email()}</span>
                <input class="input" type="email" bind:value={email} required>
            </label>
            <label class="label">
                <span class="label-text">{m.login_password()}</span>
                <input class="input" type="password" bind:value={password} required>
            </label>
            <label class="label">
                <span class="label-text">{m.users_role()}</span>
                <select class="select" bind:value={role}>
                    <option value="User">{m.users_type_user()}</option>
                    <option value="Admin">{m.users_type_admin()}</option>
                </select>
            </label>
            <button class="btn preset-filled-primary-500 w-full" type="submit">
                {m.users_create()}
            </button>
        </form>
    </div>

    <div class="card preset-outlined-surface-500 p-6">
        <h2 class="h3 mb-4">{m.users_list()}</h2>

        {#await getUsers()}
            <p>{m.users_loading_message()}</p>
        {:then users}
            <ul class="space-y-2">
                {#each users.items as user}
                    <li class="card p-4 preset-tonal-surface">
                        <span class="font-bold">{user.firstName} {user.lastName}</span>
                        <span class="text-sm opacity-70"> — {user.email}</span>
                    </li>
                {/each}
            </ul>
        {:catch}
            <p class="text-error-500">{m.users_load_error()}</p>
        {/await}
    </div>
</div>
