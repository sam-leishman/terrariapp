<script lang="ts">
    import { worlds } from '$lib/stores/worlds';
    import type { Difficulty, WorldSize, Evil, World } from '$lib/types';

    export let isOpen = false;
    export let onClose: () => void;
    export let editWorld: World | undefined = undefined;

    let newWorldName = '';
    let newWorldDifficulty: Difficulty = 'Classic';
    let newWorldSize: WorldSize = 'Medium';
    let newWorldEvil: Evil = 'Corruption';

    $: if (isOpen && editWorld) {
        newWorldName = editWorld.name;
        newWorldDifficulty = editWorld.difficulty;
        newWorldSize = editWorld.worldSize;
        newWorldEvil = editWorld.evil;
    }

    const difficultyColors = {
        Classic: 'text-green-400',
        Expert: 'text-yellow-400',
        Master: 'text-red-400',
        Journey: 'text-blue-400'
    };

    const worldSizes = {
        Small: '4200 x 1200',
        Medium: '6400 x 1800',
        Large: '8400 x 2400'
    };

    function resetForm() {
        newWorldName = '';
        newWorldDifficulty = 'Classic';
        newWorldSize = 'Medium';
        newWorldEvil = 'Corruption';
    }

    function handleClose() {
        isOpen = false;
        resetForm();
        onClose();
    }

    function handleSubmit() {
        if (!newWorldName.trim()) return;
        
        if (editWorld) {
            worlds.updateWorld(editWorld.id, {
                ...editWorld,
                name: newWorldName,
                difficulty: newWorldDifficulty,
                worldSize: newWorldSize,
                evil: newWorldEvil
            });
        } else {
            worlds.addWorld({
                id: crypto.randomUUID(),
                name: newWorldName,
                difficulty: newWorldDifficulty,
                worldSize: newWorldSize,
                evil: newWorldEvil,
                progress: {
                    defeatedBosses: {}
                }
            });
        }
        
        handleClose();
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            handleClose();
        }
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        on:keydown={handleKeydown}
        on:click|self={handleClose}
        role="presentation"
    >
        <div
            class="w-full max-w-lg rounded-lg bg-slate-800 p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
        >
            <form on:submit|preventDefault={handleSubmit}>
                <h2 class="mb-4 text-xl font-semibold">
                    {editWorld ? 'Edit World' : 'Create New World'}
                </h2>

                <div class="space-y-4">
                    <div>
                        <label
                            for="worldName"
                            class="mb-1 block text-sm font-medium text-slate-300"
                        >
                            World Name
                        </label>
                        <input
                            type="text"
                            id="worldName"
                            bind:value={newWorldName}
                            class="w-full rounded bg-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required />
                    </div>

                    <div>
                        <label
                            for="difficulty"
                            class="mb-1 block text-sm font-medium text-slate-300"
                        >
                            Difficulty
                        </label>
                        <select
                            id="difficulty"
                            bind:value={newWorldDifficulty}
                            class="w-full rounded bg-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {#each Object.entries(difficultyColors) as [difficulty]}
                                <option value={difficulty}>{difficulty}</option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label
                            for="worldSize"
                            class="mb-1 block text-sm font-medium text-slate-300"
                        >
                            World Size
                        </label>
                        <select
                            id="worldSize"
                            bind:value={newWorldSize}
                            class="w-full rounded bg-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {#each Object.entries(worldSizes) as [size, dimensions]}
                                <option value={size}>{size} ({dimensions})</option>
                            {/each}
                        </select>
                    </div>

                    <div>
                        <label
                            for="evil"
                            class="mb-1 block text-sm font-medium text-slate-300"
                        >
                            World Evil
                        </label>
                        <select
                            id="evil"
                            bind:value={newWorldEvil}
                            class="w-full rounded bg-slate-700 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            <option value="Corruption">Corruption</option>
                            <option value="Crimson">Crimson</option>
                        </select>
                    </div>
                </div>

                <div class="flex justify-end gap-4 pt-4">
                    <button
                        type="button"
                        on:click={handleClose}
                        class="rounded px-4 py-2 text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        class="rounded bg-green-600 px-4 py-2 font-medium text-white hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {editWorld ? 'Save Changes' : 'Create World'}
                    </button>
                </div>
            </form>
        </div>
    </div>
{/if}
