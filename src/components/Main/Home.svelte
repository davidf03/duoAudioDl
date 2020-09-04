<script>
  import DownloadsList from '../Downloads/DownloadsList.svelte';

  let downloads = [{ name: 'test' }];
</script>

<div class="aud-o-block">
  <DownloadsList downloads={downloads} />
</div>
