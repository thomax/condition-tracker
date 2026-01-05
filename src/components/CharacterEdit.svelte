<script lang="ts">
  import { get } from 'svelte/store'
  import { dataStore, editCharacter, deleteCharacter } from '../data/dataStore'
  import { getLocationStore } from '../data/locationStore'
  import { navigate } from 'svelte5-router'
  import { faker } from '@faker-js/faker'
  import { customAlphabet } from 'nanoid'
  const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 6)

  const locationParams = getLocationStore()
  const systemKey = $derived($locationParams.systemKey) as string
  const characterKey = $derived($locationParams.characterKey)

  const randomName = faker.person.firstName()
  const keyFromName = (name: string) => name.toLowerCase().replace(/\s+/g, '-')

  let characterWip = $state(
    get(dataStore).characters.find(c => c.systemKey === systemKey && c.key === characterKey) || {
      id: nanoid(),
      name: randomName,
      key: keyFromName(randomName),
      systemKey,
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
    Boolean(
      $dataStore.characters.filter(
        char => char.systemKey === systemKey && char.key === characterWip.key
      )
    )
  )

  const handleNameUpdate = (event: Event) => {
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
    deleteCharacter(characterWip.id)
    navigate(`/${systemKey}`)
  }

  const handleCancel = () => {
    navigate(`/${systemKey}/${characterWip.key}`)
  }
</script>

<form onsubmit={handleSubmit} class="my-2">
  <div class="mb-2">
    <input
      type="text"
      class="d-inline-block w-50 me-2"
      id="characterName"
      bind:value={characterWip.name}
      placeholder="Enter character name"
      required
      oninput={handleNameUpdate}
    />
    <span class="w-50 text-muted">
      [{keyFromName(characterWip.name)}]
    </span>
  </div>

  <button
    type="submit"
    onclick={handleSubmit}
    disabled={!isCharacterKeyUnique}
    class="bg-success p-2 text-white"
  >
    Save character
  </button>
  <button
    type="submit"
    onclick={handleDelete}
    disabled={!isCharacterStored}
    class="bg-danger p-2 text-white"
  >
    Delete
  </button>
  <button type="reset" onclick={handleCancel} class="bg-secondary-subtle p-2 text-black">
    Cancel
  </button>
</form>

<style>
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
