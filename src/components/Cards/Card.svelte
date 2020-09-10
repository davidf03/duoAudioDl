<script>
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

export let card = {}
export let pending = false

import { onDestroy } from 'svelte'
import { lng } from '../../store'
import MediaPlayer from '../MediaPlayer.svelte'

let open = false

const unsubFromLng = lng.subscribe(val => {
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
