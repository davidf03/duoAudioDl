<script>
  import Download from './Download.svelte';

  export let downloads = [];
</script>

<h2 class="ad-o-h2">Downloads</h2>
<ol class="ad-o-semantic-list">
  {#each downloads as dlData}
    <Download dlData={dlData} />
  {/each}
</ol>
