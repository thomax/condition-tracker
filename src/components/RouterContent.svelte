<script lang="ts">
  import { initLocationStore } from '../data/locationStore'
  import NavigationBar from './NavigationBar.svelte'

  // Initialize the location store within the Router context
  initLocationStore()

  let { children } = $props()
</script>

<NavigationBar />
<main>
  {@render children()}
</main>
