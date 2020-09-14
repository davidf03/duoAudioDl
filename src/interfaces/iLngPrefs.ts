import type { iNamesAndIdsAnki } from './iNameAndIdAnkiAnki';

export interface iLngPref {
  deckNameAndId?:iNamesAndIdsAnki;
  templateNameAndId?:iNamesAndIdsAnki;
}

export interface iLngPrefs {
  [key:string]:iLngPref;
}
