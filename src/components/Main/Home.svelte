<script>
  import DownloadsList from '../Downloads/DownloadsList.svelte';

  let downloads = [{ name: 'test', percentage: 0 }];

  inc();
  function inc() {
    setTimeout(() => {
      downloads[0].percentage += 0.0007
      downloads[0].percentage %= 360
      inc();
    },10);
  }
</script>

<div class="aud-o-block">
  <DownloadsList downloads={downloads} />
</div>
