import type { World } from '$lib/types';

const COMMON_PRE_HARDMODE_BOSSES = [
    'kingSlime',
    'eyeOfCthulhu'
];

const EVIL_BOSSES = {
    Corruption: ['eaterOfWorlds'],
    Crimson: ['brainOfCthulhu']
} as const;

const LATE_PRE_HARDMODE_BOSSES = [
    'queenBee',
    'skeletron',
    'deerclops',
    'wallOfFlesh'
];

const HARDMODE_BOSSES = [
    'queenSlime',
    'theDestroyer',
    'theTwins',
    'skeletronPrime',
    'plantera',
    'golem',
    'dukeFishron',
    'empressOfLight',
    'lunaticCultist',
    'moonLord'
];

/**
 * Calculates the progress percentage for a world.
 * For a world with all bosses defeated:
 * - 2 common pre-hardmode bosses
 * - 1 evil-specific boss (either Eater of Worlds or Brain of Cthulhu)
 * - 4 late pre-hardmode bosses
 * - 10 hardmode bosses
 * Total: 17 bosses
 */
export function calculateProgress(world: World): number {
    if (!world.progress?.defeatedBosses) return 0;
    
    // Get the appropriate evil boss for this world
    const worldEvilBosses = EVIL_BOSSES[world.evil];
    
    const defeatedCommonPreHardmode = COMMON_PRE_HARDMODE_BOSSES.filter(
        boss => world.progress.defeatedBosses[boss]
    ).length;
    const defeatedEvilBoss = worldEvilBosses.filter(
        boss => world.progress.defeatedBosses[boss]
    ).length;
    const defeatedLatePreHardmode = LATE_PRE_HARDMODE_BOSSES.filter(
        boss => world.progress.defeatedBosses[boss]
    ).length;
    const defeatedHardmode = HARDMODE_BOSSES.filter(
        boss => world.progress.defeatedBosses[boss]
    ).length;

    const totalDefeated = defeatedCommonPreHardmode + defeatedEvilBoss + defeatedLatePreHardmode + defeatedHardmode;
    const totalBosses = COMMON_PRE_HARDMODE_BOSSES.length + 1 + LATE_PRE_HARDMODE_BOSSES.length + HARDMODE_BOSSES.length;
    
    return Math.round((totalDefeated / totalBosses) * 100);
}

export function calculateNPCProgress(world: World): number {
    if (!world.progress.npcs) return 0;
    const totalNPCs = 25; // Total number of NPCs
    const availableNPCs = Object.values(world.progress.npcs).filter(Boolean).length;
    return Math.round((availableNPCs / totalNPCs) * 100);
}
