import { iNamesAndIdsAnki } from "../interfaces/iNamesAndIdsAnki";
import { iNameAndId } from "../interfaces/iNameAndId";
import { iCardAnki } from "../interfaces/iCardAnki";
import { iCard } from "src/interfaces/iCards";
import { iTemplateAnki } from "../interfaces/iTemplateAnki";
import { iTemplate } from "../interfaces/iTemplate";

export default {
  namesAndIds: {
    from: (data:iNamesAndIdsAnki) => Object.keys(data).map(name => ({name, id: data[name]})),
    to: (data:iNameAndId[]) => data.reduce((obj, item) => (obj[item.name] = item.id, obj), {})
  },
  cards: { // TODO
    from: (data:iCardAnki[]) => data as iCard[],
    to: (data:iCard[]) => data as iCardAnki[]
  },
  templates: {
    from: (data:iTemplateAnki[], namesAndIds:iNameAndId[]) => {
      data ??= [];
      const templates:iTemplate[] = [];
      for (let i=0; i<data.length; i++) {
        const t:iTemplateAnki = data[i];
        if (!t) continue;
        const { id, name } = namesAndIds[i];
        templates.push({ id, name, fields: data[i] });
      }
      return templates;
    },
    to: (data:iTemplate[]) => data.map((t:iTemplate): iTemplateAnki => t.fields)
  }
};
