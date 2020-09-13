<script lang="ts">
import { onDestroy } from 'svelte'
import type { iTemplate, iDeck, iLngPrefs } from 'src/interfaces/Prefs';
import { prefs, lng, loadingStore } from '../../store'
import ankiConnect from '../../contentScripts/ankiConnect'
import Spinner from '../Icons/Spinner.svelte'

prefs.useLocalStorage()

const defaultDeckId:number = 1;

let loadingDecks:boolean = false;
let decks:iDeck[] = [{
  id: 0,
  name: ''
}];
let deck:number = decks[0].id;

let loadingTemplates:boolean = false;
let templates:iTemplate[] = [{
  id: 0,
  name: ''
}];
let template:number = templates[0].id;

let isConnecting:boolean = true;
let isConnected:boolean = false;
let errMsg:string = '';

(async function load (): Promise<any>  { // TODO type
  isConnecting = true;
  isConnected = false;
  const loadDecksPromise:Promise<any> = getDecks(); // TODO type
  const loadTemplatesPromise:Promise<any> = getTemplates(); // TODO type
  Promise.all([loadDecksPromise,loadTemplatesPromise])
    .then(values => {
      manageDeckData(values[0]);
      manageTemplateData(values[1]);
      isConnecting = false;
      isConnected = true;
    }).catch(err => {
      errMsg = err;
      isConnecting = false;
    });
})();

async function getDecks (): Promise<any> {
  return ankiConnect('deckNamesAndIds', 6);
}
async function getTemplates (): Promise<any> {
  return ankiConnect('modelNamesAndIds', 6);
}
function manageDeckData (res): void {
  decks = Object.keys(res).map(d => ({ name: d, id: res[d] }));
  // update input to reflect previously set default deck for newly created cards (per lng)
  if ($loadingStore) {
    const unsubLoadingStore = loadingStore.subscribe(val => { if (!val) setDeckToLngDefault() }); // TODO type
    onDestroy(unsubLoadingStore);
  } else {
    setDeckToLngDefault();
  }
}
function manageTemplateData (res): void {
  templates = Object.keys(res).map(t => ({ name: t, id: res[t] }));
  // update input to reflect previously set default template for newly created cards (per lng)
  if ($loadingStore) {
    const unsubLoadingStore = loadingStore.subscribe(val => { if (!val) setTemplateToLngDefault() }); // TODO type
    onDestroy(unsubLoadingStore);
  } else {
    setTemplateToLngDefault();
  }
}

const unsubFromLng = lng.subscribe(l => { // TODO type
  if (isConnecting || !isConnected) return;
  setDeckToLngDefault();
  setTemplateToLngDefault();
});
onDestroy(unsubFromLng);

function setDeckToLngDefault (): void {
  // if pref exists and can be found, otherwise use true default
  const lngDeckPref = $prefs?.lngPrefs?.find(lp => lp.lng === $lng)?.deck;
  deck = lngDeckPref && decks.find(d => d.id === lngDeckPref)?.id
    || decks.find(d => d.id === defaultDeckId)?.id
    || decks.map(d => d.id).sort()[0]
    || 0
}
function setTemplateToLngDefault (): void {
  // if pref exists and can be found, otherwise use true default
  const lngTemplatePref = $prefs?.lngPrefs?.find(lp => lp.lng === $lng)?.template;
  template = lngTemplatePref && templates.find(t => t.id === lngTemplatePref)?.id
    || templates.map(t => t.id).sort()[0]
    || 0
}

function onBlurDecks (): void {
  let lngPrefs = $prefs?.lngPrefs?.find(lp => lp.lng === $lng);
  if (lngPrefs) {
    lngPrefs.deck = deck;
    return;
  }
  lngPrefs = {lng: $lng, deck} as iLngPrefs;
  $prefs.lngPrefs
    ? ($prefs.lngPrefs.push(lngPrefs), $prefs.lngPrefs = $prefs.lngPrefs) // TODO study need for assignment for reactivity
    : $prefs.lngPrefs = [lngPrefs] as iLngPrefs[];
}
function onBlurTemplates (): void {
  let lngPrefs = $prefs?.lngPrefs?.find(lp => lp.lng === $lng);
  if (lngPrefs) {
    lngPrefs.template = template;
    return;
  }
  lngPrefs = {lng: $lng, template} as iLngPrefs;
  $prefs.lngPrefs
    ? ($prefs.lngPrefs.push(lngPrefs), $prefs.lngPrefs = $prefs.lngPrefs) // TODO study need for assignment for reactivity
    : $prefs.lngPrefs = [lngPrefs] as iLngPrefs[];
}
</script>

{#if isConnecting}
  <div class="aud-u-ta-c">
    <Spinner />
  </div>
{:else if !isConnected}
  <p>Could not connect to Anki</p>
{:else}
  <label for="deck-selector">Create cards in deck</label>
  <select
    id="deck-selector"
    bind:value={deck}
    on:blur={onBlurDecks}
    disabled={$loadingStore || loadingDecks || decks.length === 0}
  >
    {#if deck === 0}
      <option checked>No decks found</option>
    {:else}
      {#each decks as d}
        <option
          value={d.id}
          checked={d.id === deck}
        >{d.name}</option>
      {/each}
    {/if}
  </select>

  <label for="deck-selector">Use template</label>
  <select
    id="deck-selector"
    bind:value={template}
    on:blur={onBlurTemplates}
    disabled={$loadingStore || loadingTemplates || templates.length === 0}
  >
    {#if template === 0}
      <option checked>No templates found</option>
    {:else}
      {#each templates as t}
        <option
          value={t.id}
          checked={t.id === template}
        >{t.name}</option>
      {/each}
    {/if}
  </select>
{/if}
