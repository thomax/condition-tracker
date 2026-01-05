<script lang="ts">
  import { Router, Route } from 'svelte5-router'

  import Home from './views/Home.svelte'
  import About from './views/About.svelte'
  import System from './views/System.svelte'
  import NavigationBar from './components/NavigationBar.svelte'

  let url = ''
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.2/font/bootstrap-icons.css"
  />
</svelte:head>

<Router {url}>
  <NavigationBar />
  <main>
    <Route path="/" component={Home} />
    <Route path="/about" component={About} />
    <Route path="/:systemKey" component={System} />
    <Route path="/:systemKey/:characterKey" component={System} />
  </main>
</Router>

<style>
</style>
