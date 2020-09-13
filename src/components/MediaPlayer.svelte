<script lang="ts">
const testUrl:string = 'https://freesound.org/data/previews/534/534313_11861866-lq.mp3';

import { createEventDispatcher, onMount, onDestroy } from 'svelte';
import audioUrlParser from '../util/audioUrlParser';
import { playingAudioId } from '../store';
import PlayPause from './Icons/PlayPause/PlayPause.svelte';

export let audioUrl:string = '';
export let id:string = audioUrlParser.getId(audioUrl);
export let classlist:string = '';

const dispatch = createEventDispatcher();

let audioElm;
let isPlaying:boolean = false;

onMount(async () => {
  audioElm = document.getElementById(id);
  audioElm.addEventListener('ended', (e) => {
    isPlaying = false;
  });
});

const unsubFromPlayingAudioId = playingAudioId.subscribe(val => val && val !== id && !returnIsPaused() && pause());
onDestroy(unsubFromPlayingAudioId);

function returnIsPaused (): boolean {
  return audioElm.paused;
}
function pause (): void {
  audioElm.pause();
  isPlaying = false;
}
function play (): void {
  playingAudioId.set(id);
  audioElm.play();
  isPlaying = true;
}

function onClickPlay (e): void {
  returnIsPaused() ? play() : pause();
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
