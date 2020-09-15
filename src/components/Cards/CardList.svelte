<script lang="ts">
import type { iCardGroup } from '../../interfaces/iCards';
import CardGroup from './CardGroup.svelte';

export let cardGroups:iCardGroup[];
export let pending:boolean = false;
</script>

<ol class="aud-c-card-list aud-o-semantic-list">
  {#each cardGroups as cardGroup}
    <li class="aud-c-card-list__group">
      <CardGroup
        {cardGroup}
        {pending}
      />
    </li>
  {/each}
</ol>
