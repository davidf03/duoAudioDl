<script>
  import { loading, queue } from './store'
  import MainNav from './components/MainNav/MainNav.svelte'
  import Spinner from './components/Icons/Spinner.svelte'
  import Queue from './components/Main/Queue.svelte'
  import Settings from './components/Main/Settings.svelte'

  const mainContentId = 'main-content'
  let currentPage = {component:Queue}

  function moveToPage(e) {
    const { alias } = e.detail;
    switch(alias) {
      case 'settings': currentPage = {component:Settings}; break;
      default:
      case 'queue': currentPage = {component:Queue}; break;
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
