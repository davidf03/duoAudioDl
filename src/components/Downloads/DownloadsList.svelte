<script>
  import Download from './Download.svelte';
  export let downloads = [];
</script>

<h2 class="aud-o-h-l">Downloads</h2>
<ol class="aud-o-list aud-o-semantic-list">
  {#each downloads as dlData}
    <Download dlData={dlData} />
  {/each}
</ol>
