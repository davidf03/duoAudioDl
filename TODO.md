# Todo

## General
[X] implement {:else}
[ ] develop styles

## Store
[X] get rid of lngs and lng stores; replace with prefs.lngs and .lng
[XS] make prefs.lngs object with keys for each lng, rather than array, to store e.g. deck and template preferences

## Nav
[X] rename mainnav to nav
[X] make hardcoded nav data props from parent
[X] rework navitems so that component is included there, and filtered out before being passed into nav (navItems={navItems.map(({ component, ...p }) => p)}), for easier dynamic assignment of components based on nav
[X] rename currentPage to currentSection
[X] simplify section-change function (currentSection = navItems.find(s => s.alias === e.detail.alias))
[X] rename mainContentId prop to skipId
[ ] implement language selector as &lt;select&gt;
[ ] figure out correct html for language selector, given potential for nice transitions here vs interoperability of generic parts with other contexts, e.g. deck selection on History and defaults selections on Settings

## Queue
[ ] card ignore
[ ] card fields dynamically after template
[ ] card create

## Settings
[ ] set default deck
[ ] set default template
[ ] clear history
[ ] clear ignored
[ ] make default template pref each language prefer last template used before template at first index

## History
[ ] card history after queue
[ ] choose deck after language
