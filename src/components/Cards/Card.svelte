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
import { lng, expandedCardId, prefs } from '../../store';
import type { iCard } from '../../interfaces/iCards';
import Spinner from '../Icons/Spinner.svelte';
import MediaPlayer from '../MediaPlayer.svelte';
import Tokeniser from '../Inputs/Tokeniser.svelte';


const dispatch = createEventDispatcher();
export let card:iCard;
const id:string = card.audioUrl;
let isOpen:boolean = false;

let defaultTags:string[] = [];
if ($prefs?.lngs?.[$lng]?.useLngTag !== false) defaultTags = [...defaultTags, `dag-${$lng}`];
if ($prefs?.lngs?.[$lng]?.useGroupTag !== false) defaultTags = [...defaultTags, ...card.groups.map(
  (gn:string): string => `dag-${$lng}-${gn.replace(/[^\w\d\-_]/g, '').toLowerCase()}`
)];
console.log(defaultTags);
const tags:string[] = Array.from(new Set([].concat(
  defaultTags,
  card.tags || []
)));

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

function onClickMain (): void {
  isOpen ? close() : open();
}
function onClickIgnore (): void {
  dispatch('cardignored', { id });
}
function onUpdateTags (e): void {
  const { tokens } = e.detail;
  card.tags = tokens.filter((tkn:string): boolean => !defaultTags.includes(tkn)); // TODO consider actually adding then removing these on settings change
  dispatch('fieldsupdated');
}
</script>

<div class="dag-c-card">
  <div class="dag-c-card__header dag-o-bg-btn-set">
    {#if !card.audioFile}
      <Spinner />
    {:else}
      <MediaPlayer
        {id}
        audioFile={card.audioFile}
        classlist="dag-c-card__media dag-o-bg-btn-set__sibling dag-u-d-b"
      />
    {/if}
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
    <div class="dag-c-card__body">
      <Tokeniser
        on:update={onUpdateTags}
        tokens={tags}
        tokenSemanticName="tag"
      />
    </div>
  {/if}
</div>
