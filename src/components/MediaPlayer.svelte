<script lang="ts">
const testUrl:string = 'https://freesound.org/data/previews/534/534313_11861866-lq.mp3';

import { stop_propagation, writable } from 'svelte/internal';
import { onMount } from 'svelte';
import PlayPause from './Icons/PlayPause/PlayPause.svelte';
export let audioUrl:string = '';
export let id:string = audioUrl.split('/').reverse()[0];
export let isPlayBtnPressed:boolean = false;
export let classlist:string = '';

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
<button
  on:click={onClickPlay}
  class={`aud-c-audio-btn aud-o-unbutton ${classlist}`}
>
  <PlayPause
    {isPlaying}
    on:click={onClickPlay}
  />
</button>
