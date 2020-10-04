<script lang="ts">
import { onMount, createEventDispatcher } from 'svelte';
import type { iNavItem } from '../../interfaces/iNav';
import NavItem from './NavItem.svelte';

export let skipId:string = '';
export let currentSection:iNavItem;
export let navItems:iNavItem[];

const dispatch = createEventDispatcher();

onMount(() => dispatch('mount'));
</script>

<a
  href={`#${skipId}`}
  tabindex="0"
  class="dag-o-skip-btn dag-o-btn dag-o-btn--v-skip dag-o-btn--t-main"
>Skip Navigation</a>

<nav class="dag-c-nav dag-u-d-x dag-u-xd-r dag-u-ai-c">
  <span class="dag-c-nav__brand dag-o-key-type dag-o-h-xl dag-u-mbe-0">DuoAnkiGen</span>
  <ul class="dag-c-nav__list dag-o-semantic-list dag-u-d-c">
    {#each navItems as navItem, index}
      <li
        aria-hidden={navItem.disabled}
        class="dag-c-nav__item {index === 0 ? 'dag-u-mis-a' : ''}"
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

<style lang="scss">
.dag-c-nav {

  &__item {
    block-size: 100%;
    inline-size: 32px;
  }
}
</style>
