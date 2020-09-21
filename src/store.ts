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


interface iLocalStore<T, U> {
  useLocalStorage: ()=>U;
  set: (val:T)=>U;
}
interface iSwitchStore<T> {
  toggle: ()=>T;
  on: ()=>T;
  off: ()=>T;
}
interface iUpdatesCallback<T, U> {
  (data:T, localData?:U): U;
}

const createPersistentStore = <T>(key:string, startValue:T): any => {
  const { subscribe, set: svelteSet } = writable(startValue);
  return {
    subscribe,
    set: (val:T): void => svelteSet(val),
    unset: (): void => svelteSet(startValue),
    useLocalStorage: async (): Promise<T> => {
      const res:{ [key:string]:string } = await browser.storage.local.get(key);
      const json:string = res[key];
      let val:T;
      if (json) {
        val = JSON.parse(json);
        json && svelteSet(val);
      }
      subscribe(val => browser.storage.local.set({ [key]: JSON.stringify(val) }).then(() => browser.storage.local.get(key).then(res => console.log(res[key]))))
      return val;
    }
  };
}

// local stores
export const lngs = createPersistentStore('lngs', [] as string[]);
export const lng = createPersistentStore('lng', '' as string);
export const queue = createPersistentStore('queue', {} as iCardList);
export const ignored = createPersistentStore('ignored', {} as iCardList);
export const prefs = createPersistentStore('prefs', {} as iPrefs);
export const templateHistory = createPersistentStore('templateHistory', [] as iTemplate[]);

// joint local-anki stores
export const history = createPersistentStore('cards', {} as iCardList);
export const deckNamesAndIds = createPersistentStore('deckNamesAndIds', [] as iNameAndId[]);
export const templateNamesAndIds = createPersistentStore('templateNamesAndIds', [] as iNameAndId[]);
export const templates = createPersistentStore('templates', [] as iTemplate[])

// temporary stores
const createNotificationsStore = (): any => {
  const startValue:iNotification[] = [];
  const { subscribe, set, update } = writable(startValue);
  return {
    subscribe,
    set,
    add: (n:iNotification): void => update(ns => {
      ns.push(n);
      return ns;
    }),
    clearById: (id:string): void => update(ns => {
      const index = ns.findIndex(n => n.id === id);
      if (index !== -1) ns.splice(index, 1);
      return ns;
    }),
    clearAll: (): void => set(startValue)
  };
}
export const notifications = createNotificationsStore();

const createIdTrackerStore = (): any => {
  const { subscribe, set: svelteSet } = writable(null);
  return {
    subscribe,
    set: (id:string): void => svelteSet(id),
    unset: (): void => svelteSet(null)
  };
}
export const playingAudioId = createIdTrackerStore();
export const expandedCardId = createIdTrackerStore();

// stores to represent the state of getting stores (lol)
const createSwitchStore = (initialState:boolean): any => {
  const { subscribe, set, update } = writable(initialState);
  return {
    subscribe,
    toggle: (): void => update(s => !s),
    on: (): void => set(true),
    off: (): void => set(false)
  };
}
export const loadingStore = createSwitchStore(true);
export const loadingAnkiCards = createSwitchStore(true);
export const loadedAnkiCards = createSwitchStore(false);
export const loadingAnkiDeckNamesAndIds = createSwitchStore(true);
export const loadedAnkiDeckNamesAndIds = createSwitchStore(false);
export const loadingAnkiTemplateNamesAndIds = createSwitchStore(true);
export const loadedAnkiTemplateNamesAndIds = createSwitchStore(false);
export const loadingAnkiTemplates = createSwitchStore(true);
export const loadedAnkiTemplates = createSwitchStore(false);
export const connectedToAnki = createSwitchStore(true);


// init local stores
Promise.allSettled([
  lngs.useLocalStorage(),
  lng.useLocalStorage(),
  queue.useLocalStorage(),
  ignored.useLocalStorage(),
  prefs.useLocalStorage(),
  templateHistory.useLocalStorage()
])
.then(res => {
  res[1].value || res[0].value?.[0] && lng.set(res[0].value[0]);
  loadingStore.off();
});

// init joint stores
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

function initJointStore
  <T, U, V>(
    localKey:string,
    action:string,
    version:number,
    store:iLocalStore<U, V>,
    storeLoader:iSwitchStore<V>,
    storeLoaderDone:iSwitchStore<V>,
    callback:iUpdatesCallback<T, U>
  ): void {
  // load anki and local simultaneously; last to load calls callback; if local loads first set store while updates from anki load
  const localPromise:Promise<{[localKey:string]:string}> = browser.storage.local.get(localKey);
  const ankiPromise:Promise<T> = ankiconnect.invoke(action, version);
  Promise.allSettled([localPromise, ankiPromise]).then(res => {
    let data:U;
    let localJson:string = res[0].value?.[localKey];
    const localRes:U = localJson && JSON.parse(localJson);
    if (res[1].status === 'rejected') {
      connectedToAnki.off();
      data = localRes;
    } else {
      data = callback(res[1].value as T, localRes); // TODO is potentially overloading ankiParser illegal in ts?
    }
    if (data) { // TODO not sure this would always work
      store.useLocalStorage();
      store.set(data);
    }
    res[1].status !== 'rejected' && storeLoaderDone.on();
    storeLoader.off();
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
