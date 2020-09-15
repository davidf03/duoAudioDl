<script lang="ts">
import { onDestroy } from 'svelte';
import { assign } from 'svelte/internal';
import type { iCardGroup } from '../../interfaces/iCards';
import { queue, lng, loadingStore } from '../../store';
import CardList from '../Cards/CardList.svelte';

let cardGroups:iCardGroup[];
function assignCardList (): void {
  cardGroups = $queue?.[$lng];
};

const unsubFromLoadingStore = queue.subscribe(val => !val && assignCardList());
onDestroy(unsubFromLoadingStore);
const unsubFromLng = lng.subscribe(val => { // TODO type
  assignCardList();
  // scroll to top
});
onDestroy(unsubFromLng);
</script>

<div class="aud-c-home">
  {#if $lng}
    {#if cardGroups.length > 0}
      <CardList {cardGroups} pending/>
    {:else}
      <p>No cards in queue</p>
    {/if}
  {:else}
    Use DuoLingo to generate cards
  {/if}
</div>
