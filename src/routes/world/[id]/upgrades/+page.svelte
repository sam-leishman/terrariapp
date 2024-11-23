<script lang="ts">
    import { page } from '$app/stores';
    import { worlds } from '$lib/stores/worlds';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';

    $: world = $worlds.find((w) => w.id === $page.params.id);
    $: if (browser && !world) {
        goto('/');
    }

    const expertUpgrades = {
        demonHeart: {
            name: 'Demon Heart',
            description: 'Permanently adds an extra accessory slot (Expert/Master only)',
            max: 1
        }
    };

    const baseUpgrades = {
        // Health & Mana
        lifeCrystals: {
            name: 'Life Crystals',
            description: 'Permanently increases max life by 20',
            max: 15
        },
        lifeFruit: {
            name: 'Life Fruit',
            description: 'Permanently increases max life by 5 (Hardmode only)',
            max: 20
        },
        manaCrystals: {
            name: 'Mana Crystals',
            description: 'Permanently increases max mana by 20',
            max: 9
        },
        // Permanent Consumables
        combatBook1: {
            name: 'Advanced Combat Techniques',
            description: 'Permanently increases damage by 5%',
            max: 1
        },
        artisanLoaf: {
            name: 'Artisan Loaf',
            description: 'Permanently increases mining speed by 20%',
            max: 1
        },
        torchGod: {
            name: "Torch God's Favor",
            description: 'Permanently enables automatic torch placement',
            max: 1
        },
        vitalCrystal: {
            name: 'Vital Crystal',
            description: 'Permanently increases life regeneration',
            max: 1
        },
        aegisFruit: {
            name: 'Aegis Fruit',
            description: 'Permanently increases defense by 2',
            max: 1
        },
        arcaneCrystal: {
            name: 'Arcane Crystal',
            description: 'Permanently increases mana regeneration',
            max: 1
        },
        ambrosia: {
            name: 'Ambrosia',
            description: 'Permanently increases life regeneration and defense',
            max: 1
        },
        gummyWorm: {
            name: 'Gummy Worm',
            description: 'Permanently increases fishing power by 5%',
            max: 1
        },
        galaxyPearl: {
            name: 'Galaxy Pearl',
            description: 'Permanently increases maximum minion slots by 1',
            max: 1
        },
        combatBook2: {
            name: 'Advanced Combat Techniques: Volume Two',
            description: 'Permanently increases critical strike chance by 2%',
            max: 1
        },
        peddlersSatchel: {
            name: "Peddler's Satchel",
            description: 'Permanently increases item sale value by 10%',
            max: 1
        },
        minecartKit: {
            name: 'Minecart Upgrade Kit',
            description: 'Permanently increases minecart speed and abilities',
            max: 1
        }
    };

    $: upgrades = world?.difficulty === 'Classic' 
        ? baseUpgrades 
        : { ...expertUpgrades, ...baseUpgrades };

    function updateUpgrade(upgradeId: string, value: number) {
        if (!world) return;
        
        const currentUpgrades = world.progress.upgrades || {};
        const upgrade = upgrades[upgradeId];
        const newValue = Math.min(Math.max(0, value), upgrade.max);

        worlds.updateWorld(world.id, {
            ...world,
            progress: {
                ...world.progress,
                upgrades: {
                    ...currentUpgrades,
                    [upgradeId]: newValue
                }
            }
        });
    }

    function calculateUpgradeProgress(): number {
        if (!world?.progress.upgrades) return 0;
        
        const totalMax = Object.values(upgrades).reduce((sum, upgrade) => sum + upgrade.max, 0);
        const currentTotal = Object.entries(upgrades).reduce((sum, [id, upgrade]) => {
            return sum + (world.progress.upgrades[id] || 0);
        }, 0);
        
        return Math.round((currentTotal / totalMax) * 100);
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
                <h1 class="text-3xl font-bold">Permanent Upgrades</h1>
            </div>
        </div>

        <div class="space-y-6">
            <div class="rounded-lg bg-slate-800 p-6">
                <h2 class="mb-4 text-xl font-semibold">Health & Mana</h2>
                <div class="space-y-4">
                    {#each Object.entries(upgrades).filter(([_, u]) => u.max > 1) as [id, upgrade]}
                        <div>
                            <div class="mb-2 flex items-center justify-between">
                                <div>
                                    <h3 class="font-medium">{upgrade.name}</h3>
                                    <p class="text-sm text-slate-400">{upgrade.description}</p>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button
                                        class="rounded bg-slate-700 px-2 py-1 text-sm hover:bg-slate-600"
                                        on:click={() => updateUpgrade(id, (world.progress.upgrades?.[id] || 0) - 1)}
                                    >
                                        -
                                    </button>
                                    <span class="min-w-[3ch] text-center">
                                        {world.progress.upgrades?.[id] || 0}
                                    </span>
                                    <button
                                        class="rounded bg-slate-700 px-2 py-1 text-sm hover:bg-slate-600"
                                        on:click={() => updateUpgrade(id, (world.progress.upgrades?.[id] || 0) + 1)}
                                    >
                                        +
                                    </button>
                                    <span class="text-sm text-slate-400">/ {upgrade.max}</span>
                                </div>
                            </div>
                            <div class="h-2 rounded-full bg-slate-700">
                                <div
                                    class="h-full rounded-full bg-blue-500"
                                    style="width: {((world.progress.upgrades?.[id] || 0) / upgrade.max) * 100}%"
                                />
                            </div>
                        </div>
                    {/each}
                </div>
            </div>

            <div class="rounded-lg bg-slate-800 p-6">
                <h2 class="mb-4 text-xl font-semibold">Permanent Consumables</h2>
                <div class="grid gap-4 sm:grid-cols-2">
                    {#each Object.entries(upgrades).filter(([_, u]) => u.max === 1) as [id, upgrade]}
                        <button
                            class="flex items-center gap-3 rounded bg-slate-700 p-3 text-left hover:bg-slate-600"
                            class:opacity-50={!world.progress.upgrades?.[id]}
                            on:click={() => updateUpgrade(id, world.progress.upgrades?.[id] ? 0 : 1)}
                        >
                            <div
                                class="flex h-5 w-5 items-center justify-center rounded border border-slate-500"
                            >
                                {#if world.progress.upgrades?.[id]}
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
                            <div>
                                <div>{upgrade.name}</div>
                                <div class="text-sm text-slate-400">{upgrade.description}</div>
                            </div>
                        </button>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}
