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
import type { iCard } from '../../interfaces/iCards';
import { lng, expandedCardId } from '../../store';
import MediaPlayer from '../MediaPlayer.svelte';
import audioUrlParser from '../../util/audioUrlParser';

export let card:iCard;
export let pending:boolean = false;

const dispatch = createEventDispatcher();

const id:string = audioUrlParser.getId(card.audioUrl);
let isOpen:boolean = false;
let isPlayBtnPressed:boolean = false;

const unsubFromLng = lng.subscribe(val => { // TODO type
  isOpen = false;
});
onDestroy(unsubFromLng);

const unsubFromExpandedCardId = expandedCardId.subscribe(val => val && val !== id && close());
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
  class="aud-c-card aud-o-bg-btn-set"
>
  <MediaPlayer
    audioUrl={card.audioUrl}
    classlist="aud-o-bg-btn-set__sibling aud-u-d-b"
  />
  <!-- <span>{card.audioUrl}</span> -->
  <button
    on:click={onClick}
    class="aud-o-bg-btn-set__btn aud-o-unbutton"
  ><span class="aud-u-accessible-hidden">{isOpen ? 'Collapse' : 'Expand'} card</span></button>
</div>
{#if isOpen}
  <div>
    card content
  </div>
{/if}
