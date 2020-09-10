<script>
import { lngs, lng, loadingStore } from './store'
import Spinner from './components/Icons/Spinner.svelte'
import Nav from './components/Nav/Nav.svelte'
import LanguageSelector from './components/LanguageSelector.svelte'
import Queue from './components/Main/Queue.svelte'
import History from './components/Main/History.svelte'
import Settings from './components/Main/Settings.svelte'

const mainContentId = 'main-content'
const navItems = [
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
  }
]
let currentSection = navItems[0]

function moveToSection(e) {
  const { alias } = e.detail;
  if (alias === currentSection.alias) {
    // reload section ?
    return;
  }
  currentSection = navItems.find(s => s.alias === e.detail.alias)
}
</script>

<div class="aud-c-main">
  <Nav
    skipId={mainContentId}
    navItems={navItems.map(({ component, ...i }) => i)}
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
</div>
