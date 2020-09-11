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
//     [group: editable]
//   save

import { onDestroy } from 'svelte';
import type { iCard } from '../../interfaces/Cards';
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
  {card.audioUrl}
  {#if open}
    <MediaPlayer audioUrl={card.audioUrl} />
  {/if}
</div>
