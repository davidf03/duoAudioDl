<script>
  // on save, move right, list from bottom closes overtop (not visible beneath list unless last item)
  // on ignore, move left, "

  export let card = {}
  export let pending = false;

  let open = false;
</script>

<li class="aud-c-card">{card.url}</li>
