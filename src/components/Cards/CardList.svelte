<script lang="ts">
import { iCardList } from '../../interfaces/Cards';
import CardGroup from './CardGroup.svelte';

export let cardList:iCardList;
export let pending:boolean = false;
</script>

<ol class="aud-c-card-list aud-o-semantic-list">
  {#each cardList.groups as cardGroup}
    <li class="aud-c-card-list__group">
      <CardGroup {cardGroup} {pending} />
    </li>
  {/each}
</ol>
