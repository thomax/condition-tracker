<script lang="ts">
  import { dataStore } from '../data/dataStore'
  import { getLocationStore } from '../data/locationStore'
  import type { CharacterType } from '../types/models'

  const locationParams = getLocationStore()
  const systemKey = $derived($locationParams.systemKey)
  const characterKey = $derived($locationParams.characterKey)

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
