<script>
  import { loading, queue } from './store'
  import MainNav from './components/MainNav/MainNav.svelte'
  import Spinner from './components/Icons/Spinner.svelte'
  import Home from './components/Main/Home.svelte'
  import Settings from './components/Main/Settings.svelte'

  const mainContentId = 'main-content'
  let currentPage = {component:Home}

  function moveToPage(e) {
    const { alias } = e.detail;
    switch(alias) {
      case 'queue': currentPage = {component:Home}; break;
      case 'settings': currentPage = {component:Settings}; break;
    }
  }
</script>

<div class="aud-c-main">
  <MainNav
    on:move-to-page={moveToPage}
    {mainContentId}
    {currentPage}
  />
  <div id={mainContentId}>
    {#if $loading}
      <Spinner />
    {/if}
    {#if !$loading}
      <svelte:component this={currentPage.component}/>
    {/if}
  </div>
</div>
