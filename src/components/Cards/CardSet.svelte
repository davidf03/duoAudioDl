<script>
  export let classlist = '';
  export let cardSet = {};
  export let pending = false;

  import Card from './Card.svelte';

  let showCards = false;
</script>

<li class={`${classlist} aud-c-card-set`}>
  <button
    on:click={() => {showCards = !showCards}}
    class="aud-c-card-set__toggle"
  >{cardSet.skill}</button>
  {#if showCards}
    <ol class="aud-c-card-set__list aud-o-semantic-list">
      {#each cardSet.cards as card}
        <Card {card} {pending} />
      {/each}
    </ol>
  {/if}
</li>
