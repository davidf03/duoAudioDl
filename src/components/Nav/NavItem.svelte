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
    class="dag-c-nav-btn"
    class:dag-c-main-nav-btn--toggled={toggled}
  >{navItem.icon}</span>
{:else}
  <a
    href="#"
    title={navItem.name}
    class="dag-c-nav-btn"
    class:dag-c-main-nav-btn--toggled={toggled}
    on:click={dispatchMoveToSection}
  ><img
    src={navItem.icon}
    aria-hidden="true"
    alt=""
  /></a>
{/if}

<style lang="scss">
.dag-c-nav-btn {
  display: block;
  padding: 3px;
}
</style>
