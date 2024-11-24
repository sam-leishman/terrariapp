<script lang="ts">
    export let isOpen = false;
    export let title: string;
    export let onConfirm: () => void;
    export let onCancel: () => void;

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Escape') {
            onCancel();
        }
    }
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        on:keydown={handleKeydown}
        role="presentation"
    >
        <div
            class="w-full max-w-md rounded-lg bg-slate-800 p-6 shadow-xl"
            role="dialog"
            aria-modal="true"
        >
            <h2 class="mb-4 text-xl font-semibold">{title}</h2>
            <div class="mb-6">
                <slot></slot>
            </div>
            <div class="flex justify-end gap-4">
                <button
                    on:click={onCancel}
                    class="rounded px-4 py-2 text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                    Cancel
                </button>
                <button
                    on:click={onConfirm}
                    class="rounded bg-red-600 px-4 py-2 font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
{/if}
