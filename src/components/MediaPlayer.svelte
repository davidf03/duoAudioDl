<script lang="ts">
const testUrl:string = 'https://freesound.org/data/previews/534/534313_11861866-lq.mp3';

import { onMount } from 'svelte';
import Play from './Icons/PlayPause.svelte';
export let audioUrl:string = '';
export let id:string = audioUrl.split('/').reverse()[0];

let audioElm;
let isPlaying:boolean = false;

onMount(async () => {
  audioElm = document.getElementById(id);
  audioElm.addEventListener('ended', (e) => {
    isPlaying = false;
  });
});

function onClickPlay (e): void {
  if (audioElm.paused) {
    audioElm.play();
    isPlaying = true;
    return;
  }
  audioElm.pause();
  isPlaying = false;
}
</script>

<audio {id} preload="none">
  <source src={testUrl} />
  <track kind="captions" />
</audio>
<button on:click={onClickPlay}>
  <Play {isPlaying} />
</button>
