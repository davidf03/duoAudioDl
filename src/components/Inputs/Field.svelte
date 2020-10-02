<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let value:string = '';
export let id:string = '';
export let label:string = '';
export let placeholder:string = '';
export let classlist:string = '';

const dispatch = createEventDispatcher();

function onChange (e): void {
  dispatch('change');
}
function onBlur (e): void {
  dispatch('blur');
}
</script>

<div
  class={classlist}
>
  <label
    for={id}
    class="dag-u-d-b"
  >{label}</label>
  <input
    on:change={onChange}
    on:blur={onBlur}
    bind:value={value}
    {id}
    type="text"
    {placeholder}
  />
</div>
