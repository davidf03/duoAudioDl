<script lang="ts">
// on save, move right, list from bottom closes overtop (not visible beneath list unless last item)
// on ignore, move left, "

// media preview
// ignore
// [body click]
//   fields
//     (id)
//     deck [with default]
//     template [with default]
//     [template fields]
//     tags
//     [group: editable]
//   save

import { onDestroy } from 'svelte';
import type { iCard } from '../../interfaces/Cards';
import { lng } from '../../store';
import MediaPlayer from '../MediaPlayer.svelte';

export let card:iCard;
export let pending:boolean = false;

let isOpen:boolean = false;
let isPlayBtnPressed:boolean = false;

const unsubFromLng = lng.subscribe(val => { // TODO type
  isOpen = false;
});
onDestroy(unsubFromLng);

function onClick (e): void {
  isOpen = !isOpen;
}

</script>

<div class="aud-c-card">
  <MediaPlayer
    audioUrl={card.audioUrl}
    {isPlayBtnPressed}
  />
  <!-- <span>{card.audioUrl}</span> -->
  <button
    on:click={onClick}
  ><span class="aud-u-accessible-hidden">{isOpen ? 'Collapse' : 'Expand'} card</span></button>
</div>
{#if isOpen}
  <div>
    
  </div>
{/if}
