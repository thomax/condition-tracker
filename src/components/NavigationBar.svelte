<script lang="ts">
  import {
    colorMode,
    toggleColorMode,
    Button,
    Collapse,
    ThemeToggler,
    NavbarBrand,
    Nav,
    Navbar,
    NavItem,
    NavbarToggler,
    Dropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Icon,
  } from '@sveltestrap/sveltestrap'
  import { Link } from 'svelte5-router'
  import { dataStore, setCurrentSystem } from '../data/dataStore'
  import { getLocationStore } from '../data/locationStore'
  import type { CharacterType } from '../types/models'

  let isOpen = $state<boolean>(false)
  let characters = $state<Array<CharacterType>>([])
  let currentColorMode = $state(colorMode)

  const locationParams = getLocationStore()
  const systemKey = $derived($locationParams.systemKey)
  const characterKey = $derived($locationParams.characterKey)

  const currentCharacter = $derived(
    $dataStore.characters.find(char => char.systemKey === systemKey && char.key === characterKey)
  )

  colorMode.subscribe((value: any) => {
    currentColorMode = value
  })

  const handleUpdate = (event: any) => {
    isOpen = Boolean(event.detail.isOpen)
  }

  $effect(() => {
    characters = $dataStore.characters.filter(c => c.systemKey === systemKey)
    setCurrentSystem(systemKey)
    console.log('isOpen:', isOpen)
  })
</script>

<Navbar
  color={currentColorMode === 'light' ? 'info' : 'primary'}
  expand="md"
  container="fluid"
  theme={currentColorMode}
>
  <NavbarBrand href="/">Condition Tracker</NavbarBrand>
  <NavbarToggler onclick={() => (isOpen = !isOpen)} />
  <Collapse {isOpen} navbar expand="md" on:update={handleUpdate}>
    <Nav class="ms-auto" navbar>
      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>
          <span class="">System</span>
          <span class="fw-bold pe-1">{$dataStore.currentSystem?.title || 'NONE'}</span>
        </DropdownToggle>
        <DropdownMenu>
          {#each $dataStore.systems as system}
            <DropdownItem>
              <Link to="/{system.key}">{system.title}</Link>
            </DropdownItem>
          {/each}
        </DropdownMenu>
      </Dropdown>

      <Dropdown nav inNavbar>
        <DropdownToggle nav caret>
          <span class="">Character</span>
          <span class="fw-bold pe-1">{currentCharacter?.name || 'NONE'}</span>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem>
            <Link to="/{systemKey}/new-character?action=edit">+ New character</Link>
          </DropdownItem>
          {#each characters.filter(c => c.systemKey === systemKey) as character}
            <DropdownItem>
              <Link to="/{systemKey}/{character.key}">{character.name}</Link>
            </DropdownItem>
          {/each}
        </DropdownMenu>
      </Dropdown>

      <NavItem>
        <span class="nav-link">
          <Link to="/about">About</Link>
        </span>
      </NavItem>

      <ThemeToggler>
        <Button color="primary" onclick={() => toggleColorMode()}>
          <Icon name={currentColorMode === 'light' ? 'sun-fill' : 'moon-stars-fill'} />
        </Button>
      </ThemeToggler>
    </Nav>
  </Collapse>
</Navbar>

<style>
</style>
