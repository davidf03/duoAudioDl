export interface iCardAnki {
  deckName:string;
  modelName:string;
  fields:{[key:string]:string};
  tags:string[];
  audio:{[key:string]:string|string[]}[];
}
