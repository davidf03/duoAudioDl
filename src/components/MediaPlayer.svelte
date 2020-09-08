<script>
  export let url = ''
  const testUrl = 'https://freesound.org/data/previews/534/534313_11861866-lq.mp3'
</script>

<audio id="test" controls="controls">
  <!-- <source src={url} /> -->
  <source src={testUrl} />
  <track kind="captions" />
</audio>
