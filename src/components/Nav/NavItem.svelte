<script lang="ts">
import { createEventDispatcher } from 'svelte';
import type { iNavItem } from '../../interfaces/iNav';
import QueueIcon from '../Icons/Queue.svelte';

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
  >
    <svelte:component this={navItem.icon} />
  </span>
{:else}
  <a
    href="#"
    title={navItem.name}
    class="dag-c-nav-btn"
    class:dag-is-active={toggled}
    on:click={dispatchMoveToSection}
  >
    <svelte:component this={navItem.icon} />
  </a>
{/if}

<style global lang="scss">
.dag-c-nav-btn {
  display: block;
  padding: 16%;

  & > svg {
    stroke-width: 0;
    stroke: var(--dag-nav);
    fill: var(--dag-nav);
  }
  &:hover > svg {
    stroke: var(--dag-nav-hover);
    fill: var(--dag-nav-hover);
  }
  &.dag-is-active > svg {
    stroke: var(--dag-nav-active);
    fill: var(--dag-nav-active);
  }
  &.dag-is-active:hover > svg {
    stroke: var(--dag-nav-active-hover);
    fill: var(--dag-nav-active-hover);
  }
}
</style>
