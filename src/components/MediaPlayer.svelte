<script lang="ts">
// export let url = ''
const testUrl:string = 'https://freesound.org/data/previews/534/534313_11861866-lq.mp3';
</script>

<audio id="test" controls="controls">
  <!-- <source src={url} /> -->
  <source src={testUrl} />
  <track kind="captions" />
</audio>
