<script lang="ts">
import { onDestroy } from 'svelte';
import type { iCard, iCardGroup } from '../../interfaces/iCards';
import { queue, lng, loadingStore, ignored } from '../../store';
import CardList from '../Cards/CardList.svelte';

let cardGroups:iCardGroup[];
function assignCardList (): void {
  cardGroups = $queue.getGroups($lng);
};

const unsubFromLoadingStore = loadingStore.subscribe((val:boolean): void => !val && assignCardList());
onDestroy(unsubFromLoadingStore);

const unsubFromQueue = queue.subscribe((): void => assignCardList());
onDestroy(unsubFromQueue);

const unsubFromLng = lng.subscribe((): void => { // TODO type
  assignCardList();
  // scroll to top
});
onDestroy(unsubFromLng);

function onIgnore (e): void {
  const { id, groupName } = e.detail;
  const card:iCard = $queue.clearCard(id);
  $queue = $queue;
  $ignored.addCard(card, groupName, $lng);
  $ignored = $ignored;
}
function onFieldsUpdated (): void {
  $queue = $queue;
}
</script>

<div class="dag-c-home">
  {#if $lng}
    {#if cardGroups?.length > 0}
      <CardList
        on:cardignored={onIgnore}
        on:fieldsupdated={onFieldsUpdated}
        {cardGroups}
      />
    {:else}
      <p>No cards in queue</p>
    {/if}
  {:else}
    Use DuoLingo to generate cards
  {/if}
</div>
