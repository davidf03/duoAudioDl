<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { iNavItem } from '../../interfaces/iNav';

export let navItem:iNavItem;
export let toggled:boolean = false;

const dispatch = createEventDispatcher(); // TODO type

function dispatchMoveToSection (): void {
  dispatch('move-to-section', { alias: navItem.alias });
}
</script>

{#if navItem.disabled}
  <span
    class="dag-c-main-nav-btn dag-u-c-p"
    class:dag-c-main-nav-btn--toggled={toggled}
  >{navItem.icon}</span>
{:else}
  <a
    href="#"
    tabindex="0"
    title={navItem.name}
    class="dag-c-main-nav-btn dag-u-c-p"
    class:dag-c-main-nav-btn--toggled={toggled}
    on:click={dispatchMoveToSection}
  >{navItem.icon}</a>
{/if}
