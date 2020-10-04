<script lang="ts">
import { createEventDispatcher } from 'svelte';

export let value:string = '';
export let disabled:boolean = false;
export let id:string = '';
export let label:string = '';
export let placeholder:string = '';
export let classlist:string = '';

const dispatch = createEventDispatcher();

function onInput (e): void {
  dispatch('input');
}
function onBlur (e): void {
  dispatch('blur');
}
</script>

<div
  class="dag-o-input {classlist}"
>
  <label
    for={id}
    class="dag-o-input__label dag-u-d-b"
  >{label}</label>
  <input
    on:input={onInput}
    on:blur={onBlur}
    bind:value={value}
    {disabled}
    {id}
    type="text"
    {placeholder}
    class="dag-o-input__field"
  />
</div>
