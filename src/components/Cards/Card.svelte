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

import { CARD_TAG_VALID_CHARS } from '../../consts';
import { createEventDispatcher, onDestroy } from 'svelte';
import { lng, expandedCardId, prefs, deckNamesAndIds, templateNamesAndIds } from '../../store';
import type { iCard } from '../../interfaces/iCards';
import type { iNameAndId } from '../../interfaces/iNameAndId';
import Spinner from '../Icons/Spinner.svelte';
import MediaPlayer from '../MediaPlayer.svelte';
import Selector from '../Inputs/Selector.svelte';
import Tokeniser from '../Inputs/Tokeniser.svelte';


const dispatch = createEventDispatcher();
const validTagPatternRegex:RegExp = new RegExp(`^[${CARD_TAG_VALID_CHARS}]*$`);
const invalidTagPatternRegex:RegExp = new RegExp(`[^${CARD_TAG_VALID_CHARS}]`, 'g');
export let card:iCard;
const id:string = card.audioUrl;
let isOpen:boolean = false;

let deckOptions:iNameAndId[] = $deckNamesAndIds?.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
let deckId:number = card.deckId ?? $prefs?.lngs?.[$lng]?.deckNameAndId?.id ?? deckOptions?.[0]?.id;

let templateOptions:iNameAndId[] = $templateNamesAndIds?.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
let templateId:number = card.templateId ?? $prefs?.lngs?.[$lng]?.templateNameAndId?.id ?? templateOptions?.[0]?.id;

let defaultTags:string[] = [];
if ($prefs?.lngs?.[$lng]?.useLngTag !== false) defaultTags = [...defaultTags, `dag-${$lng}`];
if ($prefs?.lngs?.[$lng]?.useGroupTag !== false) defaultTags = [...defaultTags, ...card.groups.map(
  (gn:string): string => `dag-${$lng}-${gn.replace(invalidTagPatternRegex, '').toLowerCase()}`
)];
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
  card.tags = tokens.filter((tkn:string): boolean => !defaultTags.includes(tkn));
  dispatch('fieldsupdated');
}
function onChangeDeckSelector (): void {
  card.deckId = deckId;
}
function onChangeTemplateSelector (): void {
  card.templateId = templateId;
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
      <Selector
        bind:value={deckId}
        on:change={onChangeDeckSelector}
        options={deckOptions.map(o => ({val:o.id, text:o.name}))}
        emptyText="No decks found"
        id={`${id}-deck-selector`}
        label="Create in deck"
        classlist="dag-u-d-b"
      />
      <Selector
        bind:value={templateId}
        on:change={onChangeTemplateSelector}
        options={templateOptions.map(o => ({val:o.id, text:o.name}))}
        emptyText="No templates found"
        id={`${id}-template-selector`}
        label="Use template"
        classlist="dag-u-d-b"
      />
      <Tokeniser
        on:update={onUpdateTags}
        id={`${id}-tags-entry`}
        tokens={tags}
        validPatternRegex={validTagPatternRegex}
        invalidPatternRegex={invalidTagPatternRegex}
        tokenSemanticName="tag"
        label="Add tags"
      />
    </div>
  {/if}
</div>
