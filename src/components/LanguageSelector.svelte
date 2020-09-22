<script lang="ts">
import { lngs, lng, loadingStore } from '../store'
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
  disabled={$loadingStore}
>
  {#if $loadingStore}
    <option value={undefined}>Loading...</option>
  {/if}
  {#each $lngs as l}
    <option
      value={l}
      default={$lngs.indexOf(l) === $lngs.indexOf($lng)}
    >{l}</option>
  {/each}
</select>
