<script lang="ts">
    import { page } from '$app/stores';
    import { worlds } from '$lib/stores/worlds';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

    $: world = $worlds.find((w) => w.id === $page.params.id);
    $: if (browser && !world) {
        goto('/');
    }

    // Placeholder for NPC data structure
    const npcs = {
        guide: 'Guide',
        merchant: 'Merchant',
        nurse: 'Nurse',
        demolitionist: 'Demolitionist',
        dyeTrader: 'Dye Trader',
        angler: 'Angler',
        zoologist: 'Zoologist',
        dryad: 'Dryad',
        painter: 'Painter',
        golfer: 'Golfer',
        armsDealer: 'Arms Dealer',
        tavernkeep: 'Tavernkeep',
        stylist: 'Stylist',
        goblinTinkerer: 'Goblin Tinkerer',
        witchDoctor: 'Witch Doctor',
        clothier: 'Clothier',
        mechanic: 'Mechanic',
        partyGirl: 'Party Girl',
        wizard: 'Wizard',
        taxCollector: 'Tax Collector',
        truffle: 'Truffle',
        pirate: 'Pirate',
        steampunker: 'Steampunker',
        cyborg: 'Cyborg',
        santa: 'Santa Claus'
    };

    // We'll need to update the World type and store to handle NPC tracking
    function toggleNPC(npcId: string) {
        if (!world) return;
        
        const currentNPCs = world.progress.npcs || {};
        const newNPCs = {
            ...currentNPCs,
            [npcId]: !currentNPCs[npcId]
        };

        worlds.updateWorld(world.id, {
            ...world,
            progress: {
                ...world.progress,
                npcs: newNPCs
            }
        });
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
                <h1 class="text-3xl font-bold">NPCs</h1>
            </div>
        </div>

        <div class="rounded-lg bg-slate-800 p-6">
            <div class="grid gap-4 sm:grid-cols-2">
                {#each Object.entries(npcs) as [id, name]}
                    <button
                        class="flex items-center gap-3 rounded bg-slate-700 p-3 text-left hover:bg-slate-600"
                        class:opacity-50={!world.progress.npcs?.[id]}
                        on:click={() => toggleNPC(id)}
                    >
                        <div
                            class="flex h-5 w-5 items-center justify-center rounded border border-slate-500"
                        >
                            {#if world.progress.npcs?.[id]}
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
{/if}
