<script lang="ts">
import { onDestroy } from 'svelte';
import { assign } from 'svelte/internal';
import type { iCardList } from '../../interfaces/Cards';
import { queue, lng, loadingStore } from '../../store';
import CardList from '../Cards/CardList.svelte';

let cardList:iCardList;
function assignCardList () { // TODO come back to this re: needing assignment for reactivity
  cardList = $queue.find(l => l.lng === $lng);
};

const unsubFromLoadingStore = queue.subscribe(val => !val && assignCardList());
onDestroy(unsubFromLoadingStore);
const unsubFromLng = lng.subscribe(val => { // TODO type
  assignCardList();
  // scroll to top
});
onDestroy(unsubFromLng);
</script>

<div class="aud-c-home aud-o-block">
  {#if $lng && cardList}
    {#if cardList.groups.length > 0}
      <CardList {cardList} pending/>
    {:else}
      <p>No cards in queue</p>
    {/if}
  {:else}
    Use DuoLingo to generate cards
  {/if}
</div>
