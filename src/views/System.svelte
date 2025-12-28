<script lang="ts">
  import { onMount } from 'svelte'
  import { dataStore, setCurrentSystem } from '../data/dataStore'

  const { system: systemKey, character: characterKey } = $props<{
    system: string
    character: string
  }>()

  onMount(() => {
    setCurrentSystem(systemKey)
  })
</script>

<h1>System: {systemKey}</h1>
<h2>Character: {characterKey}</h2>

<pre>
  {JSON.stringify($dataStore.buffs, null, 2)}
</pre>
