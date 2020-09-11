<script lang="ts">
// on save, move right, list from bottom closes overtop (not visible beneath list unless last item)
// on ignore, move left, "

// media preview
// ignore
// [body click]
//   fields
//     (id)
//     deck [with default]
//     template [with default]
//     [template fields]
//     tags
//   save

import { onDestroy } from 'svelte';
import { iCard } from '../../interfaces/Card';
import { lng } from '../../store';
import MediaPlayer from '../MediaPlayer.svelte';

export let card:iCard;
export let pending:boolean = false;

let open:boolean = false

const unsubFromLng = lng.subscribe(val => { // TODO type
  open = false;
});
onDestroy(unsubFromLng);

</script>

<div class="aud-c-card">
  {card.url}
  {#if open}
    <MediaPlayer url={card.url} />
  {/if}
</div>
