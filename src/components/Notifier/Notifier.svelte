<script lang="ts">
// appear from bottom, unfold, give info/options like undo last action

import { iNotification } from '../../interfaces/iNotification';
import Notification from './Notification.svelte';

export const notifications:iNotification[] = [];
</script>

<div class="dag-c-notifier">
  <ul>
    {#each notifications as notification}
      <Notification {notification} classlist="dag-c-notifier__item" />
    {/each}
  </ul>
</div>
