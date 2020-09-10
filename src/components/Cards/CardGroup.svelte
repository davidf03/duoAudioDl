<script>
// export let classlist = '';
export let cardgroup = {};
export let pending = false;

import { onDestroy } from 'svelte';
import { lng } from '../../store';
import Card from './Card.svelte';

let isShowingCards = false;
function showCards() {
  isShowingCards = !isShowingCards;
}

const unsubFromLng = lng.subscribe(val => {
  isShowingCards = false;
});
onDestroy(unsubFromLng);
</script>

<div class="aud-c-card-set">
  <button
    on:click={showCards}
    class="aud-c-card-set__toggle"
  >{cardgroup.name}</button>
  {#if isShowingCards}
    <ol class="aud-c-card-set__list aud-o-semantic-list">
      {#each cardgroup.cards as card}
        <li>
          <Card {card} {pending} />
        </li>
      {/each}
    </ol>
  {/if}
</div>
