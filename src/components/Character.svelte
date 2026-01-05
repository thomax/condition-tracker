<script lang="ts">
  import { dataStore } from '../data/dataStore'
  import { getLocationStore } from '../data/locationStore'
  import type { CharacterType, EffectType, BuffType, BuffsResolution } from '../types/models'
  import { dice, buffsResolutionTemplate } from '../constants'

  const locationParams = getLocationStore()
  const systemKey = $derived($locationParams.systemKey)
  const characterKey = $derived($locationParams.characterKey)

  const character = $derived(
    $dataStore.characters.find(
      c => c.systemKey === systemKey && c.key === characterKey
    ) as CharacterType
  )

  const resolveEffect = (effect: EffectType, accumulator: BuffsResolution) => {
    if (effect.key) {
      const actualBuff = $dataStore.buffs.find(buff => buff.key === effect.key)
      if (!actualBuff) {
        console.error(`Buff with key ${effect.key} not found`)
        return {}
      }
      return resolveBuff(actualBuff, accumulator)
    }
    // handle direct effect
  }

  const resolveBuff = (buff: BuffType, accumulator: BuffsResolution) => {
    buff.effects.forEach((effect: EffectType) => {
      const resolvedEffect = resolveEffect(effect, accumulator)
    })
    return accumulator
  }

  const buffsResolved = $derived(() => {
    let accumulator = { ...buffsResolutionTemplate }

    character.activeBuffs.forEach(buff => {
      const resolvedBuff = resolveBuff(buff, accumulator)
    })
    return accumulator
  })
</script>

{#if character}
  <h3>Active buffs</h3>
  <ul>
    {#each character.activeBuffs as buff}
      <li>{buff.title}</li>
      <ul>
        {#each buff.effects as effect}
          <li>
            {effect.description} / {effect.targetAbility} / {effect.modifierType} / {effect.modifierValue}
          </li>
        {/each}
      </ul>
    {/each}
  </ul>
{:else}
  <p>Character with key {characterKey} not found</p>
{/if}

<style>
</style>
