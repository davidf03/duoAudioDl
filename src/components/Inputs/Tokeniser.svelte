<script lang="ts">
import { v4 as uuid } from 'uuid';
import { createEventDispatcher } from 'svelte';
import type { iNotification, iNotificationReference } from '../../interfaces/iNotification';
import { notifications } from '../../store';
import { notificationMap as nMap } from '../../maps/notificationMap';

export let id:string = '';
export let tokens:string[] = [];
export let tokenSemanticName:string = 'token';
export let validPatternRegex:RegExp = null;
export let invalidPatternRegex:RegExp = null;
export let label:string = '';

const dispatch = createEventDispatcher();

let entry:string = '';
let pattern:string = validPatternRegex?.source;

function addToken (): void {
  const index:number = tokens.indexOf(entry);
  tokens = [
    ...(index === -1 ? [] : tokens.slice(0, index)),
    ...tokens.slice(index + 1),
    entry
  ];
  entry = '';
  dispatch('update', { tokens });
}

function clearToken(e): void {
  const tkn = e.target.attributes['data-token'].value;
  const index:number = tokens.indexOf(tkn);
  if (index === -1) return;
  tokens = [
    ...tokens.slice(0, index),
    ...tokens.slice(index + 1)
  ];
  dispatch('update', { tokens });
}

function onInput (e): void {
  entry = entry.replace(invalidPatternRegex, '');
  const key:string = e.data;
  if (e.data === ' ' || e.data === ',') {
    addToken();
    return;
  }
  const nRef:iNotificationReference = nMap.invalidCardTagCharacter;
  if (validPatternRegex.test(key)) return;
  notifications.add({
    id: uuid(),
    ...nRef,
    message: `Invalid character '${key}'
    Tags must conform to pattern '${pattern}'`
  } as iNotification);
}
function onClickMain (): void {
  document.getElementById(id).focus();
}
function onClickToken (e): void {
  clearToken(e);
}
</script>

<label for={id}>{label}</label>
<div
  on:click={onClickMain}
  class="dag-c-tokeniser dag-u-d-x dag-u-xd-r dag-u-xw-w"
>
  <ul class="dag-o-semantic-list dag-u-d-c">
    {#each tokens as token}
      <li
        on:click|stopPropagation={onClickToken}
        data-token={token}
        class="dag-c-tokeniser__token dag-o-badge"
      >{token}</li>
    {/each}
  </ul>
  <input
    bind:value={entry}
    on:input={onInput}
    {id}
    type="text"
    {pattern}
    class="dag-c-tokeniser__input dag-u-xg-1"
  />
</div>
