<script lang="ts">
// on save, move right, list from bottom closes overtop (not visible beneath list unless last item)
// on ignore, move left, "

// media preview
// ignore
// [body click]
//   fields
//     deck [with default]
//     template [with default]
//     [template fields]
//     tags
//     [group: editable]
//   save

import { createEventDispatcher, onDestroy } from 'svelte';
import { lng, expandedCardId } from '../../store';
import type { iCard } from '../../interfaces/iCards';
import MediaPlayer from '../MediaPlayer.svelte';


const dispatch = createEventDispatcher();
export let card:iCard;
export let headingPriority:number = 3;
const id:string = card.audioUrl;
let isOpen:boolean = false;


const unsubFromLng = lng.subscribe(() => isOpen = false);
onDestroy(unsubFromLng);

const unsubFromExpandedCardId = expandedCardId.subscribe(val => val && val !== id && isOpen && close());
onDestroy(unsubFromExpandedCardId);

function open (): void {
  expandedCardId.set(id);
  isOpen = true;
}
function close (): void {
  $expandedCardId === id && expandedCardId.unset();
  isOpen = false;
}

function onClickMain (e): void {
  isOpen ? close() : open();
}
function onClickIgnore (e): void {
  dispatch('ignorecard', { id });
}
</script>

<div class="dag-c-card">
  <div class="dag-c-card__header dag-o-bg-btn-set">
    <MediaPlayer
      {id}
      audioFile={card.audioFile}
      classlist="dag-c-card__media dag-o-bg-btn-set__sibling dag-u-d-b"
    />
    <h3 class="dag-c-card__name">{card.audioUrl}</h3>
    <button
      on:click={onClickIgnore}
      title="Ignore"
      class="dag-c-card__ignore dag-o-bg-btn-set__sibling"
    >I</button>
    <button
      on:click={onClickMain}
      class="dag-o-bg-btn-set__btn dag-o-unbutton"
    ><span class="dag-u-accessible-hidden">{isOpen ? 'Collapse' : 'Expand'} card</span></button>
  </div>
  {#if isOpen}
    <div>
      card content
    </div>
  {/if}
</div>
