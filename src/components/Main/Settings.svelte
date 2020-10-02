<script lang="ts">
import { FALLBACK_DECK_ID } from '../../consts';
import { onDestroy } from 'svelte';
import {
  prefs,
  lng,
  deckNamesAndIds,
  loadingStore,
  templates
} from '../../store';
import { iNameAndId } from '../../interfaces/iNameAndId';
import Spinner from '../Icons/Spinner.svelte';
import Selector from '../Inputs/Selector.svelte';

const fallbackDeckId:number = FALLBACK_DECK_ID;

let deckId:number;
let deckOptions:iNameAndId[] =
  $deckNamesAndIds?.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0)
  ?? [];

let templateId:number;
let templateOptions:iNameAndId[] =
  ($templates.map(({fields, ...t}): iNameAndId => t as iNameAndId) ?? [])
  .sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);

let useLngTag:boolean = $prefs?.lngs?.[$lng]?.useLngTag ?? true;
let useGroupTag:boolean = $prefs?.lngs?.[$lng]?.useGroupTag ?? true;

const unsubFromLoadingStore = loadingStore.subscribe(val => !val && setDefaults());
onDestroy(unsubFromLoadingStore);

const unsubFromLng = lng.subscribe(() => setDefaults()) // TODO type
onDestroy(unsubFromLng);

function setDefaults (): void {
  if (!$lng) return;
  setDeckToLngDefault();
  setTemplateToLngDefault();
}

function setDeckToLngDefault (): void {
  // if pref exists and can be found, otherwise use fallbacks
  const lngPref = $prefs?.lngs?.[$lng]?.deckId;
  deckId =
    (lngPref >= 0 && $deckNamesAndIds.find(d => d.id === lngPref)?.id)
    ?? ($deckNamesAndIds.some(d => d.id === fallbackDeckId) && fallbackDeckId)
    ?? deckOptions?.[0]?.id;
}
function setTemplateToLngDefault (): void {
  // if pref exists and can be found, otherwise use fallbacks
  const lngPref = $prefs?.lngs?.[$lng]?.templateId;
  templateId =
    (lngPref >= 0 && templateOptions.find(t => t.id === lngPref)?.id)
    ?? templateOptions?.[0]?.id;
}

function initLngPrefs (): void {
  $prefs.lngs ??= {};
  $prefs.lngs[$lng] ??= {};
}

function onChangeDecks (): void {
  initLngPrefs();
  $prefs.lngs[$lng].deckId = deckId;
}
function onChangeTemplates (): void {
  initLngPrefs();
  $prefs.lngs[$lng].templateId = templateId;
}
async function onChangeLngTag (): Promise<void> {
  initLngPrefs();
  setTimeout(() => $prefs.lngs[$lng].useLngTag = useLngTag); // TODO is there a better way to wait for this change to occur, directly?
}
async function onChangeGroupTag (): Promise<void> {
  initLngPrefs();
  setTimeout(() => $prefs.lngs[$lng].useGroupTag = useGroupTag);
}
</script>

{#if $loadingStore}
  <div class="dag-u-ta-c">
    <Spinner />
  </div>
{:else}
  <Selector
    bind:value={deckId}
    on:change={onChangeDecks}
    options={deckOptions.map(o => ({val:o.id, text:o.name}))}
    emptyText="No decks found"
    id="settings-deck-selector"
    label="Create cards in deck"
    classlist="dag-u-d-b"
  />

  <Selector
    bind:value={templateId}
    on:change={onChangeTemplates}
    options={templateOptions.map(o => ({val:o.id, text:o.name}))}
    emptyText="No templates found"
    id="settings-template-selector"
    label="Use template"
    classlist="dag-u-d-b"
  />

  <label for="settings-lng-tag" class="dag-u-d-b">
    <input
      on:change={onChangeLngTag}
      id="settings-lng-tag"
      type="checkbox"
      bind:checked={useLngTag}
    />
    <span>Add language tag to cards</span>
  </label>

  <label for="settings-group-tag" class="dag-u-d-b">
    <input
      on:change={onChangeGroupTag}
      id="settings-group-tag"
      type="checkbox"
      bind:checked={useGroupTag}
    />
    <span>Add group tag to cards</span>
  </label>
  {/if}
