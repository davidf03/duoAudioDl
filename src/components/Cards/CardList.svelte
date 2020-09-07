<script>
export let cardlist = [];
export let pending = false;

import CardSet from './CardSet.svelte';
</script>

<ol class="aud-c-card-list aud-o-semantic-list">
  {#each cardlist as cardset}
    <CardSet {cardset} {pending} />
  {/each}
</ol>
