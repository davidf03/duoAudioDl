<script lang="ts">
import { v4 as uuid } from 'uuid';
import { onDestroy } from 'svelte';
import AnkiConnect from '../../ankiConnect';
import AnkiParser from '../../util/ankiParser';
import AudioUrlParser from '../../util/audioUrlParser';
import type { iCard, iCardGroup } from '../../interfaces/iCards';
import type { iCardAnki } from '../../interfaces/iCardAnki';
import type { iNotification } from '../../interfaces/iNotification';
import type { iNameAndId } from '../../interfaces/iNameAndId';
import type { iTemplate } from '../../interfaces/iTemplate';
import { notificationMap as nMap } from '../../maps/notificationMap';
import {
  queue,
  lng,
  loadingQueue,
  loadedQueue,
  ignored,
  history,
  notifications,
deckNamesAndIds,
templates
} from '../../store';
import CardList from '../Cards/CardList.svelte';
import Spinner from '../Icons/Spinner.svelte';


let cardGroups:iCardGroup[];
function assignCardList (): void {
  cardGroups = $queue.getGroups($lng);
};

const unsubFromLoadedQueue = loadedQueue.subscribe((val:boolean): void => val && assignCardList());
onDestroy(unsubFromLoadedQueue);

const unsubFromQueue = queue.subscribe((): void => assignCardList());
onDestroy(unsubFromQueue);

const unsubFromLng = lng.subscribe((): void => { // TODO type
  assignCardList();
  // scroll to top
});
onDestroy(unsubFromLng);

function onIgnore (e): void {
  const { id, groupName } = e.detail;
  const card:iCard = $queue.clearCard(id);
  $queue = $queue;
  $ignored.addCard(card, groupName, $lng);
}
async function onCardSubmitted (e): Promise<void> {
  const { card, tags, deckId, templateId, groupName } = e.detail;
  try {
    const deckName:string = $deckNamesAndIds.find((d:iNameAndId): boolean => d.id === deckId).name;
    const templateName:string = $templates.find((t:iTemplate): boolean => t.id === templateId).name;
    const note:iCardAnki = await AnkiParser.cards.to(
      card,
      tags,
      deckName,
      templateName
    );
    const id:number = await AnkiConnect.invoke('addNote', 6, { note });

    $queue.clearCard(card.audioUrl);
    $queue = $queue;
    card.id = id;
    $history.addCard(card, groupName, $lng);

    notifications.add({
      id: uuid(),
      ...nMap.cardCreated
    } as iNotification)
  } catch {
    notifications.addUniqueCode({
      id: uuid(),
      ...nMap.ankiNotConnected
    } as iNotification)
  }
}
function onFieldsUpdated (): void {
  $queue = $queue;
}
</script>

<div class="dag-c-home">
  {#if $loadingQueue}
    <Spinner />
  {:else if $loadedQueue}
    {#if $lng}
      {#if cardGroups?.length > 0}
        <CardList
          on:cardignored={onIgnore}
          on:cardsubmitted={onCardSubmitted}
          on:fieldsupdated={onFieldsUpdated}
          {cardGroups}
        />
      {:else}
        <p>No cards in queue</p>
      {/if}
    {:else}
      <p>Use DuoLingo to generate cards</p>
    {/if}
  {:else}
    <p>Unable to load queue</p>
  {/if}
</div>
