<script lang="ts">
// appear from bottom, unfold, give info/options like undo last action
import { beforeUpdate, createEventDispatcher } from 'svelte';
import type { iNotification } from "src/interfaces/iNotification";

export let classlist:string;
export let notification:iNotification;

const dispatch = createEventDispatcher();

beforeUpdate(primeAutoClear);
function primeAutoClear (): void {
  const duration:number = notification.duration;
  const boundDispatch = (id:string) => dispatch('clear', { id });
  duration !== 0 && setTimeout(boundDispatch.bind(null, notification.id), duration*1000);
}

let modifierFragment:string;
switch (notification.priority) {
  case 0: modifierFragment = 'critical'; break;
  case 1: modifierFragment = 'warning'; break;
  case 2: modifierFragment = 'progress'; break;
}
let modifier:string = 'dag-c-notification--' + modifierFragment;

function onClick (e): void {
  dispatch('clear', { id: notification.id });
}

</script>

<div
  on:click={onClick}
  class={`${classlist} dag-c-notification ${modifier}`}
>{notification.message}</div>
