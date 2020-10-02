<script lang="ts">
import { v4 as uuid } from 'uuid';
import type { iNavItem } from './interfaces/iNav';
import type { iNotification, iNotificationReference } from './interfaces/iNotification';
import { notificationMap as nMap } from './maps/notificationMap';
import {
  lngs,
  lng,
  connectingToAnki,
  connectedToAnki,
  notifications
} from './store';
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

const unsubFromConnectingToAnki = connectingToAnki.subscribe((val:boolean): void => {
  const notificationTypes:iNotificationReference[] = [
    nMap.ankiConnecting,
    nMap.ankiNotConnected,
    nMap.ankiConnected
  ];
  const notificationType:iNotificationReference = notificationTypes.splice(val ? 0 : !$connectedToAnki ? 1 : 2, 1)[0];
  notifications.clearByCode(...notificationTypes.map((n:iNotificationReference): number => n.code));
  if (!!$notifications.find((n:iNotification): boolean => n.code === notificationType.code))
    return;
  notifications.add({
    id: uuid(),
    ...notificationType
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
  <div class="dag-c-main__nav">
    <Nav
      skipId={mainContentId}
      {navItems}
      {currentSection}
      on:move-to-section={moveToSection}
    />
    {#if $lngs.length > 0}
      <LanguageSelector />
    {/if}
  </div>
  <div id={mainContentId}>
    <svelte:component this={currentSection.component}/>
  </div>
  <Notifier />
  <button on:click={clearData}>clear data</button>
</div>
