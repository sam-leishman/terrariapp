<script lang="ts">
	import { worlds } from '$lib/stores/worlds';
	import type { World } from '$lib/types';
	import Dialog from '$lib/components/Dialog.svelte';
	import CreateWorldDialog from '$lib/components/CreateWorldDialog.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { calculateProgress } from '$lib/utils/progress';

	let worldToDelete: World | null = null;
	let isCreateDialogOpen = false;

	function confirmDelete(world: World) {
		worldToDelete = world;
	}

	function handleDeleteConfirm() {
		if (worldToDelete) {
			worlds.deleteWorld(worldToDelete.id);
			worldToDelete = null;
		}
	}

	function handleDeleteCancel() {
		worldToDelete = null;
	}

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
</script>

<div class="space-y-8">
	<div class="flex items-center justify-between">
		<h1 class="text-3xl font-bold">Your Worlds</h1>
		<button
			on:click={() => (isCreateDialogOpen = true)}
			class="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
		>
			Create New World
		</button>
	</div>

	<!-- World List -->
	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each $worlds as world}
			<div class="rounded-lg bg-slate-800 p-6">
				<div class="mb-4">
					<div class="mb-2 flex items-center justify-between">
						<h3 class="text-lg font-semibold">{world.name}</h3>
						<button
							on:click={() => confirmDelete(world)}
							class="text-red-400 hover:text-red-300"
							title="Delete world"
						>
							Delete
						</button>
					</div>
					<div class="mb-4 flex items-center gap-4 text-sm text-slate-400">
						<span class={difficultyColors[world.difficulty || 'Classic']}
							>{world.difficulty || 'Classic'}</span
						>
						<span>{world.worldSize || 'Medium'}</span>
						<span class={evilColors[world.evil || 'Corruption']}
							>{world.evil || 'Corruption'}</span
						>
					</div>
					<ProgressBar percentage={calculateProgress(world)} size="sm"></ProgressBar>
				</div>
				<a
					href="/world/{world.id}"
					class="block w-full rounded bg-blue-600 px-4 py-2 text-center font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					View Progress
				</a>
			</div>
		{/each}
	</div>

	{#if $worlds.length === 0}
		<div class="rounded-lg bg-slate-800 p-8 text-center">
			<p class="mb-4 text-slate-400">No worlds yet. Create one to get started!</p>
			<button
				on:click={() => (isCreateDialogOpen = true)}
				class="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Create Your First World
			</button>
		</div>
	{/if}
</div>

<Dialog
	isOpen={worldToDelete !== null}
	title="Delete World"
	onConfirm={handleDeleteConfirm}
	onCancel={handleDeleteCancel}
>
	<p>
		Are you sure you want to delete the world "{worldToDelete?.name}"? This action cannot be undone.
	</p>
</Dialog>

<CreateWorldDialog isOpen={isCreateDialogOpen} onClose={() => (isCreateDialogOpen = false)}></CreateWorldDialog>
