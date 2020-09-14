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
  templates: { // TODO
    from: (data:iTemplateAnki[]) => data as iTemplate[],
    to: (data:iTemplate[]) => data as iTemplateAnki[]
  }
};
