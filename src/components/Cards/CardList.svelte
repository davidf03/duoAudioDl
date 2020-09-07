<script>
export let cardlist = [];
export let pending = false;

import CardGroup from './CardGroup.svelte';

console.log(cardlist[0]);
</script>

<ol class="aud-c-card-list aud-o-semantic-list">
  {#each cardlist as cardset}
    <li class="aud-c-card-list__group">
      <CardSet {cardset} {pending} />
    </li>
  {/each}
</ol>
