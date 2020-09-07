<script>
  // reset card status
    // per language
    // per deck
  // reset history
  // reset ignored
  // set default deck for saving cards to

  import { history, ignored, deck } from '../../store'
  import { onMount } from 'svelte'
  import ankiConnect from '../../contentScripts/ankiConnect'
  import Spinner from '../Icons/Spinner.svelte'

  let decks = []
  let loadingDecks = true

  onMount(async () => {
    const decksRes = await ankiConnect('deckNamesAndIds', 6);
    decks = Object.keys(decksRes).map(k => ({ name: k, id: decksRes[k] }));
    if (!decks.includes(d => d.id === $deck)) {
      $deck = decks[0].id;
      deck.useLocalStorage();
    }
    loadingDecks = false;
  });
</script>

{#if loadingDecks}
  <div class="aud-u-ta-c">
    <Spinner />
  </div>
{/if}
{#if !loadingDecks}
  <label for="deck-selector">Save Cards to</label>
  <select
    id="deck-selector"
    bind:value={$deck}
    on:blur={deck.useLocalStorage()}
  >
    {#each decks as d}
      <option
        value={d.id}
        default={d.id === decks[0].id}
        checked={d.id === $deck}
      >{d.name}</option>
    {/each}
  </select>
{/if}
