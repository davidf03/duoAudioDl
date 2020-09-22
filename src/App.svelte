<script lang="ts">
import { v4 as uuid } from 'uuid';
import {
  lngs,
  lng,
  loadingStore,
  deckNamesAndIds,
  connectingToAnki,
  connectedToAnki,
  notifications
} from './store';
import type { iNavItem } from './interfaces/iNav';
import type { iNotification } from './interfaces/iNotification';
import { notificationMap as nMap } from './maps/notificationMap';
import Spinner from './components/Icons/Spinner.svelte';
import Nav from './components/Nav/Nav.svelte';
import LanguageSelector from './components/LanguageSelector.svelte';
import Notifier from './components/Notifier/Notifier.svelte';
import Queue from './components/Main/Queue.svelte';
import History from './components/Main/History.svelte';
import Settings from './components/Main/Settings.svelte';
import { onDestroy } from 'svelte';

const mainContentId:string = 'main-content';
let navItems:iNavItem[] = buildNavItems();
function buildNavItems (): iNavItem[] {
  return [
    {
      alias: 'queue',
      component: Queue,
      name: 'Queue',
      icon: 'Q',
      disabled: !$lng
    },
    {
      alias: 'history',
      component: History,
      name: 'History',
      icon: 'H',
      disabled: !$lng
    },
    {
      alias: 'settings',
      component: Settings,
      name: 'Settings',
      icon: 'S',
      disabled: !$lng
    }
  ];
};
let currentSection:iNavItem = navItems[0];

const unsubFromLng = lng.subscribe(l => navItems = buildNavItems());
onDestroy(unsubFromLng);

const unsubFromConnectingToAnki = connectingToAnki.subscribe(val => {
  if (val) {
    notifications.clearByCode(nMap.ankiNotConnected.code, nMap.ankiConnected.code);
    if (!!$notifications.find(n => n.code === nMap.ankiConnecting.code)) {
      return;
    }
    notifications.add({
      id: uuid(),
      ...nMap.ankiConnecting
    } as iNotification);
    return;
  }
  if (!$connectedToAnki) {
    notifications.clearByCode(nMap.ankiConnecting.code, nMap.ankiConnected.code);
    if (!!$notifications.find(n => n.code === nMap.ankiNotConnected.code)) {
      return;
    }
    notifications.add({
      id: uuid(),
      ...nMap.ankiNotConnected
    } as iNotification);
    return;
  }
  notifications.clearByCode(nMap.ankiConnecting.code, nMap.ankiNotConnected.code);
  if (!!$notifications.find(n => n.code === nMap.ankiConnected.code)) {
    return;
  }
  notifications.add({
    id: uuid(),
    ...nMap.ankiConnected
  } as iNotification);
});
onDestroy(unsubFromConnectingToAnki);

function moveToSection (e): void {
  const { alias } = e.detail;
  if (alias === currentSection.alias) {
    // reload section ?
    return;
  }
  currentSection = navItems.find(s => s.alias === alias)
}

function clearData (): void {
  browser.storage.local.clear();
}
</script>

<div class="dag-c-main">
  <Nav
    skipId={mainContentId}
    {navItems}
    {currentSection}
    on:move-to-section={moveToSection}
  />
  {#if $lngs.length > 0}
    <LanguageSelector />
  {/if}
  <div id={mainContentId}>
    {#if $loadingStore}
      <Spinner />
    {:else}
      <svelte:component this={currentSection.component}/>
    {/if}
  </div>
  <Notifier />
  <button on:click={clearData}>clear data</button>
</div>
