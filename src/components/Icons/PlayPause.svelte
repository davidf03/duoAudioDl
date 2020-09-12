<script lang="ts">
export let isPlaying:boolean = true;

const r:number = 12;
const circleStrokeWRatio:number = 0.16;

const triangleSideL:number = 7;
const triangleStrokeW:number = 1.5;

const barH:number = 7;
const barW:number = 2;
const barGap:number = 2;
</script>

<svg
  viewBox={`0 0 ${2*r} ${2*r}`}
  class="aud-c-play-icon"
>
  <g>
    <circle
      cx={r} cy={r} r={r*(1 - circleStrokeWRatio/2)}
      stroke-width={r*circleStrokeWRatio}
      class="aud-c-play-icon__circle"
    />
    {#if isPlaying}
      <path class="aud-c-play-icon__line"
        d={`
          M ${r - (barGap + barW)/2},${r - barH/2}
          l 0,${barH}
          M ${r + (barGap + barW)/2},${r - barH/2}
          l 0,${barH}
        `}
        stroke-width={barW}
      />
    {:else}
      <path class="aud-c-play-icon__triangle"
        d={`
          M ${r - triangleSideL/2*Math.tan(30*Math.PI/180)},${r-triangleSideL/2}
          l ${triangleSideL/2*Math.tan(60*Math.PI/180)},${triangleSideL/2}
          l ${-triangleSideL/2*Math.tan(60*Math.PI/180)},${triangleSideL/2}
          l 0,${-triangleSideL}
        `}
        stroke-width={triangleStrokeW}
      />
      <path
        d={`
          M ${r - triangleSideL/2*Math.tan(30*Math.PI/180)},${r-triangleSideL/2}
          l ${triangleSideL/2*Math.tan(60*Math.PI/180)},${triangleSideL/2}
        `}
        stroke-width={triangleStrokeW}
        class="aud-c-play-icon__line"
      />
      <path class="aud-c-play-icon__line"
        d={`
          M ${r - triangleSideL/2*Math.tan(30*Math.PI/180)},${r-triangleSideL/2}
          l 0,${triangleSideL}
        `}
        stroke-width={triangleStrokeW}
      />
      <path class="aud-c-play-icon__line"
        d={`
          M ${r - triangleSideL/2*Math.tan(30*Math.PI/180)},${r+triangleSideL/2}
          l ${triangleSideL/2*Math.tan(60*Math.PI/180)},${-triangleSideL/2}
        `}
        stroke-width={triangleStrokeW}
      />
    {/if}
  </g>
</svg>
