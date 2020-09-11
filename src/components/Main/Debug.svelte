<script lang="ts">
import { queue, history, ignored } from '../../store'

queue.useLocalStorage();
history.useLocalStorage();
ignored.useLocalStorage();

function clearData (): void {
  $queue = {};
  $history = {};
  $ignored = {};
}
</script>

<button on:click={clearData}>clear data</button>