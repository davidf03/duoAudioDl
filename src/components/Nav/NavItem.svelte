<script>
export let alias = '';
export let name = '';
export let icon = '';
export let toggled = false;
export let disabled = false;

import { createEventDispatcher } from 'svelte'

const dispatch = createEventDispatcher();

function dispatchMoveToPage() {
  dispatch('move-to-section', { alias });
}
</script>

<!-- on:click={dispatch('click')} -->
{#if disabled}
  <span
    class="aud-c-main-nav-btn aud-u-c-p"
    class:aud-c-main-nav-btn--toggled={toggled}
  >{icon}</span>
{:else}
  <a
    on:click={dispatchMoveToPage}
    href="#"
    tabindex="0"
    title={name}
    class="aud-c-main-nav-btn aud-u-c-p"
    class:aud-c-main-nav-btn--toggled={toggled}
  >{icon}</a>
{/if}
