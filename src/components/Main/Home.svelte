<script>
  import DownloadsList from '../Downloads/DownloadsList.svelte';

  let downloads = [{ name: 'test' }];
</script>

<h1 class="ad-o-h1">Hello</h1>
<DownloadsList downloads={downloads} />