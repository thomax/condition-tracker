<script lang="ts">
  import { dataStore } from '../data/dataStore'
  import CharacterEdit from './CharacterEdit.svelte'

  const { system: systemKey, character: characterKey } = $props<{
    system: string
    character: string
  }>()

  let action: string | null = $state(null)

  $effect(() => {
    const params = new URLSearchParams(location.search)
    action = params.get('action')
  })
</script>

<h1>System: {systemKey}</h1>
<h2>Character: {characterKey}</h2>
<h3>Action: {action}</h3>

{#if action === 'edit'}
  <CharacterEdit {systemKey} {characterKey} />
{:else}
  <pre>
    {JSON.stringify($dataStore.buffs, null, 2)}
  </pre>
{/if}
