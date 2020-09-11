export interface Card {
  readonly audioUrl:string;
  pending:boolean;
  fields:string[];
}

export interface CardGroup {
  name:string;
  cards:Card[];
}

export interface CardList {
  lng:string;
  groups:CardGroup[];
}
