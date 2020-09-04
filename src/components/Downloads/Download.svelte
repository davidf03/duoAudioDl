<script>
  export let dlData = {};

  import DLSpinner from '../DLSpinner.svelte';
</script>

<li class="aud-c-downloads-list__item aud-o-list__item aud-u-d-x aud-u-xd-r">
  <span class="aud-u-d-b aud-u-xg-1">{dlData.name}</span>
  <DLSpinner
    percentage={dlData.percentage}
    class="aud-c-downloads-list__item-spinner"
  />
</li>
