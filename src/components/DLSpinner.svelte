<script>
  export const id = ""
  export let percentage = 0

  let r = 24
  let ringW = 0.2*r
  let innerR = r - ringW

  let rotation = 0;
  incRotation();
  function incRotation() {
    setTimeout(() => {
      rotation = (rotation + 0.24)%360;
      incRotation();
    },10);
  }

  // https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
  function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');

    return d;       
  }
</script>

<svg
  version="1.1" xmlns="http://www.w3.org/2000/svg"
  viewBox={`0 0 ${2*r} ${2*r}`}
  class="aud-c-dl-spinner"
>
<!-- title={`${Math.floor(percentage*100)}%`} -->
  <defs>
    <clipPath id={`${id}-clip-track`}>
      <path
        clip-rule="evenodd"
        d={`M ${r} ${r} m -${r},0 a ${r},${r} 0 1,0 ${2*r},0 a ${r},${r} 0 1,0 -${2*r},0 M ${r} ${r} m -${innerR},0 a ${innerR},${innerR} 0 1,0 ${2*innerR},0 a ${innerR},${innerR} 0 1,0 -${2*innerR},0`}
      />
    </clipPath>
    <clipPath id={`${id}-clip-progress`}>
      <path d={`M ${r} ${r} L ${[].concat.apply([], Object.values(polarToCartesian(r,r,r,rotation))).join(' ')} ${describeArc(r,r,r,rotation,rotation + 360*(percentage))} L ${r} ${r}`} />
    </clipPath>
  </defs>
  <g clip-path={`url(#${id}-clip-track)`}>
    <path
      d={`M ${r} ${r} m -${r},0 a ${r},${r} 0 1,0 ${2*r},0 a ${r},${r} 0 1,0 -${2*r},0`}
      class="aud-c-dl-spinner__track"
    />
    <path
      clip-path={`url(#${id}-clip-progress)`}
      d={`M ${r} ${r} m -${r},0 a ${r},${r} 0 1,0 ${2*r},0 a ${r},${r} 0 1,0 -${2*r},0`}
      class="aud-c-dl-spinner__progress"
    />
  </g>
</svg>
