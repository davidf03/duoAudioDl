<script>
  import { onMount } from 'svelte'
  import MainNav from './components/MainNav/MainNav.svelte'
  import Home from './components/Main/Home.svelte'

  let currentPage = {component:Home}

  onMount(() => {
    console.log('extension popup mounted');
  })
</script>

<div>
  <MainNav />
  <svelte:component this={currentPage.component}/>
</div>
