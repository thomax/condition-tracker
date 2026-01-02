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
  import type { CharacterType } from '../types/models'

  let isOpen = $state<boolean>(false)

  function handleUpdate(event: any) {
    isOpen = event.detail.isOpen
  }

  let systemKey = $state<string | undefined>()
  let characterKey = $state<string | undefined>()
  let characters = $state<Array<CharacterType>>([])
  let currentColorMode = $derived(colorMode)

  colorMode.subscribe((value: any) => {
    console.log('NavigationBar colorMode changed to:', value)
    currentColorMode = value
  })

  const currentCharacter = $derived(
    $dataStore.characters.find(char => char.systemKey === systemKey && char.key === characterKey)
  )

  $effect(() => {
    ;[systemKey, characterKey] = location.pathname.split('/').filter(Boolean)
    characters = $dataStore.characters.filter(c => c.systemKey === systemKey)
    setCurrentSystem(systemKey)
    console.log('colorMode', currentColorMode)
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
