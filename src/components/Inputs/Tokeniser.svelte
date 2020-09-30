<script lang="ts">
import { v4 as uuid } from 'uuid';
import { createEventDispatcher } from 'svelte';
import type { iNotification, iNotificationReference } from '../../interfaces/iNotification';
import { notifications } from '../../store';
import { notificationMap as nMap } from '../../maps/notificationMap';

export let tokens:string[] = [];
export let tokenSemanticName:string = 'token';
export let validPatternRegex:RegExp = null;
export let invalidPatternRegex:RegExp = null;

const dispatch = createEventDispatcher();

let pattern:string = validPatternRegex?.source;
let entry:string = '';

function addToken (): void {
  const index:number = tokens.indexOf(entry);
  tokens = [
    ...tokens.slice(0, index),
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
</script>

<div
  class="dag-c-tokeniser dag-u-d-x dag-u-xd-r dag-u-xw-w"
>
  <ul class="dag-o-semantic-list dag-u-d-c">
    {#each tokens as token (token)}
      <li class="dag-c-tokeniser__token dag-o-bg-btn-set">
        <span class="dag-c-tokeniser__token-text dag-o-badge dag-o-bg-btn-set__sibling dag-u-pe-n">{token}</span>
        <button
          on:click={clearToken}
          data-token={token}
          class="dag-c-tokeniser__token_btn dag-o-bg-btn-set__btn"
        ><span class="dag-u-accessible-hidden">Clear {tokenSemanticName}: {token} from list</span></button>
      </li>
    {/each}
  </ul>
  <input
    bind:value={entry}
    on:input={onInput}
    type="text"
    {pattern}
    class="dag-c-tokeniser__input dag-u-xg-1"
  />
</div>
