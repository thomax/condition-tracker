<script lang="ts">
  import { get } from 'svelte/store'
  import { dataStore, editCharacter, deleteCharacter } from '../data/dataStore'
  import { getLocationStore } from '../data/locationStore'
  import { navigate } from 'svelte5-router'
  import { faker } from '@faker-js/faker'

  const locationParams = getLocationStore()
  const systemKey = $derived($locationParams.systemKey ?? '')
  const characterKey = $derived($locationParams.characterKey ?? '')

  const randomName = faker.person.firstName()
  const keyFromName = (name: string) => name.toLowerCase().replace(/\\s+/g, '-')

  // Get initial values from the store synchronously
  const initialParams = get(locationParams)
  const initialSystemKey = initialParams.systemKey ?? ''
  const initialCharacterKey = initialParams.characterKey ?? ''

  let characterWip = $state(
    get(dataStore).characters.find(
      c => c.systemKey === initialSystemKey && c.key === initialCharacterKey
    ) || {
      name: randomName,
      key: keyFromName(randomName),
      systemKey: initialSystemKey,
      activeBuffs: [],
    }
  )

  const isCharacterKeyUnique = $derived(
    $dataStore.characters
      .filter(char => char.systemKey === systemKey)
      .map(c => c.key)
      .includes(characterWip.key) === false
  )

  const isCharacterStored = $derived(
    $dataStore.characters
      .filter(char => char.systemKey === systemKey)
      .find(c => c.key === characterWip.key) !== undefined
  )

  const handleNameChage = (event: Event) => {
    const target = event.target as HTMLInputElement
    const characterName = target.value
    const characterKey = keyFromName(characterName)
    characterWip = {
      ...characterWip,
      name: characterName,
      key: characterKey,
    }
  }

  const handleSubmit = () => {
    if (!characterWip.name || !isCharacterKeyUnique) {
      return
    }
    editCharacter(characterWip)
    navigate(`/${systemKey}/${characterWip.key}`)
  }

  const handleDelete = () => {
    deleteCharacter(characterWip.key)
    navigate(`/${systemKey}`)
  }

  const handleCancel = () => {
    navigate(`/${systemKey}/${characterWip.key}`)
  }
</script>

<form onsubmit={handleSubmit}>
  <div class="mb-2">
    <label for="characterName">Character Name</label>
    <input
      type="text"
      id="characterName"
      bind:value={characterWip.name}
      placeholder="Enter character name"
      required
      oninput={handleNameChage}
    />
    <input
      class="mt-1"
      type="text"
      id="characterKey"
      bind:value={characterWip.key}
      placeholder="character key"
      required
      disabled
    />
  </div>

  <button
    type="submit"
    onclick={handleSubmit}
    disabled={!isCharacterKeyUnique}
    class="bg-success p-2 text-white"
  >
    Save Changes
  </button>
  <button
    type="submit"
    onclick={handleDelete}
    disabled={isCharacterStored}
    class="bg-danger p-2 text-white"
  >
    Delete
  </button>
  <button type="reset" onclick={handleCancel} class="bg-secondary-subtle p-2 text-black">
    Cancel
  </button>
</form>

<style>
  form {
    max-width: 400px;
    margin: 2rem 0;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  input {
    width: 100%;
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  button:hover {
    opacity: 0.8;
  }
</style>
