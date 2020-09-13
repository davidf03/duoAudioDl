export interface iCard {
  readonly audioUrl:string;
  pending:boolean;
  fields:string[];
}

export interface iCardGroup {
  name:string;
  cards:iCard[];
}

export interface iCardList {
  lng:string;
  groups:iCardGroup[];
}
