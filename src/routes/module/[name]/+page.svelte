<script lang="ts">
  import { page } from '$app/stores';
  import { ROUTES } from '$lib/config/routes';
  import { goto } from '$app/navigation';
  
  let moduleName = '';
  
  $: if ($page.params.name) {
    moduleName = $page.params.name;
  }
</script>

<div class="module-container">
  <div class="header">
    <button class="back-button" on:click={() => goto(ROUTES.home)}>
      ← Back
    </button>
    <h1>{moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}</h1>
  </div>
  
  <div class="module-content">
    <p>Module: {moduleName}</p>
    <p>Activities coming soon...</p>
  </div>
</div>

<style>
  .module-container {
    max-width: 800px;
    margin: 0 auto;
    padding: var(--spacing-lg);
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
  }

  .header {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }

  .back-button {
    padding: var(--spacing-sm) var(--spacing-md);
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius-md);
    background: white;
    cursor: pointer;
    font-size: var(--font-size-base);
    transition: all var(--transition-base);
  }

  .back-button:hover {
    border-color: var(--primary-color);
    background-color: rgba(255, 107, 107, 0.1);
  }

  h1 {
    font-size: var(--font-size-2xl);
    color: var(--primary-color);
    margin: 0;
  }

  .module-content {
    padding: var(--spacing-lg);
    background: rgba(255, 107, 107, 0.05);
    border-radius: var(--border-radius-md);
    text-align: center;
  }
</style>
