<script type="ts">
export let classlist:string = "";
let percentage = .16;

const totalR:number = 1;
const w:number = 0.24*totalR;
const r:number = totalR - w/2;

let rotation:number = 0;
// incRotation();
// function incRotation() {
//   setTimeout(() => {
//     rotation += 0.28
//     rotation %= 360
//     incRotation();
//   },10);
// }

interface iCoord {
  x:number;
  y:number;
}

// https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
function polarToCartesian(centerX:number, centerY:number, radius:number, angleInDegrees:number): iCoord {
  const angleInRadians:number = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}
function describeArc(x:number, y:number, radius:number, startAngle:number, endAngle:number): string {
  const start:iCoord = polarToCartesian(x, y, radius, endAngle);
  const end:iCoord = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag:string = (endAngle - startAngle)%360 <= 180 ? "0" : "1";

  const d:string = [
    "M", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');

  return d;       
}
</script>

<svg
  version="1.1" xmlns="http://www.w3.org/2000/svg"
  viewBox={`0 0 ${2*totalR} ${2*totalR}`}
  class={`aud-c-spinner ${classlist}`}
>
  <g>
    <circle
      cx={totalR} cy={totalR} r={r}
      stroke-width={w}
      class="aud-c-spinner__track"
    />
    <path
      d={describeArc(totalR, totalR, r, rotation, rotation + 360*percentage)}
      stroke-width={w}
      class="aud-c-spinner__progress"
    />
  </g>
</svg>
