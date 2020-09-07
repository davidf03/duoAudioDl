<script>
export let cardlist = [];
export let pending = false;

import CardSet from './CardSet.svelte';
</script>

<ol class="aud-c-card-list aud-o-semantic-list">
  {#each cardlist as cardset}
    <li class="aud-c-card-list__group">
      <CardSet {cardset} {pending} />
    </li>
  {/each}
</ol>
