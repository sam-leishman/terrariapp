<script lang="ts">
    import { page } from '$app/stores';
    import { worlds } from '$lib/stores/worlds';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

    $: world = $worlds.find((w) => w.id === $page.params.id);
    $: if (browser && !world) {
        goto('/');
    }

    const pylons = {
        forest: {
            name: 'Forest Pylon',
            suggestions: [
                'Guide',
                'Merchant',
                'Golfer',
                'Zoologist'
            ]
        },
        snow: {
            name: 'Snow Pylon',
            suggestions: [
                'Goblin Tinkerer',
                'Mechanic',
                'Cyborg'
            ]
        },
        desert: {
            name: 'Desert Pylon',
            suggestions: [
                'Arms Dealer',
                'Nurse',
                'Steampunker'
            ]
        },
        jungle: {
            name: 'Jungle Pylon',
            suggestions: [
                'Dryad',
                'Painter',
                'Witch Doctor'
            ]
        },
        ocean: {
            name: 'Ocean Pylon',
            suggestions: [
                'Angler',
                'Stylist',
                'Pirate'
            ]
        },
        underground: {
            name: 'Underground Pylon',
            suggestions: [
                'Demolitionist',
                'Clothier',
                'Tax Collector'
            ]
        },
        mushroom: {
            name: 'Mushroom Pylon',
            suggestions: [
                'Truffle',
                'Dye Trader'
            ]
        },
        hallow: {
            name: 'Hallow Pylon',
            suggestions: [
                'Tavernkeep',
                'Party Girl',
                'Wizard'
            ]
        }
    };

    function updatePylon(pylonId: string) {
        if (!world) return;
        
        const currentPylons = world.progress.pylons || {};
        
        worlds.updateWorld(world.id, {
            ...world,
            progress: {
                ...world.progress,
                pylons: {
                    ...currentPylons,
                    [pylonId]: !currentPylons[pylonId]
                }
            }
        });
    }

    function calculatePylonProgress(): number {
        if (!world?.progress.pylons) return 0;
        
        const totalPylons = Object.keys(pylons).length;
        const obtainedPylons = Object.values(world.progress.pylons).filter(Boolean).length;
        
        return Math.round((obtainedPylons / totalPylons) * 100);
    }
</script>

{#if world}
    <div class="mx-auto max-w-3xl space-y-8 p-4">
        <div>
            <div class="mb-4">
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
                <h1 class="text-3xl font-bold">Pylons</h1>
            </div>
        </div>

        <div class="space-y-6">
            <div class="rounded-lg bg-slate-800 p-6">
                <div class="mb-4">
                    <h2 class="text-xl font-semibold">Pylon Network</h2>
                    <p class="text-sm text-slate-400">
                        Track your pylon network and NPC suggestions for each biome.
                    </p>
                </div>

                <div class="grid gap-4 sm:grid-cols-2">
                    {#each Object.entries(pylons) as [id, pylon]}
                        <div class="rounded-lg bg-slate-700 p-4">
                            <div class="mb-4 flex items-start justify-between gap-4">
                                <div>
                                    <h3 class="font-medium">{pylon.name}</h3>
                                </div>
                                <button
                                    class="flex h-6 w-6 items-center justify-center rounded border border-slate-500"
                                    class:bg-green-500={world.progress.pylons?.[id]}
                                    class:border-green-500={world.progress.pylons?.[id]}
                                    on:click={() => updatePylon(id)}
                                >
                                    {#if world.progress.pylons?.[id]}
                                        <svg
                                            class="h-4 w-4 text-white"
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
                                </button>
                            </div>
                            <div class="space-y-1">
                                {#each pylon.suggestions as suggestion}
                                    <p class="text-sm text-slate-300">• {suggestion}</p>
                                {/each}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}
