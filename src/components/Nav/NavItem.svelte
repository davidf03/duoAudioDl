<script>
  export let alias = '';
  export let name = '';
  export let icon = '';
  export let toggled = false;

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher();

  function dispatchMoveToPage() {
    if (toggled) {
      return;
    }
    dispatch('move-to-page', { alias });
  }
</script>

<!-- on:click={dispatch('click')} -->
<a
  on:click={dispatchMoveToPage}
  href="#"
  tabindex="0"
  title={name}
  class="aud-c-main-nav-btn aud-u-c-p"
  class:aud-c-main-nav-btn--toggled={toggled}
>{icon}</a>
