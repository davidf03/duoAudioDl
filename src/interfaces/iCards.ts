export interface iCard {
  readonly audioUrl:string;
  audioFile:string;
  fields:string[];
  deckId?:number;
  templateId?:number;
  tags?:string[];
}

export interface iCardGroup {
  name:string;
  cards:iCard[];
}
