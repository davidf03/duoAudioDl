<script>
import { queue, lng } from '../../store';
import CardList from '../Cards/CardList.svelte'
</script>

<div class="aud-c-home aud-o-block">
  {#if $lng}
    {#if $queue[$lng].length > 0}
      <CardList cardlist={$queue[$lng]} pending/>
    {:else}
      <p>No cards in queue</p>
    {/if}
  {:else}
    Use DuoLingo to generate cards
  {/if}
</div>
