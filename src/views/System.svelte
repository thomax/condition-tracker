<script lang="ts">
  import { Icon } from '@sveltestrap/sveltestrap'
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
  <h1>
    {[system.title, character?.name, action].filter(Boolean).join(' / ')}
    {#if characterKey && action !== 'edit'}
      <a class="ms-2" href={`/${systemKey}/${characterKey}/?action=edit`} title="Edit">
        <Icon name="wrench-adjustable" class="text-muted fs-2" />
      </a>
    {/if}
  </h1>

  {#if characterKey}
    {#if action === 'edit'}
      <section class="mt-4">
        <CharacterEdit />
      </section>
    {:else}
      <section class="mt-4">
        <div class="d-flex flex-wrap gap-2 mb-3">
          {#each $dataStore.buffs as buff}
            <button
              class="btn"
              class:btn-secondary={isBuffActive(buff)}
              class:btn-outline-secondary={!isBuffActive(buff)}
              onclick={() => toggleBuff(buff)}
            >
              {buff.title}
            </button>
          {/each}
        </div>
      </section>

      <section class="mt-4">
        <Character />
      </section>
    {/if}
  {/if}
{:else}
  <p>System with key {systemKey} not found</p>
{/if}
