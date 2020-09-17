import { writable } from 'svelte/store';
import ankiconnect from './contentScripts/ankiConnect';
import ankiParser from './util/ankiParser';
import type { iCardList } from './interfaces/iCards';
import type { iPrefs } from './interfaces/iPrefs';
import type { iNameAndId } from './interfaces/iNameAndId';
import type { iTemplate } from './interfaces/iTemplate';
import type { iCardAnki } from './interfaces/iCardAnki';
import type { iTemplateAnki } from './interfaces/iTemplateAnki';
import { iNamesAndIdsAnki } from './interfaces/iNamesAndIdsAnki';

const createWritableStore = (key:string, startValue:any) => {
  const { subscribe, set } = writable(startValue);
  
  return {
    subscribe,
    set,
    useLocalStorage: (): void => {
      const json:string = localStorage.getItem(key);
      if (json) {
        set(JSON.parse(json));
      }
      
      subscribe((current:any) => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
}

// permanent stores
export const lngs = createWritableStore('lngs', [] as string[]);
export const lng = createWritableStore('lng', '' as string);
export const queue = createWritableStore('queue', {} as iCardList);
export const ignored = createWritableStore('ignored', {} as iCardList);
export const prefs = createWritableStore('prefs', {} as iPrefs);

// joint stores (need sync)
export const history = createWritableStore('cards', {} as iCardList);
export const deckNamesAndIds = createWritableStore('deckNamesAndIds', [] as iNameAndId[]);
export const templateNamesAndIds = createWritableStore('templateNamesAndIds', [] as iNameAndId[]);
export const templates = createWritableStore('templates', [] as iTemplate[])

// temporary stores
export const playingAudioId = writable();
export const expandedCardId = writable();

// stores to represent the state of getting stores (lol)
export const loadingStore = writable(true as boolean);
export const loadingAnkiCards = writable(true as boolean);
export const loadingAnkiDeckNamesAndIds = writable(true as boolean);
export const loadingAnkiTemplateNamesAndIds = writable(true as boolean);
export const loadingAnkiTemplates = writable(true as boolean);

// getting local
browser.storage.local.get([
  'lngs',
  'lng',
  'queue',
  'ignored',
  'prefs',

  'history',
  'deckNamesAndIds',
  'templateNamesAndIds',
  'templates'
]).then(res => {
  const {
    lngs: lngsLocal,
    lng: lngLocal,
    queue: queueLocal,
    ignored: ignoredLocal,
    prefs: prefsLocal,

    history: historyLocal,
    deckNamesAndIds: deckNamesAndIdsLocal,
    templateNamesAndIds: templateNamesAndIdsLocal,
    templates: templatesLocal
  } = res;

  lngs.set(lngsLocal || {} as iCardList);
  lng.set(lngLocal || lngsLocal && lngsLocal[0] || '' as string);
  queue.set(queueLocal || {} as iCardList);
  ignored.set(ignoredLocal || {} as iCardList);
  prefs.set(prefsLocal || {} as iPrefs);

  history.set(historyLocal || {} as iCardList);
  deckNamesAndIds.set(deckNamesAndIdsLocal || [] as iNameAndId[]);
  templateNamesAndIds.set(templateNamesAndIdsLocal || {} as iNameAndId[]);
  templates.set(templatesLocal || {} as iCardList);

  loadingStore.set(false as boolean);
});

// getting updates
// getAnkiUpdates('findCards', 6, updateLocalHistory);
getAnkiUpdates(
  'deckNamesAndIds', 6,
  ankiParser.namesAndIds.from,
  deckNamesAndIds, loadingAnkiDeckNamesAndIds
);
getAnkiUpdates(
  'modelNamesAndIds', 6,
  ankiParser.templates.from,
  templateNamesAndIds, loadingAnkiTemplateNamesAndIds
);
// getAnkiUpdates('findModels', 6, updateLocalTemplates);

interface iStore<T, U> {
  useLocalStorage: ()=>U;
  set: (val:T)=>U;
}
interface iParserMethod<T, U> {
  (data:T): U;
}
interface iUpdatesCallback<T, U, V> {
  (data:T, parserMethod:iParserMethod<T, U>, store:iStore<U, V>, storeLoading:iStore<boolean, V>): void;
}
async function getAnkiUpdates
  <T, U, V>(
    action:string,
    version:number,
    parserMethod:iParserMethod<T, U>,
    store:iStore<U,V>,
    storeLoading:iStore<boolean,V>,
    callback:iUpdatesCallback<T, U, V> = getAnkiUpdatesCallback
  ): Promise<any> {
  ankiconnect.invoke(action, version).then(res => {
    if (loadingStore) {
      loadingStore.subscribe(val => !val && callback(res as T, parserMethod, store, storeLoading))
      return;
    }
    return callback(res as T, parserMethod, store, storeLoading);
  });
}
function getAnkiUpdatesCallback
  <T, U, V>(
    data:T,
    parserMethod:iParserMethod<T, U>,
    store:iStore<U, V>,
    storeLoading:iStore<boolean, V>
  ): void {
  store.useLocalStorage();
  store.set(parserMethod(data));
  storeLoading.set(false);
}
// function updateLocalHistory (data:iCardAnki[]): void {
//   // const ankiCards = ankiParser.cards.from(data);
//   // const historyLocal = history;
//   // cards.forEach(); // by some id, update information in matching cards in history
//   history.useLocalStorage();
//   // history.set(historyLocal);
//   loadingAnkiCards.set(false);
// }
function updateLocalDeckNamesAndIds (data:iNamesAndIdsAnki): void {
  deckNamesAndIds.useLocalStorage();
  deckNamesAndIds.set(ankiParser.namesAndIds.from(data));
  loadingAnkiDeckNamesAndIds.set(false);
}
// function updateLocalTemplateNamesAndIds (data:iNamesAndIdsAnki): void {
//   templateNamesAndIds.useLocalStorage();
//   templateNamesAndIds.set(ankiParser.namesAndIds.from(data));
//   loadingAnkiTemplateNamesAndIds.set(false);
// }
// function updateLocalTemplates (data:iTemplateAnki[]): void {
//   templates.useLocalStorage();
//   templates.set(ankiParser.templates.from(data));
//   loadingAnkiTemplates.set(false);
// }
