<script>
  import DownloadsList from '../Downloads/DownloadsList.svelte';

  let downloads = [{ name: 'test' }];
</script>

<div class="aud-o-block">
  <h1 class="aud-o-h-xl">Duo Audio Downloader</h1>
  <DownloadsList downloads={downloads} />
</div>
