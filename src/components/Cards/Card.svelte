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

import { createEventDispatcher, onDestroy } from 'svelte';
import audioUrlParser from '../../util/audioUrlParser';
import { lng, expandedCardId } from '../../store';
import type { iCard } from '../../interfaces/iCards';
import MediaPlayer from '../MediaPlayer.svelte';

export let card:iCard;
export let pending:boolean = false;

const dispatch = createEventDispatcher();

const id:string = audioUrlParser.getId(card.audioUrl);
let isOpen:boolean = false;
let isPlayBtnPressed:boolean = false;
let deck:number


const unsubFromLng = lng.subscribe(val => { // TODO type
  isOpen = false;
});
onDestroy(unsubFromLng);

const unsubFromExpandedCardId = expandedCardId.subscribe(val => val && val !== id && isOpen && close());
onDestroy(unsubFromExpandedCardId);

function open (): void {
  expandedCardId.set(id);
  isOpen = true;
}
function close (): void {
  isOpen = false;
}

function onClick (e): void {
  isOpen ? close() : open();
}
</script>

<div
  class="dag-c-card dag-o-bg-btn-set"
>
  <MediaPlayer
    audioUrl={card.audioUrl}
    classlist="dag-o-bg-btn-set__sibling dag-u-d-b"
  />
  <!-- <span>{card.audioUrl}</span> -->
  <button
    on:click={onClick}
    class="dag-o-bg-btn-set__btn dag-o-unbutton"
  ><span class="dag-u-accessible-hidden">{isOpen ? 'Collapse' : 'Expand'} card</span></button>
</div>
{#if isOpen}
  <div>
    card content
  </div>
{/if}
