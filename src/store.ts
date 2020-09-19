import { writable } from 'svelte/store';
import ankiconnect from './contentScripts/ankiConnect';
import ankiParser from './util/ankiParser';
import type { iCardList, iCard } from './interfaces/iCards';
import type { iPrefs } from './interfaces/iPrefs';
import type { iNameAndId } from './interfaces/iNameAndId';
import type { iTemplate } from './interfaces/iTemplate';
import type { iCardAnki } from './interfaces/iCardAnki';
import type { iTemplateAnki } from './interfaces/iTemplateAnki';
import { iNotification } from './interfaces/iNotification';

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
export const templateHistory = createWritableStore('templateHistory', [] as iTemplate[])

// joint stores (need sync)
export const history = createWritableStore('cards', {} as iCardList);
export const deckNamesAndIds = createWritableStore('deckNamesAndIds', [] as iNameAndId[]);
export const templateNamesAndIds = createWritableStore('templateNamesAndIds', [] as iNameAndId[]);
export const templates = createWritableStore('templates', [] as iTemplate[])

// temporary stores
function createNotifications () {
  const { subscribe, set, update } = writable([] as iNotification[]);

  return {
    subscribe,
    set,
    add: (n:iNotification) => update(ns => {
      ns.push(n);
      return ns;
    });
    clearById: (id:string) => update(ns => {
      const index = ns.findIndex(n => n.id === id);
      if (index !== -1) ns.splice(index, 1);
      return ns;
    }),
    clearAll: () => set([] as iNotification[])
  };
}
export const notifications = createNotifications();
export const playingAudioId = writable();
export const expandedCardId = writable();

// stores to represent the state of getting stores (lol)
export const loadingStore = writable(true);
export const loadingAnkiCards = writable(true);
export const loadedAnkiCards = writable(false);
export const loadingAnkiDeckNamesAndIds = writable(true);
export const loadedAnkiDeckNamesAndIds = writable(false);
export const loadingAnkiTemplateNamesAndIds = writable(true);
export const loadedAnkiTemplateNamesAndIds = writable(false);
export const loadingAnkiTemplates = writable(true);
export const loadedAnkiTemplates = writable(false);
export const connectedToAnki = writable(true);

// init permanent stores
browser.storage.local.get([
  'lngs',
  'lng',
  'queue',
  'ignored',
  'prefs',
  'templateHistory'
]).then(res => {
  const {
    lngs: lngsLocal,
    lng: lngLocal,
    queue: queueLocal,
    ignored: ignoredLocal,
    prefs: prefsLocal,
    templateHistory: templateHistoryLocal
  } = res;

  lngsLocal && lngs.set(lngsLocal);
  lngLocal && lng.set(lngLocal) || lngsLocal?.[0] && lng.set(lngsLocal[0]);
  queueLocal && queue.set(queueLocal);
  ignoredLocal && ignored.set(ignoredLocal);
  prefsLocal && prefs.set(prefsLocal);
  templateHistoryLocal && templateHistory.set(templateHistoryLocal);

  loadingStore.set(false);
});


initJointStore(
  'deckNamesAndIds',
  'deckNamesAndIds', 6,
  deckNamesAndIds, loadingAnkiDeckNamesAndIds, loadedAnkiDeckNamesAndIds,
  ankiParser.namesAndIds.from
);
initJointStore(
  'templateNamesAndIds',
  'modelNamesAndIds', 6,
  templateNamesAndIds, loadingAnkiTemplateNamesAndIds, loadedAnkiTemplateNamesAndIds,
  ankiParser.namesAndIds.from
);
// initJointStore(
//   'history',
//   'findCards', 6,
//   history, loadingAnkiCards,
//   integrateHistoryUpdates
// );
// getAnkiUpdates(
//   'templates',
//   'findModels', 6,
//   templates, loadingAnkiTemplates,
//   integrateTemplateUpdates
// );


interface iStore<T, U> {
  useLocalStorage: ()=>U;
  set: (val:T)=>U
}
interface iUpdatesCallback<T, U> {
  (data:T, localData?:U): U;
}

async function initJointStore
  <T, U, V>(
    localKey:string,
    action:string,
    version:number,
    store:iStore<U, V>,
    storeLoader:iStore<boolean, V>,
    storeLoaderDone:iStore<boolean, V>,
    callback:iUpdatesCallback<T, U>
  ): Promise<any> {
  // load anki and local simultaneously; last to load calls callback; if local loads first set store while updates from anki load
  const localPromise = browser.storage.local.get(localKey);
  const ankiPromise = ankiconnect.invoke(action, version);
  Promise.allSettled([localPromise, ankiPromise]).then(res => {
    let data:U;
    if (res[1].status === 'rejected') {
      connectedToAnki.set(false);
      data = res[0].value as U;
    } else {
      data = callback(res[1].value as T, res[0].value as U); // TODO is potentially overloading ankiParser illegal in ts?
    }
    if (data) {
      store.useLocalStorage();
      store.set(data);
    }
    res[1].status !== 'rejected' && storeLoaderDone.set(true);
    storeLoader.set(false);
  });
}

function integrateHistoryUpdates(data:iCardAnki[], localData:iCardList): iCardList {
  const updatedData:iCardList = localData;
  // const ankiCards:iCard[] = ankiParser.cards.from(data);
  // cards.forEach(); // by some id, update information in matching cards in history
  return updatedData;
}

function integrateTemplateUpdates(data:iTemplateAnki[], localData:iTemplate[]): iTemplate[] {
  const updatedData:iTemplate[] = localData;
  // const ankiTemplates:iTemplate[] = ankiParser.templates.from(data);
  // templates.forEach(); // delete previous templates, but keep ones for cards in queue that use them/lang prefs
  return updatedData;
}
