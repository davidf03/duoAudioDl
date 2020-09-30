export interface iCard {
  readonly audioUrl:string;
  audioFile:string;
  groups:string[]; // TODO confusing to have this and also 'hard' structure, but enables multiple group tags
  fields:string[];
  deckId?:number;
  templateId?:number;
  tags?:string[];
}

export interface iCardGroup {
  name:string;
  cards:iCard[];
}
