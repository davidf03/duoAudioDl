export interface iDeck {
  id:number;
  name:string;
}

export interface iTemplate {
  id:number;
  name:string;
}

export interface iLngPrefs {
  lng:string;
  deck?:number;
  template?:number;
}

export interface iPrefs {
  lngs?:iLngPrefs[]
}
