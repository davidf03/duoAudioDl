<script>
import { onDestroy } from 'svelte'
import { prefs, lng, loadingStore } from '../../store'
import ankiConnect from '../../contentScripts/ankiConnect'
import ISO6391 from 'iso-639-1'
import Spinner from '../Icons/Spinner.svelte'

prefs.useLocalStorage()

const defaultDeckId = 1;

let loadingDecks = true;
let decks = [{
  id: defaultDeckId,
  name: 'Loading Decks...'
}];
let deck = decks[0].id;
let hasDeckChanged = false;

let loadingTemplates = true;
let templates = [{
  id: 0,
  name: 'Loading Templates...'
}];
let template = templates[0].id;
let hasTemplateChanged = false;

(async function loadDecks () {
  const res = await ankiConnect('deckNamesAndIds', 6);
  decks = Object.keys(res).map(d => ({ name: d, id: res[d] }));

  // update input to reflect previously set default deck for newly created cards (per lng)
  if ($loadingStore) {
    const unsubLoadingStore = loadingStore.subscribe(val => { if (!val) setDeckToLngDefault() });
    onDestroy(unsubLoadingStore);
  } else {
    setDeckToLngDefault();
  }

  loadingDecks = false;
})();

(async function loadTemplates () {
  const res = await ankiConnect('modelNamesAndIds', 6);
  templates = Object.keys(res).map(t => ({ name: t, id: res[t] }));

  // update input to reflect previously set default template for newly created cards (per lng)
  if ($loadingStore) {
    const unsubLoadingStore = loadingStore.subscribe(val => { if (!val) setTemplateToLngDefault() });
    onDestroy(unsubLoadingStore);
  } else {
    setTemplateToLngDefault();
  }

  loadingTemplates = false;
})();

const unsubFromLng = lng.subscribe(l => {
  setDeckToLngDefault();
  setTemplateToLngDefault();
});

onDestroy(unsubFromLng);

function setDeckToLngDefault () {
  // if pref exists and can be found, otherwise use true default
  deck = $prefs[$lng]?.deck && decks.includes(d => d.id === $prefs[$lng].deck) || decks.find(d => d.id === defaultDeckId).id
}
function setTemplateToLngDefault () {
  // if pref exists and can be found, otherwise use true default
  template = $prefs[$lng]?.template && templates.includes(t => t.id === $prefs[$lng].template) || templates[0].id
}

function onBlurDecks () {
  if (!hasDeckChanged) return;
  $prefs[$lng] ??= {}
  $prefs[$lng].deck = deck;
  hasDeckChanged = false;
}
function onBlurTemplates () {
  if (!hasTemplateChanged) return;
  $prefs[$lng] ??= {}
  $prefs[$lng].template = template;
  hasTemplateChanged = false;
}
</script>

{#if loadingDecks}
  <div class="aud-u-ta-c">
    <Spinner />
  </div>
{:else}
  <label for="deck-selector">Create cards in deck</label>
  <select
    id="deck-selector"
    bind:value={deck}
    on:change={hasDeckChanged = true}
    on:blur={onBlurDecks}
    disabled={$loadingStore || loadingDecks}
  >
    {#each decks as d}
      <option
        value={d.id}
        checked={d.id === deck}
      >{d.name}</option>
    {/each}
  </select>
{/if}

{#if loadingTemplates}
  <div class="aud-u-ta-c">
    <Spinner />
  </div>
{:else}
  <label for="deck-selector">Use template</label>
  <select
    id="deck-selector"
    bind:value={template}
    on:change={hasTemplateChanged = true}
    on:blur={onBlurTemplates}
    disabled={$loadingStore || loadingTemplates}
  >
    {#each templates as t}
      <option
        value={t.id}
        checked={t.id === template}
      >{t.name}</option>
    {/each}
  </select>
{/if}
