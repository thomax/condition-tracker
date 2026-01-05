<script lang="ts">
  import { dataStore, editCharacter } from '../data/dataStore'
  import { getLocationStore } from '../data/locationStore'
  import Character from '../components/Character.svelte'
  import CharacterEdit from '../components/CharacterEdit.svelte'
  import type { SystemType, CharacterType, BuffType } from '../types/models'

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

  const isBuffActive = (buff: BuffType) => {
    return character?.activeBuffs?.some(b => b.key === buff.key) ?? false
  }

  const toggleBuff = (buff: BuffType) => {
    if (!character) return

    const isActive = isBuffActive(buff)
    const updatedActiveBuffs = isActive
      ? character.activeBuffs.filter(b => b.key !== buff.key)
      : [...(character.activeBuffs || []), buff]

    editCharacter({
      ...character,
      activeBuffs: updatedActiveBuffs,
    })
  }
</script>

{#if system}
  <h1>{[system.title, character?.name, action].filter(Boolean).join(' / ')}</h1>

  {#if characterKey}
    {#if action === 'edit'}
      <CharacterEdit />
    {:else}
      <div class="buffs">
        {#each $dataStore.buffs as buff}
          <button class:selected={isBuffActive(buff)} onclick={() => toggleBuff(buff)}>
            {buff.title}
          </button>
        {/each}
      </div>
      <Character />
    {/if}
  {/if}
{:else}
  <p>System with key {systemKey} not found</p>
{/if}

<style>
  .buffs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }

  .buffs button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background: #f5f5f5;
    cursor: pointer;
    transition: all 0.2s;
  }

  .buffs button:hover {
    background: #e0e0e0;
  }

  .buffs button.selected {
    background: #4caf50;
    color: white;
    border-color: #388e3c;
  }
</style>
