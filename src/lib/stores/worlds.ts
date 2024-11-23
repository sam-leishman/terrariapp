import { writable } from 'svelte/store';
import { v4 as uuidv4 } from 'uuid';
import type { World } from '$lib/types';

const STORAGE_KEY = 'worlds';

function loadFromStorage(): World[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function createWorldsStore() {
    const { subscribe, set, update } = writable<World[]>(loadFromStorage());

    return {
        subscribe,
        addWorld: (world: Omit<World, 'id'>) => {
            update(worlds => {
                const newWorld = {
                    ...world,
                    id: uuidv4()
                };
                const updatedWorlds = [...worlds, newWorld];
                if (typeof window !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorlds));
                }
                return updatedWorlds;
            });
        },
        deleteWorld: (id: string) => {
            update(worlds => {
                const updatedWorlds = worlds.filter(w => w.id !== id);
                if (typeof window !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorlds));
                }
                return updatedWorlds;
            });
        },
        updateWorld: (id: string, updatedWorld: World) => {
            update(worlds => {
                const updatedWorlds = worlds.map(world => 
                    world.id === id ? updatedWorld : world
                );
                if (typeof window !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorlds));
                }
                return updatedWorlds;
            });
        },
        updateProgress: (worldId: string, bossId: string, defeated: boolean) => {
            update(worlds => {
                const updatedWorlds = worlds.map(world => {
                    if (world.id === worldId) {
                        return {
                            ...world,
                            progress: {
                                ...world.progress,
                                defeatedBosses: {
                                    ...world.progress.defeatedBosses,
                                    [bossId]: defeated
                                }
                            }
                        };
                    }
                    return world;
                });
                if (typeof window !== 'undefined') {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedWorlds));
                }
                return updatedWorlds;
            });
        }
    };
}

export const worlds = createWorldsStore();
