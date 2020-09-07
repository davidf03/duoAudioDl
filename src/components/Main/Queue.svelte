<script>
import { queue, lng } from '../../store';
import CardList from '../Cards/CardList.svelte'
</script>

<div class="aud-c-home aud-o-block">
  {#if $lng}
    {#if $queue[$lng].length > 0}
      <CardList cardlist={$queue[$lng]} pending/>
    {/if}
    {#if $queue[$lng].length === 0}
      <p>No cards in queue</p>
    {/if}
  {/if}
  {#if !$lng}
    Start using DuoLingo to fill the queue
  {/if}
</div>
