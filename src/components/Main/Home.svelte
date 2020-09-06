<script>
  import { onMount, onDestroy } from 'svelte';
  import AudioCardList from '../AudioCards/AudioCardList.svelte'

  let acqPromise;

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

<div class="aud-o-block">
  {#if acqPromise}
    {#await acqPromise}
      <p>loading, please wait</p>
    {:then res}
      <AudioCardList audioCards={res.duoAudioDl.audioCardQueue} pending />
    {:catch err}
      <p>failed to load</p>
    {/await}
  {/if}
</div>
