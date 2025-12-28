import systems from './systems.json'
import swadeConditions from './swade/conditions.json'
import dndConditions from './5e/conditions.json'
import { get, writable, derived } from 'svelte/store'
import type { AppData, BuffType, CharacterType, SystemType } from '../types/models'
import {
  getLocalStorageItem,
  setLocalStorageItem,
  removeLocalStorageItem,
} from './localStorage'

const defaultSystemKey = 'swade'

const getCurrentSystem = () => {
  const storedSystem = getLocalStorageItem('currentSystem')
  return storedSystem || systems.find((s) => s.key === defaultSystemKey)
}

const getBuffsForSystem = (systemKey: string): BuffType[] => {
  if (systemKey === 'swade') {
    return swadeConditions as BuffType[]
  } else if (systemKey === '5e') {
    return dndConditions as BuffType[]
  }
  return []
}

export const dataStore = writable<AppData>({
  currentSystem: getCurrentSystem() as any,
  currentCharacter: getLocalStorageItem('currentCharacter') || null as any,
  characters: getLocalStorageItem('characters') || [] as any,
  systems: systems as SystemType[],
  buffs: getBuffsForSystem((getCurrentSystem() as SystemType).key)
})

export const setCurrentSystem = (systemKey: string) => {
  const system = systems.find((s) => s.key === systemKey)
  if (!system || system.key === get(dataStore).currentSystem.key) {
    return
  }

  dataStore.update((data) => {
    const newData = {
      ...data,
      currentSystem: system,
      currentCharacter: null,
      buffs: getBuffsForSystem(system.key),
    }
    setLocalStorageItem('currentSystem', system)
    removeLocalStorageItem('currentCharacter')
    return newData
  })
}

export const setCurrentCharacter = (characterKey: string) => {
  const data = get(dataStore)
  const currentSystemKey = data.currentSystem.key
  let character = data.characters.find((c) => c.key === characterKey && c.systemKey === currentSystemKey)
  if (!character) {
    character = {
      name: 'New Character',
      key: characterKey,
      systemKey: currentSystemKey,
      activeBuffs: [],
    }
  }
  dataStore.update((data) => {
    const newData = {
      ...data,
      currentCharacter: character as CharacterType,
    }
    setLocalStorageItem('currentCharacter', character)
    return newData
  })
}