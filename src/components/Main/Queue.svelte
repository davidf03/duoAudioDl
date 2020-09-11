<script lang="ts">
import { onDestroy } from 'svelte';
import { iCardList } from '../../interfaces/Cards';
import { queue, lng } from '../../store';
import CardList from '../Cards/CardList.svelte';

const cardList:iCardList = $queue.find(l => l.lng === $lng);

const unsubFromLng = lng.subscribe(val => { // TODO type
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
