<script lang="ts">
    export let percentage: number;
    export let size: 'sm' | 'md' = 'md';
    
    const sizeClasses = {
        sm: 'h-1.5',
        md: 'h-2'
    };
</script>

<div class="relative w-full overflow-hidden rounded bg-slate-700">
    <div
        class="{sizeClasses[size]} bg-blue-600 transition-all duration-300"
        style="width: {percentage}%"
    />
</div>

<div class="mt-1 text-right text-xs text-slate-400">
    {percentage}% Complete
</div>
