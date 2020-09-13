<script lang="ts">
import { onDestroy } from 'svelte';
import type { iCardGroup } from '../../interfaces/iCards';
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

<div class="aud-c-card-group">
  <div
    on:click={showCards}
    class="aud-o-bg-btn-set"
  >
    <button
      on:click|stopPropagation={showCards}
      class="aud-c-card-group__toggle aud-o-bg-btn-set__btn aud-o-unbutton"
    ><span class="aud-u-accessible-hidden">{isShowingCards ? 'Collapse' : 'Expand'} group</span></button>
    <span class="aud-o-bg-btn-set__sibling">{cardGroup.name}</span>
  </div>
  {#if isShowingCards}
    <ol class="aud-c-card-group__list aud-o-semantic-list">
      {#each cardGroup.cards as card}
        <li>
          <Card
            {card}
            {pending}
          />
        </li>
      {/each}
    </ol>
  {/if}
</div>
