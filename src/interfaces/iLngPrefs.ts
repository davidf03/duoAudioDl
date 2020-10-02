export interface iLngPref {
  deckId?:number;
  templateId?:number;
  useLngTag?:boolean;
  useGroupTag?:boolean;
}

export interface iLngPrefs {
  [key:string]:iLngPref;
}
