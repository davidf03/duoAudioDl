<script lang="ts">
import { onDestroy } from 'svelte';
import {
  lng,
  queue,
  history,
  ignored,
  resolvedLng
} from '../store'
// import ISO6391 from 'iso-639-1'

const id:string = 'dag-language-selector-label';

let lngs:string[] = [];
const unsubResolvedLng = resolvedLng.subscribe((val:boolean): void => {
  if (!val) return;
  lngs = setLngs();
});
onDestroy(unsubResolvedLng);

function setLngs (): string[] {
  return Array.from(new Set([].concat(
    $queue.getLngs(),
    $history.getLngs(),
    $ignored.getLngs()
  )));
}

</script>

<label
  for={id}
  class="dag-u-accessible-hidden"
>Choose Language</label>
<select
  {id}
  bind:value={$lng}
  disabled={!$resolvedLng || lngs.length === 0}
>
  {#if !$resolvedLng}
    <option>Loading...</option>
  {:else}
    {#each lngs as l}
      <option
        value={l}
        default={lngs.indexOf(l) === lngs.indexOf($lng)}
      >{l}</option>
    {/each}
  {/if}
</select>
