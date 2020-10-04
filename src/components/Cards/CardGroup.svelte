<script lang="ts">
import { onDestroy, createEventDispatcher } from 'svelte';
import type { iCardGroup } from '../../interfaces/iCards';
import { lng } from '../../store';
import Card from './Card.svelte';

const dispatch = createEventDispatcher();
export let cardGroup:iCardGroup;
let isShowingCards:boolean = false;

function showCards (): void {
  isShowingCards = !isShowingCards;
}

const unsubFromLng = lng.subscribe(val => { // TODO type
  isShowingCards = false;
});
onDestroy(unsubFromLng);

function onCardIgnored (e) {
  dispatch('cardignored', Object.assign(e.detail, { groupName: cardGroup.name }));
}
function onCardSubmitted (e) {
  dispatch('cardsubmitted', Object.assign(e.detail, { groupName: cardGroup.name }));
}
</script>

<div class="dag-c-card-group">
  <div
    on:click={showCards}
    class="dag-c-card-group__header dag-o-bg-btn-set"
  >
    <button
      on:click|stopPropagation={showCards}
      class="dag-c-card-group__toggle dag-o-bg-btn-set__btn dag-o-unbutton"
    ><span class="dag-u-accessible-hidden">{isShowingCards ? 'Collapse' : 'Expand'} group</span></button>
    <h2 class="dag-c-card-group__name dag-o-bg-btn-set__sibling">{cardGroup.name}</h2>
    <span class="dag-c-card-group__counter dag-o-bg-btn-set__sibling">{cardGroup.cards.length}</span>
  </div>
  {#if isShowingCards}
    <ol class="dag-c-card-group__list dag-o-semantic-list">
      {#each cardGroup.cards as card (card.audioUrl)}
        <li>
          <Card
            on:cardignored={onCardIgnored}
            on:cardsubmitted={onCardSubmitted}
            on:fieldsupdated
            {card}
          />
        </li>
      {/each}
    </ol>
  {/if}
</div>

<style lang="scss">
.dag-c-card-group {
  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  &__name {
    font-size: unset;
    font-weight: unset;
  }

  &__counter {
    margin-inline-start: auto;
  }
}
</style>
