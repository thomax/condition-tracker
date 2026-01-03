import { derived, type Readable } from 'svelte/store'
import { useLocation } from 'svelte5-router'

export type LocationParams = {
  systemKey: string | undefined
  characterKey: string | undefined
  action: string | null
}

// This will be initialized when the router is mounted
let locationStore: Readable<LocationParams> | null = null

export const initLocationStore = () => {
  if (locationStore) return locationStore

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

  return locationStore
}

export const getLocationStore = () => {
  if (!locationStore) {
    throw new Error('Location store not initialized. Call initLocationStore() first.')
  }
  return locationStore
}
