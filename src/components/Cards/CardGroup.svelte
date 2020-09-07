<script>
  // export let classlist = '';
  export let cardgroup = {};
  export let pending = false;

  import Card from './Card.svelte';

  let showCards = false;

  console.log(cardgroup.cards[0]);
</script>

<div class="aud-c-card-set">
  <button
    on:click={() => {showCards = !showCards}}
    class="aud-c-card-set__toggle"
  >{cardgroup.name}</button>
  {#if showCards}
    <ol class="aud-c-card-set__list aud-o-semantic-list">
      {#each cardgroup.cards as card}
        <li>
          <Card {card} {pending} />
        </li>
      {/each}
    </ol>
  {/if}
</div>
