<script lang="ts">
import { onDestroy } from 'svelte';
import { iCardGroup } from '../../interfaces/Cards';
import { lng } from '../../store';
import Card from './Card.svelte';

export let cardGroup:iCardGroup;
export let pending:boolean = false;

let isShowingCards:boolean = false;
function showCards (): void {
  isShowingCards = !isShowingCards;
}

const unsubFromLng = lng.subscribe(val => { // TODO type
  isShowingCards = false;
});
onDestroy(unsubFromLng);
</script>

<div class="aud-c-card-set">
  <button
    on:click={showCards}
    class="aud-c-card-set__toggle"
  >{cardGroup.name}</button>
  {#if isShowingCards}
    <ol class="aud-c-card-set__list aud-o-semantic-list">
      {#each cardGroup.cards as card}
        <li>
          <Card {card} {pending} />
        </li>
      {/each}
    </ol>
  {/if}
</div>
