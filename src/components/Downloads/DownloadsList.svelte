<script>
  import Download from './DownloadSet.svelte';
  export let downloads = [];
</script>

<h2 class="aud-o-h-l">Downloads</h2>
<ol class="aud-c-downloads-list aud-o-list aud-o-semantic-list">
  {#each downloads as dlSet}
    <Download dlSet={dlSet} />
  {/each}
</ol>
