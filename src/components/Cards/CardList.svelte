<script>
export let cardlist = [];
export let pending = false;

import CardGroup from './CardGroup.svelte';
</script>

<ol class="aud-c-card-list aud-o-semantic-list">
  {#each cardlist as cardgroup}
    <li class="aud-c-card-list__group">
      <CardGroup {cardgroup} {pending} />
    </li>
  {/each}
</ol>
