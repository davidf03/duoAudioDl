<script>
  export let dlData = {};

  import DLSpinner from '../DLSpinner.svelte';
</script>

<li class="aud-c-downloads-list__item aud-o-list__item">
  <span>{dlData.name}</span>
  <DLSpinner percentage=".35" />
</li>
