export interface iCard {
  readonly id:string;
  readonly audioUrl:string;
  pending:boolean;
  fields:string[];
  lastFields:string[];
}

export interface iCardGroup {
  readonly id:string;
  name:string;
  cards:iCard[];
}

export interface iCardList {
  [key:string]:iCardGroup[];
}
