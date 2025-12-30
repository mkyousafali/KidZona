<script lang="ts">
  import { rewardsStore } from '$lib/stores/rewards.store';

  let rewards = $rewardsStore;
  let stars = 0;
  let badges: string[] = [];

  $: {
    stars = rewards.filter((r) => r.type === 'star').length;
    badges = [...new Set(rewards.filter((r) => r.type === 'badge').map((r) => r.name))];
  }
</script>

<div class="rewards-container">
  <h1>Your Rewards! 🎉</h1>

  <div class="rewards-section">
    <div class="stars-card">
      <div class="star-count">{stars}</div>
      <p>Stars Earned</p>
    </div>

    <div class="badges-card">
      <div class="badge-count">{badges.length}</div>
      <p>Badges Unlocked</p>
    </div>
  </div>

  {#if badges.length > 0}
    <div class="badges-section">
      <h2>Badges</h2>
      <div class="badges-grid">
        {#each badges as badge}
          <div class="badge-item">
            <span class="badge-emoji">🏅</span>
            <p>{badge}</p>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <div class="back-button">
    <a href="/home">← Back to Home</a>
  </div>
</div>

<style>
  .rewards-container {
    max-width: 600px;
    margin: 0 auto;
    padding: var(--spacing-xl);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
  }

  h1 {
    text-align: center;
    font-size: var(--font-size-2xl);
    color: var(--primary-color);
  }

  .rewards-section {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
  }

  .stars-card,
  .badges-card {
    background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
    color: white;
    border-radius: var(--border-radius-lg);
    padding: var(--spacing-xl);
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .star-count,
  .badge-count {
    font-size: 3rem;
    font-weight: 700;
  }

  .badges-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  h2 {
    font-size: var(--font-size-xl);
  }

  .badges-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    gap: var(--spacing-md);
  }

  .badge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background-color: var(--surface-color);
    border: 2px solid var(--warning-color);
    border-radius: var(--border-radius-md);
    text-align: center;
  }

  .badge-emoji {
    font-size: 2rem;
  }

  .back-button {
    text-align: center;
  }

  .back-button a {
    color: var(--primary-color);
    text-decoration: none;
    font-weight: 600;
    transition: color var(--transition-base);
  }

  .back-button a:hover {
    color: var(--secondary-color);
  }
</style>
