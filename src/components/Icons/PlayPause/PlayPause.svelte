<script lang="ts">
import PlayPauseInterior from './PlayPauseIcon.svelte';

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

// TODO move this somewhere else to make it less expensive
// allows button to press if cursor enters with mousebutton down
const primaryMouseBtnCode = 2;
const primaryMouseButtonValues = getMouseButtonValues(primaryMouseBtnCode);
const secondaryMouseBtnCode = 1;
const secondaryMouseButtonValues = getMouseButtonValues(secondaryMouseBtnCode);
function getMouseButtonValues(value) {
  const values = [value];
  const log2 = Math.log2(value);
  for (let i=0; i<=4; i++) {
    if (i === log2) continue;
    const power = Math.pow(2,i);
    values.forEach(v => values.push(v + power));  
  }
  return values;
}

function onMouseOver (e): void {
  if (primaryMouseButtonValues.includes(e.buttons) || secondaryMouseButtonValues.includes(e.buttons)) isPressed = true;
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

<div
  on:mouseover={onMouseOver}
  on:mousedown={onMouseDown}
  on:mouseup={onMouseUp}
  on:mouseout={onMouseOut}
>
  {#if isPressed}
    <PlayPauseInterior
      {isPlaying}
      {isHovered}
      {isPressed}
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
      {isHovered}
      {isPressed}
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
</div>

<style lang="scss">
</style>
