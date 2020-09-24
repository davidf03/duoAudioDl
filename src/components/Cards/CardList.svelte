<script lang="ts">
import type { iCardGroup } from '../../interfaces/iCards';
import CardGroup from './CardGroup.svelte';

export let cardGroups:iCardGroup[];
export let pending:boolean = false;
</script>

<ol class="dag-c-card-list dag-o-semantic-list">
  {#each cardGroups as cardGroup}
    <li class="dag-c-card-list__group">
      <CardGroup
        on:ignorecard
        {cardGroup}
        {pending}
      />
    </li>
  {/each}
</ol>
