<script>
  export const id = ""
  export let percentage = 0

  let totalR = 24
  let w = 0.2*totalR
  let r = totalR - w/2

  let rotation = 0;
  incRotation();
  function incRotation() {
    setTimeout(() => {
      rotation += 0.28
      rotation %= 360
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

    var largeArcFlag = (endAngle - startAngle)%360 <= 180 ? "0" : "1";

    var d = [
      "M", start.x, start.y, 
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(' ');

    return d;       
  }
</script>

<svg
  version="1.1" xmlns="http://www.w3.org/2000/svg"
  viewBox={`0 0 ${2*totalR} ${2*totalR}`}
  class="aud-c-dl-spinner"
>
<!-- title={`${Math.floor(percentage*100)}%`} -->
  <g>
    <circle
      cx={totalR} cy={totalR} r={r}
      stroke-width={w}
      class="aud-c-dl-spinner__track"
    />
    <path
      d={describeArc(totalR, totalR, r, rotation, rotation + 360*percentage)}
      stroke-width={w}
      class="aud-c-dl-spinner__progress"
    />
  </g>
</svg>
