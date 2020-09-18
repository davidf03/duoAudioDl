<script lang="ts">
import type { iNavItem } from '../../interfaces/iNav';
import NavItem from './NavItem.svelte';

export let skipId:string = '';
export let currentSection:iNavItem;
export let navItems:iNavItem[];
</script>

<a
  href={`#${skipId}`}
  tabindex="0"
  class="dag-c-skip-nav"
>Skip Navigation</a>

<div class="dag-c-main-nav">
  <nav class="dag-c-main-nav">
    <span class="dag-c-main-nav__brand">Duo-Anki Generator</span>
    <ul class="dag-c-main-nav__list dag-o-semantic-list">
      {#each navItems as navItem}
        <li
          aria-hidden={navItem.disabled}
          class="dag-c-main-nav__item"
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
