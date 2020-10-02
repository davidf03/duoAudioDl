# Todo

[ ] develop styles


[ ] generalise implementation of lng adding to avoid false positives for target language in case translation audio is provided too


[ ] figure out correct html for language selector, given potential for nice transitions here vs interoperability of generic parts with other contexts, e.g. deck selection on History and defaults selections on Settings
- consider making language selector a wrapper containing special toggle, around a collapsed select-like radio set

[ ] card fields dynamically after template

[ ] card ignore

[ ] card create

[ ] make default template pref each language prefer last template used before template at first index


[ ] clear history

[ ] clear ignored


[ ] card history after queue

[ ] choose deck after language

[ ] Anki connection status indicator, potentially with option to reload (idk why, but might be nice)

[ ] Variable/multi-stage notifications (e.g. connecting -> connected)

[ ] Fix automatic setting of first language


[ ] make card-group relationships less strict (one-to-many, not one-to-one), in case multiple audio tracks are used across groups, to give a more honest picture of what each group ought to contain

  [ ] make groups tags

  [ ] update tags of all collected cards

    [ ] make historical cards visible when updated
  
  [ ] settings per language for

    [ ] automatically adding language and group tags

[ ] Tokeniser improvements

  [ ] focus control for browsing tags w/ aria-live, for accessibility

    [ ] aria-live

    [ ] focus next in list on clear

  [ ] autocomplete for previously used and not present tags

[ ] get rid of templateNamesAndIds store and just use a mapped templates
