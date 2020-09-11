<script lang="ts">
import type { iNavItem } from '../../interfaces/Nav';
import NavItem from './NavItem.svelte';

export let skipId:string = '';
export let currentSection:iNavItem;
export let navItems:iNavItem[];
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
      {#each navItems as navItem}
        <li
          aria-hidden={navItem.disabled}
          class="aud-c-main-nav__item"
        >
          <NavItem
            {navItem}
            toggled={currentSection.alias === navItem.alias}
            on:move-to-section
          />
        </li>
      {/each}
    </ul>
  </nav>
</div>
