<script>
  import { history, queue } from './store'
  import { onMount } from 'svelte'
  import MainNav from './components/MainNav/MainNav.svelte'
  import Home from './components/Main/Home.svelte'

  let currentPage = {component:Home}

  
</script>

<div class="aud-c-main">
  <!-- <MainNav />
  <svelte:component this={currentPage.component}/> -->
</div>
