import type { iTemplateAnki } from "./iTemplateAnki";

export interface iTemplate {
  id:number;
  name:string;
  fields:iTemplateAnki;
}
