import systems from './systems.json'
import swadeConditions from './swade/conditions.json'
import dndConditions from './5e/conditions.json'
import { get, writable } from 'svelte/store'
import type { AppData, BuffType, CharacterType, SystemType } from '../types/models'
import { getLocalStorageItem, setLocalStorageItem, removeLocalStorageItem } from './localStorage'

const defaultSystemKey = 'swade'

const getCurrentSystem = () => {
  const [systemKey] = location.pathname.split('/').filter(Boolean)
  const storedSystem = getLocalStorageItem('currentSystem')
  return (
    systems.find(s => s.key === systemKey) ||
    storedSystem ||
    systems.find(s => s.key === defaultSystemKey)
  )
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
  currentSystem: null,
  characters: getLocalStorageItem('characters') || ([] as any),
  systems: systems as SystemType[],
  buffs: getBuffsForSystem((getCurrentSystem() as SystemType).key),
})

export const setCurrentSystem = (systemKey: string | undefined) => {
  const system = systems.find(s => s.key === systemKey)
  if (!system || system.key === get(dataStore).currentSystem?.key) {
    return
  }

  dataStore.update(data => {
    const newData = {
      ...data,
      currentSystem: system,
      buffs: getBuffsForSystem(system.key),
    }
    setLocalStorageItem('currentSystem', system)
    return newData
  })
}

export const deleteCharacter = (characterId: string) => {
  const data = get(dataStore)
  const updatedCharacters = data.characters.filter(char => char.id !== characterId)

  dataStore.update(data => {
    const newData = {
      ...data,
      characters: updatedCharacters,
    }
    setLocalStorageItem('characters', updatedCharacters)
    return newData
  })
}

export const editCharacter = (character: CharacterType) => {
  const data = get(dataStore)
  const existingCharacterIndex = data.characters.findIndex(
    char => char.key === character.key && char.systemKey === character.systemKey
  )
  // If character key exists, swap it for the one being edited. If not, add it.
  const allCharacters = data.characters
  if (existingCharacterIndex !== -1) {
    allCharacters[existingCharacterIndex] = character
  } else {
    allCharacters.push(character)
  }

  dataStore.update(data => {
    const newData = {
      ...data,
      characters: allCharacters,
    }
    setLocalStorageItem('characters', allCharacters)
    return newData
  })
  return character
}
