export interface iCard {
  readonly audioUrl:string;
  audioFile:string|ArrayBuffer;
  fields:string[];
  lastFields:string[];
}

export interface iCardGroup {
  name:string;
  cards:iCard[];
}
