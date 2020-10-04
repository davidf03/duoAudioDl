<script lang="ts">
import { createEventDispatcher, onMount, onDestroy } from 'svelte';
import { playingAudioId } from '../store';
import PlayPause from './Icons/PlayPause/PlayPause.svelte';

export let audioFile:string = '';
export let id:string = '';
export let classlist:string = '';

const dispatch = createEventDispatcher();

let audioElm;
let isPlaying:boolean = false;

onMount(async () => {
  audioElm = document.getElementById(id);
  audioElm.addEventListener('ended', endedEventHandler);
});
const endedEventHandler = e => isPlaying = false;
onDestroy(() => audioElm.removeEventListener('ended', endedEventHandler));

const unsubFromPlayingAudioId = playingAudioId.subscribe(val => val && val !== id && !returnIsPaused() && pause());
onDestroy(unsubFromPlayingAudioId);
onDestroy(() => $playingAudioId === id && playingAudioId.set(null));

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

function onClickPlay (): void {
  returnIsPaused() ? play() : pause();
}
</script>

<audio {id} preload="none">
  <source src={audioFile} />
</audio>
<button
  on:click={onClickPlay}
  class={`dag-c-audio-btn dag-o-unbutton ${classlist}`}
>
  <PlayPause
    {isPlaying}
    on:click={onClickPlay}
  />
</button>

<style lang="scss">
.dag-c-audio-btn {
  width: $dag-audio-btn-w;
  border-radius: $dag-audio-btn-w/2 - 2;
  overflow: hidden;
}
</style>
