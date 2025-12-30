<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { profileStore } from '$lib/stores/profile.store';
  import { ROUTES } from '$lib/config/routes';

  // Redirect to setup if no profile, else to home
  onMount(() => {
    const unsubscribe = profileStore.subscribe((profile) => {
      if (profile) {
        goto(ROUTES.home);
      } else {
        goto(ROUTES.setup);
      }
    });
    
    return unsubscribe;
  });
</script>
