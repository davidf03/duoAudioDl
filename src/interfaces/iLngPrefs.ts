import type { iNamesAndIdsAnki } from './iNameAndIdAnkiAnki';

export interface iLngPref {
  deckNameAndId?:iNamesAndIdsAnki;
  templateNameAndId?:iNamesAndIdsAnki;
  useLngTag?:boolean;
  useGroupTag?:boolean;
}

export interface iLngPrefs {
  [key:string]:iLngPref;
}
