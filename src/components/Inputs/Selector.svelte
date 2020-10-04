<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let options:{val:any;text:string;}[] = [];
export let value:any = null;
export let useOnChange:boolean = false;
export let emptyText:string = '';
export let id:string = '';
export let label:string = '';
export let required:boolean = false;
export let classlist:string = '';

const dispatch = createEventDispatcher();

let previousValue:any = value;

function onChange (): void {
  useOnChange && dispatch('change');
}
function onBlur (): void {
  if (useOnChange || value === previousValue) return; // to compensate for having to use blur instead of change
  previousValue = value;
  dispatch('change');
}
</script>

<div
  class="dag-o-input {classlist}"
>
  <label
    for={id}
    class="dag-o-input__label dag-u-d-b"
  >{label}</label>
  <select
    bind:value={value}
    on:change={onChange}
    on:blur={onBlur}
    {id}
    disabled={options.length === 0}
    {required}
    class="dag-o-input__field"
  >
    {#if options.length === 0}
      <option selected>{emptyText}</option>
    {:else}
      {#each options as option}
        <option
          value={option.val}
          selected={option.val === value}
        >{option.text}</option>
      {/each}
    {/if}
  </select>
</div>
