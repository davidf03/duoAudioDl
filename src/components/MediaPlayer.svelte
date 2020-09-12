<script lang="ts">
const testUrl:string = 'https://freesound.org/data/previews/534/534313_11861866-lq.mp3';
import Play from './Icons/PlayPause.svelte';
export let audioUrl = '';
export let id:string = 'test';

let isPlaying:boolean = false;

function onClickPlay (e): void {
  const audio = document.getElementById(id);
  if (audio.paused) {
    audio.play();
    isPlaying = true;
    return;
  }
  audio.pause();
  isPlaying = false;
}
</script>

<audio id="test" preload="none">
  <!-- <source src={url} /> -->
  <source src={testUrl} />
  <track kind="captions" />
</audio>
<button on:click={onClickPlay}>
  <Play {isPlaying} />
</button>
