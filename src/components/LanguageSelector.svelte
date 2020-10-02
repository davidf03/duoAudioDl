<script lang="ts">
import {
  lngs,
  lng,
  loadingLngs,
  loadedLngs,
  loadingLng
} from '../store'
// import ISO6391 from 'iso-639-1'

const id:string = 'dag-language-selector-label'
</script>

<label
  for={id}
  class="dag-u-accessible-hidden"
>Choose Language</label>
<select
  {id}
  bind:value={$lng}
  disabled={$loadingLng || $loadingLngs || $loadedLngs && $lngs.length === 0}
>
  {#if $loadingLng || $loadingLngs}
    <option>Loading...</option>
  {:else if $loadedLngs}
    {#each $lngs as l}
      <option
        value={l}
        default={$lngs.indexOf(l) === $lngs.indexOf($lng)}
      >{l}</option>
    {/each}
  {:else}
    <option>Not loaded</option>
  {/if}
</select>
