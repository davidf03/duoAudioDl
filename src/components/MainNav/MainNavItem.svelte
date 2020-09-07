<script>
  export let alias = '';
  export let name = '';
  export let icon = '';
  export let toggled = false;

  import { createEventDispatcher } from 'svelte'

  const dispatch = createEventDispatcher();

  function dispatchClick() {
    dispatch('click', { alias });
  }
</script>

<!-- on:click={dispatch('click')} -->
<a
  on:click={dispatchClick}
  href="#"
  tabindex="0"
  title={name}
  class="aud-c-main-nav-btn aud-u-c-p"
  class:aud-c-main-nav-btn--toggled={toggled}
>{icon}</a>
