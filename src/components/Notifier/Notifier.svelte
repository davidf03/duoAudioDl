<script lang="ts">
// appear from bottom, unfold, give info/options like undo last action
// TODO variable status notifications
import { notifications } from '../../store';
import type { iNotification } from '../../interfaces/iNotification';
import Notification from './Notification.svelte';
import { onDestroy } from 'svelte';

export let classlist:string = '';
let notificationList:iNotification[];

const unsub = notifications.subscribe(val => notificationList = val);
onDestroy(unsub);

function onClear (e): void {
  notifications.clearById(e.detail.id);
}
</script>

<div class="dag-c-notifier {classlist}">
  <ul class="dag-o-semantic-list">
    {#each notificationList as notification (notification.id)}
      <li>
        <Notification
          on:clear={onClear}
          {notification}
          classlist="dag-c-notifier__item"
        />
      </li>
    {/each}
  </ul>
</div>
