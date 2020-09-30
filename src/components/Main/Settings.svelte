<script lang="ts">
import { FALLBACK_DECK_ID } from '../../consts';
import { onDestroy } from 'svelte';
import {
  prefs,
  lng,
  deckNamesAndIds,
  templateNamesAndIds,
  loadingStore
} from '../../store';
import { iNameAndId } from '../../interfaces/iNameAndId';
import Spinner from '../Icons/Spinner.svelte';

const fallbackDeckId = FALLBACK_DECK_ID;

let deckId:number;
let deckOptions:iNameAndId[] = $deckNamesAndIds.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
let templateId:number;
let templateOptions:iNameAndId[] = $templateNamesAndIds.sort((a, b) => a.name > b.name ? 1 : a.name < b.name ? -1 : 0);
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
  const lngPref = $prefs?.lngs?.[$lng]?.deckNameAndId;
  deckId = lngPref && $deckNamesAndIds.find(d => d.id === lngPref.id)?.id
    || $deckNamesAndIds.some(d => d.id === fallbackDeckId) && fallbackDeckId
    || $deckNamesAndIds.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)?.[0]?.id
}
function setTemplateToLngDefault (): void {
  // if pref exists and can be found, otherwise use fallbacks
  const lngPref = $prefs?.lngs?.[$lng]?.templateNameAndId;
  templateId = lngPref && $templateNamesAndIds.find(t => t.id === lngPref.id)?.id
    || $templateNamesAndIds.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0)?.[0]?.id
}

function initLngPrefs (): void {
  $prefs.lngs ??= {};
  $prefs.lngs[$lng] ??= {};
}

function onBlurDecks (): void {
  initLngPrefs();
  $prefs.lngs[$lng].deckNameAndId = $deckNamesAndIds.find(d => d.id === deckId);
}
function onBlurTemplates (): void {
  initLngPrefs();
  $prefs.lngs[$lng].templateNameAndId = $templateNamesAndIds.find(t => t.id === templateId);
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
  <label for="settings-deck-selector" class="dag-u-d-b">Create cards in deck</label>
  <select
    id="settings-deck-selector"
    bind:value={deckId}
    on:blur={onBlurDecks}
    disabled={deckOptions.length === 0}
  >
    {#if deckOptions.length === 0}
      <option selected>No decks found</option>
    {:else}
      {#each deckOptions as d}
        <option
          value={d.id}
          selected={d.id === deckId}
        >{d.name}</option>
      {/each}
    {/if}
  </select>

  <label for="settings-template-selector" class="dag-u-d-b">Use template</label>
  <select
    id="settings-template-selector"
    bind:value={templateId}
    on:blur={onBlurTemplates}
    disabled={templateOptions.length === 0}
  >
    {#if templateOptions.length === 0}
      <option selected>No templates found</option>
    {:else}
      {#each templateOptions as t}
        <option
          value={t.id}
          selected={t.id === templateId}
        >{t.name}</option>
      {/each}
    {/if}
  </select>

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
