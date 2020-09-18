<script lang="ts">
import { v4 as uuid } from 'uuid';
import {
  lngs,
  lng,
  loadingStore,
  templateNamesAndIds,
  loadingAnkiTemplateNamesAndIds,
  deckNamesAndIds,
  loadingAnkiDeckNamesAndIds,
  connectedToAnki,
  notifications
} from './store';
import type { iNavItem } from './interfaces/iNav';
import type { iNotification } from './interfaces/iNotification';
import Spinner from './components/Icons/Spinner.svelte';
import Nav from './components/Nav/Nav.svelte';
import LanguageSelector from './components/LanguageSelector.svelte';
import Notifier from './components/Notifier/Notifier.svelte';
import Queue from './components/Main/Queue.svelte';
import History from './components/Main/History.svelte';
import Settings from './components/Main/Settings.svelte';
import Debug from './components/Main/Debug.svelte';
import { onDestroy } from 'svelte';

const mainContentId:string = 'main-content';
const navItems:iNavItem[] = [
  {
    alias: 'queue',
    component: Queue,
    name: 'Queue',
    icon: 'Q',
    disabled: false //!$lng
  },
  {
    alias: 'history',
    component: History,
    name: 'History',
    icon: 'H',
    disabled: false //!$lng
  },
  {
    alias: 'settings',
    component: Settings,
    name: 'Settings',
    icon: 'S',
    disabled: false //!$lng
  },
  {
    alias: 'debug',
    component: Debug,
    name: 'Debug',
    icon: 'D',
    disabled: false //!$lng
  }
]
let currentSection:iNavItem = navItems[0]

const unsubFromConnectedToAnki = connectedToAnki.subscribe(val => {
  if (val) return;
  if ($notifications.find(n => n.code === 0)) return;
  const ns = $notifications;
  ns.push({
    id: uuid(),
    code: 0,
    priority: 0,
    message: 'No connection to Anki',
    duration: 0
  } as iNotification);
  $notifications = ns;
});
onDestroy(unsubFromConnectedToAnki);

function moveToSection (e): void {
  const { alias } = e.detail;
  if (alias === currentSection.alias) {
    // reload section ?
    return;
  }
  currentSection = navItems.find(s => s.alias === e.detail.alias)
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
</div>
