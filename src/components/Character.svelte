<script lang="ts">
  import { dataStore } from '../data/dataStore'
  import type { CharacterType } from '../types/models'

  const { characterKey, systemKey } = $props<{
    characterKey: string
    systemKey: string
  }>()

  const character = $derived(
    $dataStore.characters.find(
      c => c.systemKey === systemKey && c.key === characterKey
    ) as CharacterType
  )
</script>

{#if character}
  <h2>
    <a href={`/${systemKey}/${characterKey}/?action=edit`}>edit</a>
    {character.name}
  </h2>
  <h3>Active buffs</h3>
  <ul>
    {#each character.activeBuffs as buff}
      <li>{buff.title}</li>
    {/each}
  </ul>
{:else}
  <p>Character not found</p>
{/if}

<style>
</style>
