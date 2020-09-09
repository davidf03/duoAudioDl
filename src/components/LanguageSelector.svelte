<script>
  import { lngs, lng, loadingStore } from '../store'
  import ISO6391 from 'iso-639-1'

  const id = 'aud-language-selector-label'
</script>

<label
  for={id}
  class="aud-u-accessible-hidden"
>Choose Language</label>
<select
  {id}
  bind:value={$lng}
  on:blur={lng.useLocalStorage()}
  disabled={$loadingStore}
>
  {#if $loadingStore}
    <option value={undefined}>Loading...</option>
  {/if}
  {#each $lngs as l}
    <option
      value={l}
      default={$lngs.indexOf(l) === $lngs.indexOf($lng)}
    >{ISO6391.getName(l)}</option>
  {/each}
</select>
