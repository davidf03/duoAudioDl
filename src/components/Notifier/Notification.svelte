<script lang="ts">
// appear from bottom, unfold, give info/options like undo last action
import { notifications } from '../../store';
import type { iNotification } from "src/interfaces/iNotification";

export let classlist:string;
export let notification:iNotification;

let modifierFragment:string;
switch (notification.priority) {
  case 0: modifierFragment = 'critical'; break;
  case 1: modifierFragment = 'warning'; break;
  case 2: modifierFragment = 'progress'; break;
}
let modifier:string = 'dag-c-notification--' + modifierFragment;

function onClick (e): void {
  notifications.clearById(notification.id);
}

</script>

<div
  on:click={onClick}
  class={`${classlist} dag-c-notification ${modifier}`}
>{notification.message}</div>
