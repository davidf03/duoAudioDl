<script>
  export let dlSet = {};
  let displayFiles = false;

  import ListCollapseChevron from '../Icons/ListCollapseChevron.svelte';
  import DLSpinner from '../Icons/DLSpinner.svelte';
  import Download from './Download.svelte';
</script>

<li class="aud-c-downloads-list__set-container">
  <div class="aud-c-downloads-list__set aud-o-list__item aud-u-d-x aud-u-xd-r">
    <button
      on:click={() => {displayFiles = !displayFiles}}
      class="aud-c-downloads-list__set-files-toggle aud-u-d-x aud-u-xd-r"
    >
      <ListCollapseChevron
        state={displayFiles}
        classlist="aud-c-downloads-list__item-chevron"
      />
      <span class="aud-c-downloads-list__set-skill">{dlSet.skill}</span>
      <span class="aud-c-downloads-list__set-date">{dlSet.date}</span>
      <span class="aud-u-accessible-hidden">Click to {displayFiles ? 'collapse' : 'Show'} set files</span>
    </button>
    <DLSpinner
      percentage={dlSet.percentage}
      classlist="aud-c-downloads-list__set-spinner aud-u-ml-a"
    />
  </div>
  {#if displayFiles}
    <ol class="aud-o-semantic-list">
      {#each dlSet.files as fileData}
        <Download fileData={fileData} />
      {/each}
    </ol>
  {/if}
</li>
