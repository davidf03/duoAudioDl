<!-- <script lang="ts">
import { onDestroy } from 'svelte'
import { prefs, lng, loadingStore } from '../../store'
import ankiConnect from '../../contentScripts/ankiConnect'
import ISO6391 from 'iso-639-1'
import Spinner from '../Icons/Spinner.svelte'

prefs.useLocalStorage()

const defaultDeckId:number = 1;

interface iDeck {
  id:number;
  name:string;
}
interface iTemplate {
  id:number;
  name:string;
}

let loadingDecks:boolean = true;
let decks:iDeck[] = [{
  id: 0,
  name: ''
}];
let deck:number = decks[0].id;

let loadingTemplates:boolean = true;
let templates:iTemplate[] = [{
  id: 0,
  name: ''
}];
let template:number = templates[0].id;

let isConnecting:boolean = true;
let isConnected:boolean = false;
let errMsg:string = '';

(async function load (): Promise<any>  { // TODO type
  console.log('loading');
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
      console.log('failed promises');
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
  deck = $prefs[$lng]?.deck && decks.find(d => d.id === $prefs[$lng].deck)?.id
    || decks.find(d => d.id === defaultDeckId)?.id
    || decks.map(d => d.id).sort()[0]
    || 0
}
function setTemplateToLngDefault (): void {
  // if pref exists and can be found, otherwise use true default
  template = $prefs[$lng]?.template && templates.find(t => t.id === $prefs[$lng].template)?.id
    || templates.map(t => t.id).sort()[0]
    || 0
}

function onBlurDecks (): void {
  if (!$prefs[$lng]) $prefs[$lng] = {}
  $prefs[$lng].deck = deck;
}
function onBlurTemplates (): void {
  if (!$prefs?.lngs?.some(l => l.lng === $lng)) $prefs[$lng] = {}
  $prefs[$lng].template = template;
}
</script>

{#if isConnecting}
  <div class="aud-u-ta-c">
    <Spinner />
  </div>
{:else if !isConnected}
  <p>Could not connect to your local Anki installation</p>
  <p>{errMsg}</p>
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
{/if} -->
