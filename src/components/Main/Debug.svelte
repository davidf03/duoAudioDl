<script>
import { queue, history, ignored } from '../../store'

queue.useLocalStorage();
history.useLocalStorage();
ignored.useLocalStorage();

function clearData () {
  $queue = {};
  $history = {};
  $ignored = {};
}
</script>

<button on:click={clearData}>clear data</button>