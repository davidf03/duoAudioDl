<script>
  export let mainContentId = '';
  export let currentPage = '';

  import { createEventDispatcher } from 'svelte'
  import MainNavItem from './MainNavItem.svelte'

  const dispatch = createEventDispatcher()

  const navItems = [
    {
      alias: 'queue',
      name: 'Queue',
      icon: 'Q'
    },
    {
      alias: 'settings',
      name: 'Settings',
      icon: 'S'
    }
  ];

  function dispatchMoveToPage(e) {
    dispatch('move-to-page', e.detail);
  }
</script>

<a
  href={`#${mainContentId}`}
  tabindex="0"
  class="aud-c-skip-nav"
>Skip Navigation</a>

<nav class="aud-c-main-nav">
  <h1 class="aud-c-main-nav__brand">Duo-Anki Generator</h1>
  <ul class="aud-c-main-nav__list aud-o-semantic-list">
    {#each navItems as item}
      <li class="aud-c-main-nav__item">
        <MainNavItem
          {...item}
          on:click={dispatchMoveToPage}
          toggled={currentPage === item.alias}
        />
      </li>
    {/each}
  </ul>
</nav>
