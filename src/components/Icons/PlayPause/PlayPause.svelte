<script lang="ts">
import PlayPauseInterior from './PlayPauseInterior.svelte';

export let isPlaying:boolean = true;

let isPressed:boolean = false;
let isHovered:boolean = false;

const r:number = 12;
const circleStrokeWRatio:number = 0.16;
const btnHFull = 2;
const btnHDepressed = 1;
const btnH = isPressed ? btnHDepressed : btnHFull;

const triangleSideL:number = 7;
const triangleStrokeW:number = 1.5;

const barH:number = 7;
const barW:number = 2;
const barGap:number = 2;

function onMouseOver (e): void {
  isHovered = true;
}
function onMouseDown (e): void {
  isPressed = true;
}
function onMouseUp (e): void {
  isPressed = false;
}
function onMouseOut (e): void {
  isPressed = false;
  isHovered = false;
}
</script>

<svg
  viewBox={`0 0 ${2*r} ${2*r + btnHFull}`}
  on:mouseover={onMouseOver}
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  on:mouseout={onMouseOut}
  class="aud-c-play-icon"
  class:aud-c-play-icon--hover={isHovered}
  class:aud-c-play-icon--pressed={isPressed}
>
  {#if isPressed}
    <PlayPauseInterior
      {isPlaying}
      {r}
      {btnHFull}
      btnH={btnHDepressed}
      {triangleSideL}
      {triangleStrokeW}
      {barH}
      {barW}
      {barGap}
    />
  {:else}
    <!-- TODO wtf is this necessary lol -->
    <PlayPauseInterior
      {isPlaying}
      {r}
      {btnHFull}
      btnH={btnHFull}
      {triangleSideL}
      {triangleStrokeW}
      {barH}
      {barW}
      {barGap}
    />
  {/if}
</svg>
