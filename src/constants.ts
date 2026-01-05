import type { BuffsResolution } from './types/models'

export const dice: string[] = ['d4-2', 'd4', 'd6', 'd8', 'd10', 'd12', 'd12+1', 'd12+2']

export const buffsResolutionTemplate: BuffsResolution = {
  traits: {
    attributes: {
      agility: 0,
      smarts: 0,
      spirit: 0,
      strength: 0,
      vigor: 0,
    },
    skills: {},
  },
  derived: {
    pace: 0,
    parry: 0,
    toughness: 0,
    run: dice[2],
    size: 0,
  },
  other: {
    wounds: 0,
    fatigue: 0,
    bennies: 3,
    power: 0,
  },
}
