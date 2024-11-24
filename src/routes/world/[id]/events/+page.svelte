<script lang="ts">
    import { page } from '$app/stores';
    import { worlds } from '$lib/stores/worlds';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

    $: world = $worlds.find((w) => w.id === $page.params.id);
    $: if (browser && !world) {
        goto('/');
    }

    const events = {
        // Pre-Hardmode Events
        slimeRain: {
            name: 'Slime Rain',
            category: 'Pre-Hardmode'
        },
        bloodMoon: {
            name: 'Blood Moon',
            category: 'Pre-Hardmode'
        },
        goblinArmy: {
            name: 'Goblin Army',
            category: 'Pre-Hardmode'
        },
        oldOnesArmy: {
            name: "Old One's Army",
            category: 'Pre-Hardmode'
        },
        // Hardmode Events
        solarEclipse: {
            name: 'Solar Eclipse',
            category: 'Hardmode'
        },
        frostMoon: {
            name: 'Frost Moon',
            category: 'Hardmode'
        },
        pumpkinMoon: {
            name: 'Pumpkin Moon',
            category: 'Hardmode'
        },
        pirateInvasion: {
            name: 'Pirate Invasion',
            category: 'Hardmode'
        },
        martianMadness: {
            name: 'Martian Madness',
            category: 'Hardmode'
        },
        lunarEvent: {
            name: 'Lunar Event',
            category: 'Hardmode'
        },
        frostLegion: {
            name: 'Frost Legion',
            category: 'Hardmode'
        }
    };

    function updateEvent(eventId: string) {
        if (!world) return;
        
        const currentEvents = world.progress.events || {};
        
        worlds.updateWorld(world.id, {
            ...world,
            progress: {
                ...world.progress,
                events: {
                    ...currentEvents,
                    [eventId]: !currentEvents[eventId]
                }
            }
        });
    }

    function calculateEventProgress(): number {
        if (!world?.progress.events) return 0;
        
        const totalEvents = Object.keys(events).length;
        const completedEvents = Object.values(world.progress.events).filter(Boolean).length;
        
        return Math.round((completedEvents / totalEvents) * 100);
    }

    const categories = ['Pre-Hardmode', 'Hardmode'];
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
                <h1 class="text-3xl font-bold">Events</h1>
            </div>
        </div>

        <div class="space-y-6">
            {#each categories as category}
                <div class="rounded-lg bg-slate-800 p-6">
                    <h2 class="mb-4 text-xl font-semibold">{category} Events</h2>
                    <div class="grid gap-4 sm:grid-cols-2">
                        {#each Object.entries(events).filter(([_, event]) => event.category === category) as [id, event]}
                            <button
                                class="flex items-center gap-3 rounded bg-slate-700 p-3 text-left hover:bg-slate-600"
                                class:opacity-50={!world.progress.events?.[id]}
                                on:click={() => updateEvent(id)}
                            >
                                <div
                                    class="flex h-5 w-5 items-center justify-center rounded border border-slate-500"
                                    class:bg-green-500={world.progress.events?.[id]}
                                    class:border-green-500={world.progress.events?.[id]}
                                >
                                    {#if world.progress.events?.[id]}
                                        <svg
                                            class="h-3 w-3 text-white"
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
                                <div>{event.name}</div>
                            </button>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
{/if}
