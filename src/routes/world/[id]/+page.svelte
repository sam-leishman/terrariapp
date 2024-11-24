<script lang="ts">
    import { page } from '$app/stores';
    import { worlds } from '$lib/stores/worlds';
    import type { World } from '$lib/types';
    import { browser } from '$app/environment';
    import { goto } from '$app/navigation';
    import CreateWorldDialog from '$lib/components/CreateWorldDialog.svelte';
    import { calculateProgress, calculateNPCProgress } from '$lib/utils/progress';

    function calculateUpgradeProgress(world: World): number {
        if (!world?.progress.upgrades) return 0;
        
        // Calculate total max based on world difficulty
        const baseMax = 56; // Total of base upgrades (15 + 20 + 9 + 12 consumables)
        const expertMax = 1;  // Demon Heart
        const totalMax = world.difficulty === 'Classic' ? baseMax : baseMax + expertMax;
        
        const currentTotal = Object.values(world.progress.upgrades).reduce((sum, value) => sum + value, 0);
        
        return Math.round((currentTotal / totalMax) * 100);
    }

    function calculatePylonProgress(world: World): number {
        if (!world?.progress.pylons) return 0;
        
        // Calculate total max based on world difficulty
        const totalMax = 8; // Total of pylons
        
        const currentTotal = Object.values(world.progress.pylons).reduce((sum, value) => sum + (value ? 1 : 0), 0);
        
        return Math.round((currentTotal / totalMax) * 100);
    }

    function calculateEventProgress(world: World): number {
        if (!world?.progress.events) return 0;
        
        const totalEvents = 11; // Total number of events
        const completedEvents = Object.values(world.progress.events).filter(Boolean).length;
        
        return Math.round((completedEvents / totalEvents) * 100);
    }

    function getCompletedCategories(world: World): number {
        if (!world) return 0;
        
        let completed = 0;
        if (calculateProgress(world) === 100) completed++;
        if (calculateNPCProgress(world) === 100) completed++;
        if (calculateUpgradeProgress(world) === 100) completed++;
        if (calculatePylonProgress(world) === 100) completed++;
        if (calculateEventProgress(world) === 100) completed++;
        
        return completed;
    }

    $: world = $worlds.find((w) => w.id === $page.params.id);
    $: if (browser && !world) {
        goto('/');
    }

    let isEditDialogOpen = false;
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
                <div class="grid grid-cols-2 gap-6 sm:grid-cols-3">
                    <div>
                        <p class="text-sm text-slate-400">Difficulty</p>
                        <p class="mt-1 text-lg font-medium">{world.difficulty}</p>
                    </div>
                    <div>
                        <p class="text-sm text-slate-400">Evil Type</p>
                        <p class="mt-1 text-lg font-medium">{world.evil}</p>
                    </div>
                    <div>
                        <p class="text-sm text-slate-400">World Size</p>
                        <p class="mt-1 text-lg font-medium">{world.worldSize}</p>
                    </div>
                </div>

                <div class="mt-6 border-t border-slate-700 pt-6">
                    <div class="flex items-center justify-between">
                        <div class="flex-1">
                            <div class="flex items-center justify-between text-sm">
                                <span>Completion</span>
                                <span>{calculateProgress(world)}%</span>
                            </div>
                            <div class="mt-2 h-2 rounded-full bg-slate-700">
                                <div
                                    class="h-full rounded-full bg-blue-500"
                                    style="width: {calculateProgress(world)}%"
                                ></div>
                            </div>
                        </div>
                        <div class="ml-8 flex items-center space-x-1">
                            {#each Array(5) as _, i}
                                <svg 
                                    class="h-6 w-6" 
                                    class:text-yellow-400={i < getCompletedCategories(world)}
                                    class:text-slate-600={i >= getCompletedCategories(world)}
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            {/each}
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <a
                    href="/world/{world.id}/bosses"
                    class="relative flex flex-col rounded-lg p-6"
                    class:hover:bg-green-700={calculateProgress(world) === 100}
                    class:hover:bg-slate-700={calculateProgress(world) !== 100}
                    class:bg-green-800={calculateProgress(world) === 100}
                    class:bg-slate-800={calculateProgress(world) !== 100}
                >
                    {#if calculateProgress(world) === 100}
                        <div class="absolute right-4 top-4">
                            <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    {/if}
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
                            ></div>
                        </div>
                    </div>
                </a>

                <a
                    href="/world/{world.id}/npcs"
                    class="relative flex flex-col rounded-lg p-6"
                    class:hover:bg-green-700={calculateNPCProgress(world) === 100}
                    class:hover:bg-slate-700={calculateNPCProgress(world) !== 100}
                    class:bg-green-800={calculateNPCProgress(world) === 100}
                    class:bg-slate-800={calculateNPCProgress(world) !== 100}
                >
                    {#if calculateNPCProgress(world) === 100}
                        <div class="absolute right-4 top-4">
                            <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    {/if}
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
                            ></div>
                        </div>
                    </div>
                </a>

                <a
                    href="/world/{world.id}/upgrades"
                    class="relative flex flex-col rounded-lg p-6"
                    class:hover:bg-green-700={calculateUpgradeProgress(world) === 100}
                    class:hover:bg-slate-700={calculateUpgradeProgress(world) !== 100}
                    class:bg-green-800={calculateUpgradeProgress(world) === 100}
                    class:bg-slate-800={calculateUpgradeProgress(world) !== 100}
                >
                    {#if calculateUpgradeProgress(world) === 100}
                        <div class="absolute right-4 top-4">
                            <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    {/if}
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
                            ></div>
                        </div>
                    </div>
                </a>

                <a
                    href="/world/{world.id}/pylons"
                    class="relative flex flex-col rounded-lg p-6"
                    class:hover:bg-green-700={calculatePylonProgress(world) === 100}
                    class:hover:bg-slate-700={calculatePylonProgress(world) !== 100}
                    class:bg-green-800={calculatePylonProgress(world) === 100}
                    class:bg-slate-800={calculatePylonProgress(world) !== 100}
                >
                    {#if calculatePylonProgress(world) === 100}
                        <div class="absolute right-4 top-4">
                            <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    {/if}
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
                            ></div>
                        </div>
                    </div>
                </a>

                <a
                    href="/world/{world.id}/events"
                    class="relative flex flex-col rounded-lg p-6"
                    class:hover:bg-green-700={calculateEventProgress(world) === 100}
                    class:hover:bg-slate-700={calculateEventProgress(world) !== 100}
                    class:bg-green-800={calculateEventProgress(world) === 100}
                    class:bg-slate-800={calculateEventProgress(world) !== 100}
                >
                    {#if calculateEventProgress(world) === 100}
                        <div class="absolute right-4 top-4">
                            <svg class="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>
                    {/if}
                    <h2 class="mb-2 text-xl font-semibold">Events</h2>
                    <p class="mb-4 text-sm text-slate-400">Track completed events and invasions.</p>
                    <div class="mt-auto">
                        <div class="flex items-center justify-between text-sm">
                            <span>Progress</span>
                            <span>{calculateEventProgress(world)}%</span>
                        </div>
                        <div class="mt-2 h-2 rounded-full bg-slate-700">
                            <div
                                class="h-full rounded-full bg-blue-500"
                                style="width: {calculateEventProgress(world)}%"
                            ></div>
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
    ></CreateWorldDialog>
{/if}
