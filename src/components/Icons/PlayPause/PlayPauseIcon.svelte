<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let isPlaying:boolean = false;
export let isHovered:boolean = false;
export let isPressed:boolean = false;

export let r:number = 12;

export let btnHFull:number;
export let btnH:number;

export let triangleSideL:number;
export let triangleStrokeW:number;

export let barH:number;
export let barW:number;
export let barGap:number;

const dispatch = createEventDispatcher();

function onClick (): void {
  dispatch('click');
}
</script>

<svg
  on:click={onClick}
  viewBox={`0 0 ${2*r} ${2*r + btnHFull}`}
  class="dag-c-play-icon"
  class:dag-c-play-icon--hover={isHovered}
  class:dag-c-play-icon--pressed={isPressed}
>
  <g class="dag-c-play-icon__interior">
    <circle
      cx={r} cy={r + btnHFull} r={r}
      class="dag-c-play-icon__height"
    />
    <path
      d={`
        M ${0},${r + btnHFull}
        l ${0},${- btnH}
        l ${2*r},${0}
        l ${0},${+ btnH}
      `}
      class="dag-c-play-icon__height"
    />
    <circle
      cx={r} cy={r + (btnHFull - btnH)} r={r}
      class="dag-c-play-icon__circle"
    />
    {#if isPlaying}
      <path class="dag-c-play-icon__line"
        d={`
          M ${r - (barGap + barW)/2},${r - barH/2 + (btnHFull - btnH)}
          l 0,${barH}
          M ${r + (barGap + barW)/2},${r - barH/2 + (btnHFull - btnH)}
          l 0,${barH}
        `}
        stroke-width={barW}
      />
    {:else}
      <path class="dag-c-play-icon__triangle"
        d={`
          M ${r - triangleSideL/2*Math.tan(30*Math.PI/180)},${r - triangleSideL/2 + (btnHFull - btnH)}
          l ${triangleSideL/2*Math.tan(60*Math.PI/180)},${triangleSideL/2}
          l ${-triangleSideL/2*Math.tan(60*Math.PI/180)},${triangleSideL/2}
          l 0,${-triangleSideL}
        `}
      />
      <path
        d={`
          M ${r - triangleSideL/2*Math.tan(30*Math.PI/180)},${r - triangleSideL/2 + (btnHFull - btnH)}
          l ${triangleSideL/2*Math.tan(60*Math.PI/180)},${triangleSideL/2}
        `}
        stroke-width={triangleStrokeW}
        class="dag-c-play-icon__line"
      />
      <path class="dag-c-play-icon__line"
        d={`
          M ${r - triangleSideL/2*Math.tan(30*Math.PI/180)},${r - triangleSideL/2 + (btnHFull - btnH)}
          l 0,${triangleSideL}
        `}
        stroke-width={triangleStrokeW}
      />
      <path class="dag-c-play-icon__line"
        d={`
          M ${r - triangleSideL/2*Math.tan(30*Math.PI/180)},${r + triangleSideL/2 + (btnHFull - btnH)}
          l ${triangleSideL/2*Math.tan(60*Math.PI/180)},${- triangleSideL/2}
        `}
        stroke-width={triangleStrokeW}
      />
    {/if}
  </g>
</svg>

<style lang="scss">
.dag-c-play-icon {
  pointer-events: none;
  display: block;

  &--hover &__circle {
    fill: var(--dag-btn-main-hover)
  }
  &__circle,
  &--pressed &__circle {
    fill: var(--dag-btn-main);
  }

  &__height {
    fill: var(--dag-btn-sides);
  }

  &__triangle {
    fill: var(--dag-btn-type);
  }

  &__line {
    stroke: var(--dag-btn-type);
    stroke-linecap: round;
  }
}
</style>
