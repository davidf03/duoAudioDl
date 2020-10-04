<script lang="ts">
import { v4 as uuid } from 'uuid';
import { onDestroy } from 'svelte';
import type { iNavItem } from './interfaces/iNav';
import type { iNotification, iNotificationReference } from './interfaces/iNotification';
import { notificationMap as nMap } from './maps/notificationMap';
import {
  lngs,
  lng,
  connectingToAnki,
  connectedToAnki,
  notifications,
  mainNavDisplacement
} from './store';
import icons from '../../img/icons/*.svg';
import Nav from './components/Nav/Nav.svelte';
import LanguageSelector from './components/LanguageSelector.svelte';
import Notifier from './components/Notifier/Notifier.svelte';
import Queue from './components/Main/Queue.svelte';
import History from './components/Main/History.svelte';
import Settings from './components/Main/Settings.svelte';

const navId:string = 'dag-nav';
const mainContentId:string = 'dag-main-content';

let navItems:iNavItem[] = buildNavItems();
function buildNavItems (): iNavItem[] {
  return [
    {
      alias: 'queue',
      component: Queue,
      name: 'Queue',
      icon: icons.queue,
      disabled: !$lng
    },
    {
      alias: 'history',
      component: History,
      name: 'History',
      icon: icons.history,
      disabled: !$lng
    },
    {
      alias: 'settings',
      component: Settings,
      name: 'Settings',
      icon: icons.settings,
      disabled: !$lng
    }
  ];
};
let currentSection:iNavItem = navItems[0];

export let navDisplacement:string = $mainNavDisplacement ?? '0px';
function onMountNav (): void {
  $mainNavDisplacement = `${document.getElementById(navId).offsetHeight}px`;
  navDisplacement = $mainNavDisplacement;
}

const unsubFromLng = lng.subscribe(() => navItems = buildNavItems());
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

<div
  style="--nav-displacement:{navDisplacement}"
  class="dag-c-main dag-u-p-r"
>
  <div
    id={navId}
    class="dag-u-p-f dag-u-ibs-0 dag-u-is-1"
  >
    <Nav
      on:mount={onMountNav}
      skipId={mainContentId}
      {navItems}
      {currentSection}
      on:move-to-section={moveToSection}
    />
    {#if $lngs.length > 0}
      <LanguageSelector
        on:mount={onMountNav}
      />
    {/if}
  </div>
  <div id={mainContentId}>
    <svelte:component this={currentSection.component}/>
  </div>
  <Notifier
    classlist="dag-u-p-f dag-u-ibe-0 dag-u-is-1"
  />
  <button on:click={clearData}>clear data</button>
</div>

<style lang="scss">
.dag-c-main {
  margin: 0;
  padding: 0;
  padding-block-start: var(--nav-displacement);

  inline-size: 320px;
  min-block-size: 240px;
  max-block-size: 420px;

  border: $dag-border-s solid var(--dag-border-light);
  background-color: var(--dag-bg);
}
</style>
