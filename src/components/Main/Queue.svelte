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

const unsubFromLoadingStore = loadingStore.subscribe((val): void => !val && assignCardList());
onDestroy(unsubFromLoadingStore);

const unsubFromQueue = queue.subscribe((): void => assignCardList());
onDestroy(unsubFromQueue);

const unsubFromLng = lng.subscribe((val): void => { // TODO type
  assignCardList();
  // scroll to top
});
onDestroy(unsubFromLng);

function onIgnore (e) {
  const { id, groupId } = e.detail;
  queue.clearById(id, groupId, $lng);
}
</script>

<div class="dag-c-home">
  {#if $lng}
    {#if cardGroups.length > 0}
      <CardList
        on:ignore-card={onIgnore}
        {cardGroups}
        pending
      />
    {:else}
      <p>No cards in queue</p>
    {/if}
  {:else}
    Use DuoLingo to generate cards
  {/if}
</div>
