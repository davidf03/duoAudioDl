<script>
  import { prefs, loading } from '../store'
  import ISO6391 from 'iso-639-1'

  const id = 'aud-language-selector-label'
  let collapsed = true

  function getOptionId(language) {
    return `#${id}-${Object.keys($prefs.lngs).indexOf(language)}`;
  }
</script>

{#if !$loading}
<div class="aud-c-language-selector">
  <button class="aud-c-language-selector__toggle">{$prefs.lng}</button>
  {#if !collapsed}
  <span {id}>Choose Language</span>
  <fieldset aria-describedby={id}>
    {#each Object.keys($prefs.lngs) as language}
      <input
        id={getOptionId(language)}
        type="radio"
        bind:group={$prefs.lng}
        value={language}
        on:change={prefs.useLocalStorage()}
        class="aud-c-language-selector__input"
      />
      <label
        for={getOptionId(language)}
        class="aud-c-language-selector__entry"
      >{ISO6391.getName(language)}</label>
    {/each}
  </fieldset>
  {/if}
</div>
{/if}
