<script lang="ts">
// appear from bottom, unfold, give info/options like undo last action
import { iNotification } from "src/interfaces/iNotification";

export let classlist:string;
export let notification:iNotification;

let modifierFragment:string;
switch (notification.priority) {
  case 0: modifierFragment = 'critical'; break;
  case 1: modifierFragment = 'warning'; break;
  case 2: modifierFragment = 'progress'; break;
}
let modifier:string = 'dag-c-notification--' + modifierFragment;

</script>

<div class={`${classlist} dag-c-notification ${modifier}`}>{notification.text}</div>
