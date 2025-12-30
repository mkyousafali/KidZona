<script lang="ts">
  import '$lib/styles/app.css';
  import { updateNetworkStatus } from '$lib/stores/network.store';

  // Initialize network listeners
  if (typeof window !== 'undefined') {
    updateNetworkStatus(navigator.onLine);
  }
</script>

<slot />
