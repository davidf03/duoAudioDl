<script>
  // on save, move right, list from bottom closes overtop (not visible beneath list unless last item)
  // on ignore, move left, "

  // media preview
  // ignore
  // [body click]
  //   fields
  //     (id)
  //     deck [default pre-selected]
  //     original
  //     translation
  //     tags
  //   save

  export let card = {}
  export let pending = false

  import MediaPlayer from '../MediaPlayer.svelte'

  let open = false
</script>

<li class="aud-c-card">
  <MediaPlayer url={card.url} />
</li>
