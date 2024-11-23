<script lang="ts">
    import { page } from '$app/stores';
    import { worlds } from '$lib/stores/worlds';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import ProgressBar from '$lib/components/ProgressBar.svelte';
    import { calculateProgress } from '$lib/utils/progress';

    $: world = $worlds.find((w) => w.id === $page.params.id);
    $: if (browser && !world) {
        goto('/');
    }

    const commonPreHardmodeBosses = {
        kingSlime: 'King Slime',
        eyeOfCthulhu: 'Eye of Cthulhu'
    };

    const evilBosses = {
        Corruption: { eaterOfWorlds: 'Eater of Worlds' },
        Crimson: { brainOfCthulhu: 'Brain of Cthulhu' }
    };

    const latePreHardmodeBosses = {
        queenBee: 'Queen Bee',
        skeletron: 'Skeletron',
        deerclops: 'Deerclops',
        wallOfFlesh: 'Wall of Flesh'
    };

    $: preHardmodeBosses = world ? {
        ...commonPreHardmodeBosses,
        ...evilBosses[world.evil],
        ...latePreHardmodeBosses
    } : {};

    const hardmodeBosses = {
        queenSlime: 'Queen Slime',
        theDestroyer: 'The Destroyer',
        theTwins: 'The Twins',
        skeletronPrime: 'Skeletron Prime',
        plantera: 'Plantera',
        golem: 'Golem',
        dukeFishron: 'Duke Fishron',
        empressOfLight: 'Empress of Light',
        lunaticCultist: 'Lunatic Cultist',
        moonLord: 'Moon Lord'
    };

    function toggleBoss(bossId: string) {
        if (!world) return;
        
        const newDefeatedBosses = {
            ...world.progress.defeatedBosses,
            [bossId]: !world.progress.defeatedBosses[bossId]
        };
        worlds.updateWorld(world.id, {
            ...world,
            progress: {
                ...world.progress,
                defeatedBosses: newDefeatedBosses
            }
        });
    }
</script>

{#if world}
    <div class="mx-auto max-w-3xl space-y-8 p-4">
        <div>
            <div class="mb-4 flex items-center justify-between">
                <div>
                    <a
                        href="/world/{world.id}"
                        class="mb-2 inline-flex items-center text-sm text-slate-400 hover:text-slate-300"
                    >
                        <svg
                            class="mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to World
                    </a>
                    <h1 class="text-3xl font-bold">Boss Progress</h1>
                </div>
                <div class="w-48">
                    <ProgressBar percentage={calculateProgress(world)} />
                </div>
            </div>
        </div>

        <div class="space-y-8">
            <div class="rounded-lg bg-slate-800 p-6">
                <h2 class="mb-4 text-xl font-semibold">Pre-Hardmode Bosses</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    {#each Object.entries(preHardmodeBosses) as [id, name]}
                        <button
                            class="flex items-center gap-3 rounded bg-slate-700 p-3 text-left hover:bg-slate-600"
                            class:opacity-50={!world.progress.defeatedBosses[id]}
                            on:click={() => toggleBoss(id)}
                        >
                            <div
                                class="flex h-5 w-5 items-center justify-center rounded border border-slate-500"
                            >
                                {#if world.progress.defeatedBosses[id]}
                                    <svg
                                        class="h-3 w-3 text-green-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                {/if}
                            </div>
                            {name}
                        </button>
                    {/each}
                </div>
            </div>

            <div class="rounded-lg bg-slate-800 p-6">
                <h2 class="mb-4 text-xl font-semibold">Hardmode Bosses</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    {#each Object.entries(hardmodeBosses) as [id, name]}
                        <button
                            class="flex items-center gap-3 rounded bg-slate-700 p-3 text-left hover:bg-slate-600"
                            class:opacity-50={!world.progress.defeatedBosses[id]}
                            on:click={() => toggleBoss(id)}
                        >
                            <div
                                class="flex h-5 w-5 items-center justify-center rounded border border-slate-500"
                            >
                                {#if world.progress.defeatedBosses[id]}
                                    <svg
                                        class="h-3 w-3 text-green-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                {/if}
                            </div>
                            {name}
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}
