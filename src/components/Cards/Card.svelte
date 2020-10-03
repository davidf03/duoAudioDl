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
import { CARD_TAG_VALID_CHARS } from '../../consts';
import {
  lng,
  expandedCardId,
  prefs,
  deckNamesAndIds,
  templates
} from '../../store';
import type { iCard } from '../../interfaces/iCards';
import type { iNameAndId } from '../../interfaces/iNameAndId';
import type { iTemplate } from '../../interfaces/iTemplate';
import Spinner from '../Icons/Spinner.svelte';
import MediaPlayer from '../MediaPlayer.svelte';
import Selector from '../Inputs/Selector.svelte';
import Field from '../Inputs/Field.svelte';
import Tokeniser from '../Inputs/Tokeniser.svelte';


const dispatch = createEventDispatcher();
const validTagPatternRegex:RegExp = new RegExp(`^[${CARD_TAG_VALID_CHARS}]*$`);
const invalidTagPatternRegex:RegExp = new RegExp(`[^${CARD_TAG_VALID_CHARS}]`, 'g');
export let card:iCard;
const id:string = card.audioUrl;
let isOpen:boolean = false;

let deckOptions:iNameAndId[] =
  $deckNamesAndIds?.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0) // alphabetical
  ?? [];
const prefsDeckId:number = $prefs?.lngs?.[$lng]?.deckId;
let deckId:number = 
  $deckNamesAndIds?.find((d:iNameAndId): boolean => d.id === card.deckId)?.id // ensures saved ids map
  ?? $deckNamesAndIds?.find((d:iNameAndId): boolean => d.id === prefsDeckId)?.id
  ?? deckOptions?.[0]?.id;

let templateOptions:iNameAndId[] =
  ($templates?.map(({fields, ...t}): iNameAndId => t as iNameAndId) ?? [])
  .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0); // alphabetical
const prefsTemplateId:number = $prefs?.lngs?.[$lng]?.templateId;
let templateId:number =
  templateOptions.find((t:iNameAndId): boolean => t.id === card.templateId)?.id // ensures saved id maps
  ?? templateOptions.find((t:iNameAndId): boolean => t.id === prefsTemplateId)?.id
  ?? templateOptions?.[0]?.id;

let template:iTemplate;
setTemplate();
function setTemplate (): void {
  template = $templates?.find((t:iTemplate): boolean => t.id === templateId) ?? null;
}

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
function onSubmit (): void {
  dispatch('cardsubmitted', { card, tags, deckId, templateId });
}
function onChangeDeckSelector (): void {
  card.deckId = deckId;
}
function onChangeTemplateSelector (): void {
  card.templateId = templateId;
  setTemplate();
}
function onInputField (): void {
  dispatch('fieldsupdated');
}
function onUpdateTags (e): void {
  const { tokens } = e.detail;
  card.tags = tokens.filter((tkn:string): boolean => !defaultTags.includes(tkn));
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
    {#if !isOpen}
      <button
        on:click={onClickIgnore}
        title="Ignore"
        class="dag-c-card__ignore dag-o-bg-btn-set__sibling"
      >I</button>
    {/if}
    <button
      on:click={onClickMain}
      class="dag-o-bg-btn-set__btn dag-o-unbutton"
    ><span class="dag-u-accessible-hidden">{isOpen ? 'Collapse' : 'Expand'} card</span></button>
  </div>
  {#if isOpen}
    <div class="dag-c-card__body">
      <form
        on:submit|preventDefault={onSubmit}
        class="dag-o-form dag-u-d-x dag-u-xd-r dag-u-xw-w"
      >
        <Selector
          bind:value={deckId}
          on:change={onChangeDeckSelector}
          options={deckOptions.map(o => ({val:o.id, text:o.name}))}
          emptyText="No decks found"
          id={`${id}-deck-selector`}
          label="Create in deck"
          required
          classlist="dag-o-form__field-1/2"
        />
        <Selector
          bind:value={templateId}
          on:change={onChangeTemplateSelector}
          options={templateOptions.map(o => ({val:o.id, text:o.name}))}
          useOnChange
          emptyText="No templates found"
          id={`${id}-template-selector`}
          label="Use template"
          required
          classlist="dag-o-form__field-1/2"
        />
        {#if $templates.length === 0 || !template}
          <p>Open Anki to begin creating cards</p>
        {:else}
          {#each template?.fields || [] as field (field)}
            {#if field !== 'audio'}
              <Field
                bind:value={card.fields[field]}
                on:input={onInputField}
                placeholder="Enter data"
                id={`${id}-${field.replace(/\s/g,'-').toLowerCase()}`}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                classlist="dag-o-form__field"
              />
            {/if}
          {/each}
        {/if}
        <Tokeniser
          on:update={onUpdateTags}
          id={`${id}-tags-entry`}
          tokens={tags}
          validPatternRegex={validTagPatternRegex}
          invalidPatternRegex={invalidTagPatternRegex}
          tokenSemanticName="tag"
          label="Add tags"
          classlist="dag-o-form__field"
        />
        <div class="dag-u-d-x dag-u-xd-rr">
          <button
            type="submit"
          >Create</button>
          <button
            on:click={onClickIgnore}
            class="dag-u-mie-a"
          >Ignore</button>
        </div>
      </form>
    </div>
  {/if}
</div>
