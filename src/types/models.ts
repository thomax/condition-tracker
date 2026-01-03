export type AppData = {
  systems: Array<SystemType>
  characters: Array<CharacterType>
  currentSystem: SystemType | null
  buffs: Array<BuffType>
}

export type SystemType = {
  title: string
  key: string
}

export type CharacterType = {
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
