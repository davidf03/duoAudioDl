<script>
  export let classlist = ''
  export let state = false

  const w = 24
  const strokeW = w/10
</script>

<svg
  version="1.1" xmlns="http://www.w3.org/2000/svg"
  viewBox={`0 0 ${w} ${w}`}
  class={`aud-c-list-collapse-chevron ${classlist}`}
>
  {#if state}
    <path
      d={`M ${strokeW/2} ${w/3} L ${w/2} ${2*w/3} L ${w - strokeW/2} ${w/3}`}
      stroke-width={strokeW}
    />
  {/if}
  {#if !state}
    <path
      d={`M ${w/3} ${strokeW/2} L ${2*w/3} ${w/2} L ${w/3} ${w - strokeW/2}`}
      stroke-width={strokeW}
    />
  {/if}
</svg>
