<script>
  export let skipId = ''
  export let currentSection = {}
  export let navItems = []

  import NavItem from './NavItem.svelte'
</script>

<a
  href={`#${skipId}`}
  tabindex="0"
  class="aud-c-skip-nav"
>Skip Navigation</a>

<div class="aud-c-main-nav">
  <nav class="aud-c-main-nav">
    <span class="aud-c-main-nav__brand">Duo-Anki Generator</span>
    <ul class="aud-c-main-nav__list aud-o-semantic-list">
      {#each navItems as item}
        <li
          aria-hidden={item.disabled}
          class="aud-c-main-nav__item"
        >
          <NavItem
            {...item}
            on:move-to-section
            toggled={currentSection.alias === item.alias}
          />
        </li>
      {/each}
    </ul>
  </nav>
</div>
