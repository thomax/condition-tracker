<script lang="ts">
  import { dataStore } from '../data/dataStore'
  import Character from '../components/Character.svelte'
  import CharacterEdit from '../components/CharacterEdit.svelte'
  import type { SystemType, CharacterType } from '../types/models'

  const { systemKey, characterKey } = $props<{
    systemKey: string
    characterKey: string
  }>()
  let action: string | null = $state(null)
  const system = $derived($dataStore.systems.find(s => s.key === systemKey) as SystemType)
  const character = $derived(
    $dataStore.characters.find(
      c => c.systemKey === systemKey && c.key === characterKey
    ) as CharacterType
  )

  $effect(() => {
    const params = new URLSearchParams(location.search)
    action = params.get('action')
  })
</script>

<h1>{[system?.title, character?.name, action].filter(Boolean).join(' / ')}</h1>

{#if characterKey}
  {#if action === 'edit'}
    <CharacterEdit {systemKey} {characterKey} />
  {:else}
    <Character {systemKey} {characterKey} />
  {/if}
{:else}
  <pre>
    {JSON.stringify($dataStore.buffs, null, 2)}
  </pre>
{/if}

<pre>
  {JSON.stringify($dataStore.buffs, null, 2)}
</pre>
