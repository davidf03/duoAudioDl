<script lang="ts">
// appear from bottom, unfold, give info/options like undo last action
// TODO variable status notifications
import { notifications } from '../../store';
import type { iNotification } from '../../interfaces/iNotification';
import Notification from './Notification.svelte';
import { onDestroy } from 'svelte';

let notificationList:iNotification[];

const unsub = notifications.subscribe(val => notificationList = val);
onDestroy(unsub);
</script>

<div class="dag-c-notifier">
  <ul class="dag-o-semantic-list">
    {#each notificationList as notification}
      <li>
        <Notification
          {notification}
          classlist="dag-c-notifier__item"
        />
      </li>
    {/each}
  </ul>
</div>
