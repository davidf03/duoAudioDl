export interface iCard {
  readonly audioUrl:string;
  readonly id?:number;
  audioFile:string;
  groups:string[]; // TODO confusing to have this and also 'hard' structure, but enables multiple group tags
  fields:{[key:string]:string};
  deckId?:number;
  templateId?:number;
  tags?:string[];
}

export interface iCardGroup {
  name:string;
  cards:iCard[];
}
