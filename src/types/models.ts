export type AppData = {
  systems: Array<SystemType>
  characters: Array<CharacterType>
  currentSystem: SystemType | null
  buffs: Array<BuffType>
}

export type SystemType = {
  id: string
  title: string
  key: string
}

export type CharacterType = {
  id: string
  name: string
  key: string
  systemKey: string
  activeBuffs: Array<BuffType>
}

export type EffectType = {
  description?: string
  key?: string
  targetAbility?: string
  modifierType?: 'add' | 'multiply' | 'set'
  modifierValue?: number
}

export type BuffType = {
  title: string
  description: string
  key: string
  origin: string
  end?: string
  effects: EffectType[]
}

export type BuffsResolution = {
  traits: {
    attributes: {
      agility: number
      smarts: number
      spirit: number
      strength: number
      vigor: number
    }
    skills: Record<string, number>
  }
  derived: {
    pace: number
    parry: number
    toughness: number
    run: string
    size: number
  }
  other: {
    wounds: number
    fatigue: number
    bennies: number
    power: number
  }
}
