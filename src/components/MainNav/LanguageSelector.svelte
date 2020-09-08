<script>
  import { lng, lngs, loading } from '../../store'
  import ISO6391 from 'iso-639-1';
</script>

{#if !loading}
  <select
    id="language-selector"
    bind:value={$lng}
    on:blur={lng.useLocalStorage()}
  >
    {#each $lngs as l}
      <option
        value={l}
        checked={l === $lng}
      >{ISO6391.getName(l)}</option>
    {/each}
  </select>
{/if}
