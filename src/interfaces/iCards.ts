export interface iCard {
  readonly audioUrl:string;
  fields:string[];
  lastFields:string[];
}

export interface iCardGroup {
  name:string;
  cards:iCard[];
}
