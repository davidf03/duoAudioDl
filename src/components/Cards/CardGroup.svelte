<script lang="ts">
import { onDestroy, createEventDispatcher } from 'svelte';
import type { iCardGroup } from '../../interfaces/iCards';
import { lng } from '../../store';
import Card from './Card.svelte';

export let cardGroup:iCardGroup;
export let pending:boolean = false;

const dispatch = createEventDispatcher();

let isShowingCards:boolean = false;
function showCards (): void {
  isShowingCards = !isShowingCards;
}

const unsubFromLng = lng.subscribe(val => { // TODO type
  isShowingCards = false;
});
onDestroy(unsubFromLng);

function onIgnoreCard (e): void {
  dispatch('ignore-card', Object.assign(e.detail, { groupId: cardGroup.id }));
}
</script>

<div class="dag-c-card-group">
  <div
    on:click={showCards}
    class="dag-o-bg-btn-set"
  >
    <button
      on:click|stopPropagation={showCards}
      class="dag-c-card-group__toggle dag-o-bg-btn-set__btn dag-o-unbutton"
    ><span class="dag-u-accessible-hidden">{isShowingCards ? 'Collapse' : 'Expand'} group</span></button>
    <span class="dag-o-bg-btn-set__sibling">{cardGroup.name}</span>
    <span class="dag-o-bg-btn-set__sibling">{cardGroup.cards.length}</span>
  </div>
  {#if isShowingCards}
    <ol class="dag-c-card-group__list dag-o-semantic-list">
      {#each cardGroup.cards as card}
        <li>
          <Card
            on:ignore={onIgnoreCard}
            {card}
            {pending}
          />
        </li>
      {/each}
    </ol>
  {/if}
</div>
