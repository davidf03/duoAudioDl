<script>
  export let classlist = '';
  export let cardset = {};
  export let pending = false;

  import Card from './Card.svelte';

  let showCards = false;
</script>

<div class="aud-c-card-set">
  <button
    on:click={() => {showCards = !showCards}}
    class="aud-c-card-set__toggle"
  >{cardset.group}</button>
  {#if showCards}
    <ol class="aud-c-card-set__list aud-o-semantic-list">
      {#each cardset.cards as card}
        <Card {card} {pending} />
      {/each}
    </ol>
  {/if}
</div>
