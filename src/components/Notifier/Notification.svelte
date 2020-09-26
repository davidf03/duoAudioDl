<script lang="ts">
// appear from bottom, unfold, give info/options like undo last action
import { beforeUpdate, createEventDispatcher } from 'svelte';
import type { iNotification } from "src/interfaces/iNotification";

const dispatch = createEventDispatcher();
export let classlist:string;
export let notification:iNotification;

const duration:number = notification.duration;
duration !== 0 && setTimeout(clear, duration*1000);

let modifierFragment:string;
switch (notification.priority) {
  case 0: modifierFragment = 'critical'; break;
  case 1: modifierFragment = 'warning'; break;
  case 2: modifierFragment = 'progress'; break;
}
let modifier:string = 'dag-c-notification--' + modifierFragment;

function clear (): void {
  dispatch('clear', { id: notification.id });
}
function onClick (e): void {
  clear();
}

</script>

<div
  on:click={onClick}
  class={`${classlist} dag-c-notification ${modifier}`}
>{notification.message}</div>
