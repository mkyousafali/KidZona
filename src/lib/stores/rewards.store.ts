import { writable } from 'svelte/store';

export interface Reward {
  id: string;
  type: 'star' | 'badge';
  name: string;
  unlockedAt: string;
}

export const rewardsStore = writable<Reward[]>([]);

export function unlockReward(type: 'star' | 'badge', name: string) {
  const reward: Reward = {
    id: crypto.getRandomValues(new Uint8Array(16)).toString(),
    type,
    name,
    unlockedAt: new Date().toISOString()
  };

  rewardsStore.update((rewards) => [...rewards, reward]);
  return reward;
}
