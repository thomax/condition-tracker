<script lang="ts">
  import { Router, Link, Route } from 'svelte5-router'
  import Home from './views/Home.svelte'
  import About from './views/About.svelte'
  import Blog from './views/Blog.svelte'
  import BlogPost from './views/BlogPost.svelte'
  import Counter from './components/Counter.svelte'

  export let url = ''
</script>

<main>
  <Router {url}>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/blog">Blog</Link>
    </nav>
    <div>
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/blog" component={Blog} />
      <Route path="/about" component={About} />
      <Route path="/"><Home /></Route>
    </div>
  </Router>
  <div class="card">
    <Counter />
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
