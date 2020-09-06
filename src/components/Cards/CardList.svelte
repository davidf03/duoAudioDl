<script>
export let cardList = [];
export let pending = false;

import CardSet from './CardSet.svelte';
</script>

<ol class="aud-c-card-list aud-o-semantic-list">
  {#each cardList as cardSet}
    <CardSet {cardSet} {pending} />
  {/each}
</ol>
