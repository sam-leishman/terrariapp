<script lang="ts">
	import '../app.css';
	let { children } = $props();
</script>

<div class="min-h-screen bg-slate-900 text-white">
	<header class="border-b border-slate-800 p-4">
		<h1 class="text-2xl font-bold">Terrariapp</h1>
	</header>

	<main class="container mx-auto p-4">
		{@render children()}
	</main>
</div>
