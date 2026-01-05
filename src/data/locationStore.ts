import { derived, type Readable } from 'svelte/store'
import { useLocation } from 'svelte5-router'

export type LocationParams = {
  systemKey: string | undefined
  characterKey: string | undefined
  action: string | null
}

let locationStore: Readable<LocationParams> | null = null

export const getLocationStore = () => {
  if (!locationStore) {
    const location = useLocation()

    locationStore = derived(location, $location => {
      const [systemKey, characterKey] = $location.pathname.split('/').filter(Boolean)
      const params = new URLSearchParams($location.search)
      const action = params.get('action')

      return {
        systemKey,
        characterKey,
        action,
      }
    })
  }

  return locationStore
}
