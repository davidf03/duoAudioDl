import AnkiConnect from '../customPackages/ankiConnect';
import AudioUrlParser from '../util/audioUrlParser';
import type { iNamesAndIdsAnki } from "../interfaces/iNamesAndIdsAnki";
import type { iNameAndId } from "../interfaces/iNameAndId";
import type { iCardAnki } from "../interfaces/iCardAnki";
import type { iCard } from "../interfaces/iCards";
import type { iTemplateAnki } from "../interfaces/iTemplateAnki";
import type { iTemplate } from "../interfaces/iTemplate";

export default {
  namesAndIds: {
    from: (data:iNamesAndIdsAnki) => Object.keys(data).map(name => ({name, id: data[name]})),
    to: (data:iNameAndId[]) => data.reduce((obj, item) => (obj[item.name] = item.id, obj), {})
  },
  cards: {
    from: (data:iCardAnki): iCard => null, // TODO
    to: async (data:iCard, tags:string[], deckName:string, modelName:string): Promise<iCardAnki> => {
      const { fields, audioUrl } = data;
      const filename:string = AudioUrlParser.getId(audioUrl);
      // await AnkiConnect.invoke('storeMediaFile', 6, { filename, data: audioFile }); // what's even the point of this API if I can't add it to the note
      return {
        fields,
        deckName,
        modelName,
        tags,
        audio: [{
          filename,
          url: audioUrl,
          fields: ['audio']
        }]
      };
    }
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
