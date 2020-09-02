<script>
  import { onMount } from 'svelte'
  import MainNav from './components/MainNav/MainNav.svelte'
  import Home from './components/Main/Home.svelte'

  let currentPage = {component:Home}
  let quote

  onMount(async () => {
    try {
      const response = await fetch(`https://api.quotable.io/random`)
      console.log(11, response)
    } catch (e) {
      // nothing
    }
  })
</script>

<div>
  <MainNav/>
  <svelte:component this={currentPage.component}/>
</div>
