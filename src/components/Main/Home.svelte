<script>
import { onMount, onDestroy } from 'svelte';
import CardList from '../Cards/CardList.svelte'

let acqPromise;
let showHistory = false;

onMount(async () => {
  updateQueue();
  browser.storage.onChanged.addListener(updateQueue);
});
onDestroy(async () => {
  browser.storage.onChanged.removeListener(updateQueue);
});

function updateQueue() {
  acqPromise = browser.storage.local.get('duoAudioDl');
}
</script>

<div class="aud-c-home aud-o-block">
  {#if acqPromise}
    {#await acqPromise}
      <p>Updating Queue...</p>
    {:then res}
      {#if !showHistory}
        {#if res?.duoAudioDl?.cardQueue?.length}
          <CardList cardList={res.duoAudioDl.cardQueue} pending />
        {/if}
        {#if !res?.duoAudioDl?.cardQueue?.length}
          <p>There are no cards in the queue!</p>
        {/if}
      {/if}
      <!-- {#if showHistory}
        {#if res?.duoAudioDl?.cardHistory?.length}
        {#each cardHistory as set}
          <cardList cards={res?.duoAudioDl?.cardHistory ?? []} pending />
        {/if}
        {#if !res?.duoAudioDl?.cardHistory?.length}
          <p>Nothin to show yet!</p>
        {/if}
      {/if} -->
    {:catch err}
      <p>Failed to Load Queue</p>
    {/await}
  {/if}
</div>
