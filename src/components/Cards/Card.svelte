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
export let headingPriority:number = 3;

const dispatch = createEventDispatcher();

const id:string = card.id;
let isMainHovered:boolean = false;
let isOpen:boolean = false;


const unsubFromLng = lng.subscribe(val => isOpen = false);
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

function onClickMain (e): void {
  isOpen ? close() : open();
}
function onClickIgnore (e): void {
  dispatch('ignore', { id });
}
</script>

<div class="dag-c-card">
  <div class="dag-c-card__header dag-o-bg-btn-set">
    <MediaPlayer
      audioUrl={card.audioUrl}
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
