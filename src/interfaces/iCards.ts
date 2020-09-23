export interface iCard {
  readonly id:string;
  readonly audioUrl:string;
  modified:number;
  pending:boolean;
  fields:string[];
}

export interface iCardGroup {
  readonly id:string;
  name:string;
  cards:iCard[];
}

export interface iCardList {
  [key:string]:iCardGroup[];
}
