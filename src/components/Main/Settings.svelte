<script>
  import { onDestroy } from 'svelte'
  import { prefs, lng, loadingStore } from '../../store'
  import ankiConnect from '../../contentScripts/ankiConnect'
  import ISO6391 from 'iso-639-1'
  import Spinner from '../Icons/Spinner.svelte'

  prefs.useLocalStorage()

  const defaultDeckId = 1

  let loadingDecks = true
  let decks = [{
    id: defaultDeckId,
    name: 'Default'
  }]
  let deck = decks[0].id;

  (async function loadDecks () {
    const res = await ankiConnect('deckNamesAndIds', 6);
    decks = Object.keys(res).map(d => ({ name: d, id: res[d] }));

    // update input to reflect previously set default deck for newly created cards (per lng)
    if ($loadingStore) {
      const unsubLoadingStore = loadingStore.subscribe(val => { if (!val) {setDeckToLngDefault(); console.log($prefs)} });
      onDestroy(unsubLoadingStore);
    } else {
      setDeckToLngDefault();
    }

    loadingDecks = false;
  })();

  const unsubFromLng = lng.subscribe(l => {
    setDeckToLngDefault();
  });

  onDestroy(unsubFromLng);

  function setDeckToLngDefault () {
    deck = $prefs[$lng]?.deck ?? deck.find(d => d.id === defaultDeckId)
  }

  function onBlur () {
    if (!$prefs[$lng]) $prefs[$lng] = {}
    $prefs[$lng].deck = deck;
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
    on:blur={onBlur}
    disabled={$loadingStore || loadingDecks}
  >
    {#each decks as d}
      <option
        value={d.id}
        default={d.id === decks[0].id}
        checked={d.id === deck}
      >{d.name}</option>
    {/each}
  </select>
{/if}
