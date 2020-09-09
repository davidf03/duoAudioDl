<script>
  import { loading, queue } from './store'
  import Nav from './components/Nav/Nav.svelte'
  import Spinner from './components/Icons/Spinner.svelte'
  import Queue from './components/Main/Queue.svelte'
  import History from './components/Main/History.svelte'
  import Settings from './components/Main/Settings.svelte'

  const mainContentId = 'main-content'
  const navItems = [
    {
      alias: 'queue',
      component: Queue,
      name: 'Queue',
      icon: 'Q'
    },
    {
      alias: 'history',
      component: History,
      name: 'History',
      icon: 'H'
    },
    {
      alias: 'settings',
      component: Settings,
      name: 'Settings',
      icon: 'S'
    }
  ]
  let currentSection = navItems[0]

  function moveToSection(e) {
    currentSection = navItems.find(s => s.alias === e.detail.alias)
  }
</script>

<div class="aud-c-main">
  <Nav
    skipId={mainContentId}
    navItems={navItems.map(({ component, ...i }) => i)}
    {currentSection}
    on:move-to-section={moveToSection}
  />
  <div id={mainContentId}>
    {#if $loading}
      <Spinner />
    {:else}
      <svelte:component this={currentSection.component}/>
    {/if}
  </div>
</div>
