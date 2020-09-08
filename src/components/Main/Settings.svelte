<script>
  // set default deck
  // set default template
  // clear history
  // clear ignored

  import { history } from '../../store'
  import { onMount } from 'svelte'
  import ankiConnect from '../../contentScripts/ankiConnect'
  import Spinner from '../Icons/Spinner.svelte'

  let decks = []
  let loadingDecks = true

  // onMount(async () => {
  //   const decksRes = await ankiConnect('deckNamesAndIds', 6);
  //   decks = Object.keys(decksRes).map(k => ({ name: k, id: decksRes[k] }));
  //   if (!decks.includes(d => d.id === $deck)) {
  //     $deck = decks[0].id;
  //     deck.useLocalStorage();
  //   }
  //   loadingDecks = false;
  // });
</script>

<!-- {#if loadingDecks}
  <div class="aud-u-ta-c">
    <Spinner />
  </div>
{/if}
{#if !loadingDecks}
  <label for="deck-selector">Create in deck</label>
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
{/if} -->
