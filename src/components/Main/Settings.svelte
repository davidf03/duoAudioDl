<script lang="ts">
import { FALLBACK_DECK_ID } from '../../consts';
import { onDestroy } from 'svelte';
import {
  prefs,
  lng,
  deckNamesAndIds,
  templateNamesAndIds,
  loadingStore,
  loadingAnkiDeckNamesAndIds,
  loadingAnkiTemplateNamesAndIds
} from '../../store';
import type { iLngPrefs } from '../../interfaces/iLngPrefs';
import { iNameAndId } from '../../interfaces/iNameAndId';
import Spinner from '../Icons/Spinner.svelte';

prefs.useLocalStorage()

let deckId:number;
let deckOptions:iNameAndId[];
let templateId:number;
let templateOptions:iNameAndId[];

const unsubFromLoadingStore = loadingStore.subscribe(val => {
  setDeckToLngDefault();
  setTemplateToLngDefault();
});
onDestroy(unsubFromLoadingStore);

const unsubFromLng = lng.subscribe(l => { // TODO type
  setDeckToLngDefault();
  setTemplateToLngDefault();
});
onDestroy(unsubFromLng);

function setDeckToLngDefault (): void {
  // if pref exists and can be found, otherwise use fallbacks
  const lngPref = $prefs?.lngs?.[$lng]?.deckNameAndId;
  deckId = lngPref && $deckNamesAndIds.find(d => d.id === lngPref.id)?.id
    || $deckNamesAndIds.find(d => d.id === FALLBACK_DECK_ID)?.id
    || $deckNamesAndIds.sort((a, b) => a.id > b.id)?.[0]?.id
}

function setTemplateToLngDefault (): void {
  // if pref exists and can be found, otherwise use fallbacks
  const lngPref = $prefs?.lngs?.[$lng]?.templateNameAndId;
  templateId = lngPref && $templateNamesAndIds.find(t => t.id === lngPref)?.id
    || $templateNamesAndIds.sort((a, b) => a.id > b.id)?.[0]?.id
}

function onBlurDecks (): void {
  const deckNameAndId = $deckNamesAndIds.find(d => d.id === deckId);
  const lngPrefs = $prefs?.lngs?.[$lng];
  if (lngPrefs) {
    lngPrefs.deckNameAndId = deckNameAndId;
    return;
  }
  $prefs.lngs ??= {};
  $prefs.lngs[$lng] ??= {};
  $prefs.lngs[$lng].deckNameAndId = deckNameAndId;
}

function onBlurTemplates (): void {
  const templateNameAndId = $templateNamesAndIds.find(t => t.id === templateId);
  const lngPrefs = $prefs?.lngs?.[$lng];
  if (lngPrefs) {
    lngPrefs.templateNameAndId = templateNameAndId;
    return;
  }
  $prefs.lngs ??= {};
  $prefs.lngs[$lng] ??= {};
  $prefs.lngs[$lng].templateNameAndId = templateNameAndId;
}
</script>

{#if $loadingStore}
  <div class="aud-u-ta-c">
    <Spinner />
  </div>
{:else}
  <label for="settings-deck-selector">Create cards in deck</label>
  <select
    id="settings-deck-selector"
    bind:value={deckId}
    on:blur={onBlurDecks}
    disabled={deckOptions.length === 0}
  >
    {#if deckOptions.length === 0}
      <option checked>No decks found</option>
    {:else}
      {#each deckOptions as d}
        <option
          value={d.id}
          checked={d.id === deckId}
        >{d.name}</option>
      {/each}
    {/if}
  </select>

  <label for="settings-template-selector">Use template</label>
  <select
    id="settings-template-selector"
    bind:value={templateId}
    on:blur={onBlurTemplates}
    disabled={templateOptions.length === 0}
  >
    {#if templateOptions.length === 0}
      <option checked>No templates found</option>
    {:else}
      {#each templateOptions as t}
        <option
          value={t.id}
          checked={t.id === templateId}
        >{t.name}</option>
      {/each}
    {/if}
  </select>
{/if}
