export interface World {
    id: string;
    name: string;
    createdAt: Date;
    difficulty: 'Classic' | 'Expert' | 'Master' | 'Journey';
    worldSize: 'Small' | 'Medium' | 'Large';
    evil: 'Corruption' | 'Crimson';
    progress: Progress;
}

export type Progress = {
    defeatedBosses: Record<string, boolean>;
    npcs: Record<string, boolean>;
    upgrades: Record<string, number>;
};

// Pre-hardmode bosses
export const BOSSES = {
    kingSlime: "King Slime",
    eyeOfCthulhu: "Eye of Cthulhu",
    eaterOfWorlds: "Eater of Worlds",
    brainOfCthulhu: "Brain of Cthulhu",
    queenBee: "Queen Bee",
    skeletron: "Skeletron",
    deerclops: "Deerclops",
    wallOfFlesh: "Wall of Flesh",
    // Hardmode bosses
    queenSlime: "Queen Slime",
    theTwins: "The Twins",
    theDestroyer: "The Destroyer",
    skeletronPrime: "Skeletron Prime",
    plantera: "Plantera",
    golem: "Golem",
    empress: "Empress of Light",
    dukeFishron: "Duke Fishron",
    lunatic: "Lunatic Cultist",
    moonLord: "Moon Lord"
} as const;
