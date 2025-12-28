<script lang="ts">
  import { Router, Link, Route } from 'svelte5-router'
  import Home from './views/Home.svelte'
  import System from './views/System.svelte'

  export let url = ''
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
  />
</svelte:head>

<main>
  <Router {url}>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/swade">SWADE</Link>
      <Link to="/5e">5e</Link>
    </nav>
    <div>
      <Route path="/"><Home /></Route>
      <Route path="/:system" component={System} />
      <Route path="/:system/:character" component={System} />
    </div>
  </Router>
</main>

<style>
</style>
