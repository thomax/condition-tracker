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

  const applyModifier = (
    currentValue: number | string,
    modifierType: EffectType['modifierType'],
    modifierValue: number
  ): number | string => {
    if (typeof currentValue === 'string') return currentValue // Skip dice strings for now

    switch (modifierType) {
      case 'add':
        return currentValue + modifierValue
      case 'multiply':
        return currentValue * modifierValue
      case 'set':
        return modifierValue
      default:
        return currentValue
    }
  }

  const applyEffectToTarget = (
    accumulator: BuffsResolution,
    targetPath: string,
    modifierType: EffectType['modifierType'],
    modifierValue: number
  ) => {
    const parts = targetPath.split('.')
    const [category, subcategory, ...specifics] = parts
    const specific = specifics.join('.') // Handle multi-part names like "common-knowledge"

    if (category === 'traits') {
      if (subcategory === 'attributes') {
        if (specific === '*' || !specific) {
          // Apply to all attributes
          Object.keys(accumulator.traits.attributes).forEach(attr => {
            accumulator.traits.attributes[attr as keyof typeof accumulator.traits.attributes] =
              applyModifier(
                accumulator.traits.attributes[attr as keyof typeof accumulator.traits.attributes],
                modifierType,
                modifierValue
              ) as number
          })
        } else if (specific.includes('|')) {
          // Multiple specific attributes
          specific.split('|').forEach(attr => {
            if (attr in accumulator.traits.attributes) {
              accumulator.traits.attributes[attr as keyof typeof accumulator.traits.attributes] =
                applyModifier(
                  accumulator.traits.attributes[attr as keyof typeof accumulator.traits.attributes],
                  modifierType,
                  modifierValue
                ) as number
            }
          })
        } else if (specific in accumulator.traits.attributes) {
          // Single specific attribute
          accumulator.traits.attributes[specific as keyof typeof accumulator.traits.attributes] =
            applyModifier(
              accumulator.traits.attributes[specific as keyof typeof accumulator.traits.attributes],
              modifierType,
              modifierValue
            ) as number
        }
      } else if (subcategory === 'skills') {
        if (specific === '*' || !specific) {
          // Apply to all skills
          Object.keys(accumulator.traits.skills).forEach(skill => {
            accumulator.traits.skills[skill] = applyModifier(
              accumulator.traits.skills[skill],
              modifierType,
              modifierValue
            ) as number
          })
        } else if (specific.includes('|')) {
          // Multiple specific skills
          specific.split('|').forEach(skill => {
            if (!accumulator.traits.skills[skill]) {
              accumulator.traits.skills[skill] = 0
            }
            accumulator.traits.skills[skill] = applyModifier(
              accumulator.traits.skills[skill],
              modifierType,
              modifierValue
            ) as number
          })
        } else {
          // Single specific skill
          if (!accumulator.traits.skills[specific]) {
            accumulator.traits.skills[specific] = 0
          }
          accumulator.traits.skills[specific] = applyModifier(
            accumulator.traits.skills[specific],
            modifierType,
            modifierValue
          ) as number
        }
      } else if (!subcategory || subcategory === '*') {
        // Apply to all traits (both attributes and skills)
        Object.keys(accumulator.traits.attributes).forEach(attr => {
          accumulator.traits.attributes[attr as keyof typeof accumulator.traits.attributes] =
            applyModifier(
              accumulator.traits.attributes[attr as keyof typeof accumulator.traits.attributes],
              modifierType,
              modifierValue
            ) as number
        })
        Object.keys(accumulator.traits.skills).forEach(skill => {
          accumulator.traits.skills[skill] = applyModifier(
            accumulator.traits.skills[skill],
            modifierType,
            modifierValue
          ) as number
        })
      }
    } else if (category === 'derived') {
      if (subcategory in accumulator.derived) {
        const key = subcategory as keyof typeof accumulator.derived
        accumulator.derived[key] = applyModifier(
          accumulator.derived[key],
          modifierType,
          modifierValue
        ) as any
      }
    } else if (category === 'other') {
      if (subcategory in accumulator.other) {
        const key = subcategory as keyof typeof accumulator.other
        accumulator.other[key] = applyModifier(
          accumulator.other[key],
          modifierType,
          modifierValue
        ) as number
      }
    }
  }

  const resolveEffect = (
    effect: EffectType,
    accumulator: BuffsResolution,
    processedBuffKeys: Set<string>
  ) => {
    if (effect.key) {
      const actualBuff = $dataStore.buffs.find(buff => buff.key === effect.key)
      if (!actualBuff) {
        console.error(`Buff with key ${effect.key} not found`)
        return
      }
      resolveBuff(actualBuff, accumulator, processedBuffKeys)
    } else if (effect.targetAbility && effect.modifierType && effect.modifierValue !== undefined) {
      // Handle direct effect
      applyEffectToTarget(
        accumulator,
        effect.targetAbility,
        effect.modifierType,
        effect.modifierValue
      )
    }
  }

  const resolveBuff = (
    buff: BuffType,
    accumulator: BuffsResolution,
    processedBuffKeys: Set<string>
  ) => {
    // Prevent circular references
    if (processedBuffKeys.has(buff.key)) {
      return
    }
    processedBuffKeys.add(buff.key)

    buff.effects.forEach((effect: EffectType) => {
      resolveEffect(effect, accumulator, processedBuffKeys)
    })
  }

  const buffsResolved = $derived(() => {
    let accumulator = structuredClone(buffsResolutionTemplate)
    const processedBuffKeys = new Set<string>()

    character.activeBuffs.forEach(buff => {
      resolveBuff(buff, accumulator, processedBuffKeys)
    })
    return accumulator
  })

  const formatModifier = (value: number | string): string => {
    if (typeof value === 'string') return value
    if (value === 0) return ''
    return value > 0 ? `+${value}` : `${value}`
  }

  const capitalize = (str: string): string => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const formatSkillName = (skill: string): string => {
    return skill.split('-').map(capitalize).join(' ')
  }

  // Pre-processed data structures for rendering
  type ModifierCategory = {
    title: string
    colorClass: string
    items: Array<{ label: string; value: string }>
  }

  const activeConditions = $derived(() => {
    return character.activeBuffs.map(buff => ({
      title: buff.title,
      end: buff.end,
      description: buff.description,
      effects: buff.effects.filter(e => e.description).map(e => e.description!),
    }))
  })

  const modifierCategories = $derived((): ModifierCategory[] => {
    const resolved = buffsResolved()
    const categories: ModifierCategory[] = []

    // Attributes
    const attributes = Object.entries(resolved.traits.attributes)
      .filter(([_, value]) => value !== 0)
      .map(([attr, value]) => ({ label: capitalize(attr), value: formatModifier(value) }))

    if (attributes.length > 0) {
      categories.push({ title: 'Attributes', colorClass: 'text-primary', items: attributes })
    }

    // Skills
    const skills = Object.entries(resolved.traits.skills)
      .filter(([_, value]) => value !== 0)
      .map(([skill, value]) => ({ label: formatSkillName(skill), value: formatModifier(value) }))

    if (skills.length > 0) {
      categories.push({ title: 'Skills', colorClass: 'text-info', items: skills })
    }

    // Derived Stats
    const derived = Object.entries(resolved.derived)
      .filter(
        ([key, value]) =>
          (typeof value === 'number' && value !== 0) ||
          (typeof value === 'string' &&
            value !==
              buffsResolutionTemplate.derived[key as keyof typeof buffsResolutionTemplate.derived])
      )
      .map(([stat, value]) => ({ label: capitalize(stat), value: formatModifier(value) }))

    if (derived.length > 0) {
      categories.push({ title: 'Derived Stats', colorClass: 'text-warning', items: derived })
    }

    // Other
    const other = Object.entries(resolved.other)
      .filter(
        ([key, value]) =>
          value !== buffsResolutionTemplate.other[key as keyof typeof buffsResolutionTemplate.other]
      )
      .map(([stat, value]) => ({ label: capitalize(stat), value: formatModifier(value) }))

    if (other.length > 0) {
      categories.push({ title: 'Other', colorClass: 'text-danger', items: other })
    }

    return categories
  })
</script>

{#if character}
  {#if character.activeBuffs.length > 0}
    <div class="row">
      <div class="col-md-7">
        <h3>Active Conditions</h3>
        {#each activeConditions() as condition}
          <div class="card mb-3">
            <div class="card-header bg-secondary text-white">
              <strong>{condition.title}</strong>
              {#if condition.end}
                <span class="float-end small">Ends: {condition.end}</span>
              {/if}
            </div>
            <div class="card-body">
              {#if condition.description}
                <p class="card-text text-muted mb-2">{condition.description}</p>
              {/if}
              {#if condition.effects.length > 0}
                <ul class="mb-0">
                  {#each condition.effects as effect}
                    <li>{effect}</li>
                  {/each}
                </ul>
              {/if}
            </div>
          </div>
        {/each}
      </div>

      <div class="col-md-5">
        <h3>Modifier Summary</h3>
        <div class="card">
          <div class="card-body">
            {#if modifierCategories().length > 0}
              {#each modifierCategories() as category}
                <div class="mb-3">
                  <h6 class="{category.colorClass} mb-2">{category.title}</h6>
                  <table class="table table-sm table-borderless mb-0">
                    <tbody>
                      {#each category.items as item}
                        <tr>
                          <td class="ps-2">{item.label}</td>
                          <td class="text-end fw-bold">{item.value}</td>
                        </tr>
                      {/each}
                    </tbody>
                  </table>
                </div>
              {/each}
            {:else}
              <p class="text-muted mb-0 text-center">No numeric modifiers</p>
            {/if}
          </div>
        </div>
      </div>
    </div>
  {:else}
    <p class="text-muted">You don't suffer from anything! Let's keep it that way!</p>
  {/if}
{:else}
  <p>Character with key {characterKey} not found</p>
{/if}

<style>
</style>
