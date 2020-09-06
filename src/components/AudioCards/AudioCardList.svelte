<script>
  import AudioCard from './AudioCard.svelte';
  export let audioCards = [];
  export let pending = false;

  let testSet = audioCards[4]?.urls ?? [];
  console.log(audioCards);
  console.log(testSet);

</script>

<h2 class="aud-o-h-l">Audio Cards Queue</h2>
<ol class="aud-c-downloads-list aud-o-list aud-o-semantic-list">
  {#each testSet as ac}
    <AudioCard audioCard={ac} open={pending} />
  {/each}
</ol>
