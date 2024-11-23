<script lang="ts">
    import { page } from '$app/stores';
    import { worlds } from '$lib/stores/worlds';
    import type { World } from '$lib/types';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import ProgressBar from '$lib/components/ProgressBar.svelte';
    import CreateWorldDialog from '$lib/components/CreateWorldDialog.svelte';
    import { calculateProgress, calculateNPCProgress } from '$lib/utils/progress';

    function calculateUpgradeProgress(world): number {
        if (!world?.progress.upgrades) return 0;
        
        // Calculate total max based on world difficulty
        const baseMax = 56; // Total of base upgrades (15 + 20 + 9 + 12 consumables)
        const expertMax = 1;  // Demon Heart
        const totalMax = world.difficulty === 'Classic' ? baseMax : baseMax + expertMax;
        
        const currentTotal = Object.values(world.progress.upgrades).reduce((sum, value) => sum + value, 0);
        
        return Math.round((currentTotal / totalMax) * 100);
    }

    function calculatePylonProgress(world): number {
        if (!world?.progress.pylons) return 0;
        
        // Calculate total max based on world difficulty
        const totalMax = 8; // Total of pylons
        
        const currentTotal = Object.values(world.progress.pylons).reduce((sum, value) => sum + value, 0);
        
        return Math.round((currentTotal / totalMax) * 100);
    }

    $: world = $worlds.find((w) => w.id === $page.params.id);
    $: if (browser && !world) {
        goto('/');
    }

    let isEditDialogOpen = false;

    const difficultyColors = {
        Classic: 'text-green-400',
        Expert: 'text-yellow-400',
        Master: 'text-red-400',
        Journey: 'text-blue-400'
    };

    const evilColors = {
        Corruption: 'text-purple-400',
        Crimson: 'text-red-400'
    };

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
                        href="/"
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
                        Back to Worlds
                    </a>
                    <h1 class="text-3xl font-bold">{world.name}</h1>
                </div>
                <div class="flex items-center gap-4">
                    <button
                        class="rounded bg-slate-700 px-4 py-2 hover:bg-slate-600"
                        on:click={() => (isEditDialogOpen = true)}
                    >
                        Edit World
                    </button>
                </div>
            </div>

            <div class="rounded-lg bg-slate-800 p-6">
                <h2 class="mb-4 text-xl font-semibold">World Details</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    <div>
                        <p class="text-sm text-slate-400">Difficulty</p>
                        <p class="text-lg">{world.difficulty}</p>
                    </div>
                    <div>
                        <p class="text-sm text-slate-400">World Size</p>
                        <p class="text-lg">{world.worldSize}</p>
                    </div>
                    <div>
                        <p class="text-sm text-slate-400">Evil Type</p>
                        <p class="text-lg">{world.evil}</p>
                    </div>
                </div>
            </div>

            <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a
                    href="/world/{world.id}/bosses"
                    class="flex flex-col rounded-lg bg-slate-800 p-6 hover:bg-slate-700"
                >
                    <h2 class="mb-2 text-xl font-semibold">Bosses</h2>
                    <p class="mb-4 text-sm text-slate-400">Track defeated bosses and unlock progression.</p>
                    <div class="mt-auto">
                        <div class="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculateProgress(world)}%</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-700">
                            <div
                                class="h-full rounded-full bg-blue-500"
                                style="width: {calculateProgress(world)}%"
                            />
                        </div>
                    </div>
                </a>

                <a
                    href="/world/{world.id}/npcs"
                    class="flex flex-col rounded-lg bg-slate-800 p-6 hover:bg-slate-700"
                >
                    <h2 class="mb-2 text-xl font-semibold">NPCs</h2>
                    <p class="mb-4 text-sm text-slate-400">Track available NPCs and their locations.</p>
                    <div class="mt-auto">
                        <div class="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculateNPCProgress(world)}%</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-700">
                            <div
                                class="h-full rounded-full bg-blue-500"
                                style="width: {calculateNPCProgress(world)}%"
                            />
                        </div>
                    </div>
                </a>

                <a
                    href="/world/{world.id}/upgrades"
                    class="flex flex-col rounded-lg bg-slate-800 p-6 hover:bg-slate-700"
                >
                    <h2 class="mb-2 text-xl font-semibold">Upgrades</h2>
                    <p class="mb-4 text-sm text-slate-400">Track permanent character upgrades.</p>
                    <div class="mt-auto">
                        <div class="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculateUpgradeProgress(world)}%</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-700">
                            <div
                                class="h-full rounded-full bg-blue-500"
                                style="width: {calculateUpgradeProgress(world)}%"
                            />
                        </div>
                    </div>
                </a>

                <a
                    href="/world/{world.id}/pylons"
                    class="flex flex-col rounded-lg bg-slate-800 p-6 hover:bg-slate-700"
                >
                    <h2 class="mb-2 text-xl font-semibold">Pylons</h2>
                    <p class="mb-4 text-sm text-slate-400">Track pylon network and NPC requirements.</p>
                    <div class="mt-auto">
                        <div class="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculatePylonProgress(world)}%</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-700">
                            <div
                                class="h-full rounded-full bg-blue-500"
                                style="width: {calculatePylonProgress(world)}%"
                            />
                        </div>
                    </div>
                </a>
            </div>
        </div>
    </div>

    <CreateWorldDialog
        bind:isOpen={isEditDialogOpen}
        editWorld={world}
        on:worldCreated={() => {
            isEditDialogOpen = false;
        }}
    />
{/if}
