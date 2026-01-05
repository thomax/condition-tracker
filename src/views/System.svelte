<script lang="ts">
  import { dataStore } from '../data/dataStore'
  import { getLocationStore } from '../data/locationStore'
  import Character from '../components/Character.svelte'
  import CharacterEdit from '../components/CharacterEdit.svelte'
  import type { SystemType, CharacterType } from '../types/models'

  const locationParams = getLocationStore()
  const systemKey = $derived($locationParams.systemKey)
  const characterKey = $derived($locationParams.characterKey)
  const action = $derived($locationParams.action)

  const system = $derived($dataStore.systems.find(s => s.key === systemKey) as SystemType)
  const character = $derived(
    $dataStore.characters.find(
      c => c.systemKey === systemKey && c.key === characterKey
    ) as CharacterType
  )
</script>

{#if system}
  <h1>{[system.title, character?.name, action].filter(Boolean).join(' / ')}</h1>

  {#if characterKey}
    {#if action === 'edit'}
      <CharacterEdit />
    {:else}
      <pre>
        {JSON.stringify($dataStore.buffs, null, 2)}
      </pre>
      <Character />
    {/if}
  {/if}
{:else}
  <p>System with key {systemKey} not found</p>
{/if}

<pre>
  {JSON.stringify($dataStore.buffs, null, 2)}
</pre>
