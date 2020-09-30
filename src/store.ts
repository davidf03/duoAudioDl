import { writable } from 'svelte/store';
import ankiconnect from './ankiConnect';
import ankiParser from './util/ankiParser';
import { CardList } from './classes/CardList';
import type { iPrefs } from './interfaces/iPrefs';
import type { iNameAndId } from './interfaces/iNameAndId';
import type { iTemplate } from './interfaces/iTemplate';
import type { iCardAnki } from './interfaces/iCardAnki';
import type { iTemplateAnki } from './interfaces/iTemplateAnki';
import { iNotification } from './interfaces/iNotification';


interface iLocalStore<T> {
  useLocalStorage: ()=>Promise<T>;
  set: (val:T)=>void;
}
interface iSwitchStore {
  toggle: ()=>void;
  on: ()=>void;
  off: ()=>void;
}
interface iUpdatesCallback<T, U> {
  (data:T, localData?:U): U;
}

const createPersistentStore = <T>(key:string, startValue:T, tClass?:{ new(): T }): any => {
  const { subscribe, set: internalSet } = writable(startValue);
  const set = (val:T): void => val !== undefined && internalSet(val);
  return {
    subscribe,
    set,
    unset: (): void => internalSet(null),
    useLocalStorage: async (): Promise<T> => {
      const json:string = await browser.storage.local.get(key).then(res => res[key]);
      let val:T;
      if (json) {
        const parsed:T = JSON.parse(json) as T;
        val = !tClass ? parsed : Object.assign(new tClass(), parsed) as T;
        set(val);
      }
      subscribe(val => browser.storage.local.set({ [key]: JSON.stringify(val) }));
      return val;
    }
  };
}

// local stores
export const queue = createPersistentStore('queue', new CardList(), CardList);
export const ignored = createPersistentStore('ignored', new CardList(), CardList);
export const lngs = createPersistentStore('lngs', [] as string[]);
export const lng = createPersistentStore('lng', '' as string);
export const prefs = createPersistentStore('prefs', {} as iPrefs);
export const templateHistory = createPersistentStore('templateHistory', [] as iTemplate[]);

// joint local-anki stores
export const history = createPersistentStore('cards', new CardList(), CardList);
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
    add: (n:iNotification): void => update((ns:iNotification[]): iNotification[] => [...ns, n]),
    clearById: (id:string): void => update((ns:iNotification[]): iNotification[] => {
      const index = ns.findIndex(n => n.id === id);
      if (index !== -1) ns.splice(index, 1);
      return ns;
    }),
    clearByCode: (...codes:number[]): void => update(
      (ns:iNotification[]): iNotification[] => ns.filter(
        (n:iNotification): boolean => !codes.includes(n.code)
      )
    ),
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
    toggle: (): void => update((s:boolean): boolean => !s),
    on: (): void => set(true),
    off: (): void => set(false)
  };
}
export const loadingStore = createSwitchStore(true);

export const loadingLocalCards = createSwitchStore(true);
export const loadedLocalCards = createSwitchStore(false);
export const loadingAnkiCards = createSwitchStore(true);
export const loadedAnkiCards = createSwitchStore(false);

export const loadingLocalDeckNamesAndIds = createSwitchStore(true);
export const loadedLocalDeckNamesAndIds = createSwitchStore(false);
export const loadingAnkiDeckNamesAndIds = createSwitchStore(true);
export const loadedAnkiDeckNamesAndIds = createSwitchStore(false);

export const loadingLocalTemplateNamesAndIds = createSwitchStore(true);
export const loadedLocalTemplateNamesAndIds = createSwitchStore(false);
export const loadingAnkiTemplateNamesAndIds = createSwitchStore(true);
export const loadedAnkiTemplateNamesAndIds = createSwitchStore(false);

export const loadingLocalTemplates = createSwitchStore(true);
export const loadedLocalTemplates = createSwitchStore(false);
export const loadingAnkiTemplates = createSwitchStore(true);
export const loadedAnkiTemplates = createSwitchStore(false);

export const connectingToAnki = createSwitchStore(true);
export const connectedToAnki = createSwitchStore(false);


// init local stores
Promise.allSettled([
  lngs.useLocalStorage(),
  lng.useLocalStorage(),
  queue.useLocalStorage(),
  ignored.useLocalStorage(),
  prefs.useLocalStorage(),
  templateHistory.useLocalStorage()
])
.then((res): void => {
  const lngRes:string = res[1].value;
  const lngsRes:string[] = res[0].value;
  !lngRes && lngsRes?.length > 0 && lng.set(lngsRes[0]);
  loadingStore.off();
});

// init joint stores
initJointStore(
  'deckNamesAndIds', 6,
  deckNamesAndIds,
  loadingLocalDeckNamesAndIds, loadedLocalDeckNamesAndIds,
  loadingAnkiDeckNamesAndIds, loadedAnkiDeckNamesAndIds,
  ankiParser.namesAndIds.from
);
initJointStore(
  'modelNamesAndIds', 6,
  templateNamesAndIds,
  loadingLocalTemplateNamesAndIds, loadedLocalTemplateNamesAndIds,
  loadingAnkiTemplateNamesAndIds, loadedAnkiTemplateNamesAndIds,
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

async function initJointStore
  <T, U>(
    action:string,
    version:number,
    store:iLocalStore<U>,
    localLoader:iSwitchStore,
    localLoaderDone:iSwitchStore,
    ankiLoader:iSwitchStore,
    ankiLoaderDone:iSwitchStore,
    callback:iUpdatesCallback<T, U>
  ): Promise<void> {
  // load anki and local simultaneously; last to load calls callback; if local loads first set store while updates from anki load
  let anki:T;
  let local:U;
  ankiconnect.invoke(action, version).then((res:T): void => {
    anki = res;
    completeJointStoreHalf(anki, local, store, ankiLoader, ankiLoaderDone, callback);
  })
  .catch((err:string) => {
    connectedToAnki.off();
    connectingToAnki.off();
  });
  store.useLocalStorage().then((res:U): void => {
    local = res;
    completeJointStoreHalf(anki, local, store, localLoader, localLoaderDone, callback);
  });
}
function completeJointStoreHalf
  <T, U>(
    anki:T,
    local:U,
    store:iLocalStore<U>,
    loader:iSwitchStore,
    loaderDone:iSwitchStore,
    callback:iUpdatesCallback<T, U>
  ): void {
  loaderDone.on();
  loader.off();
  if (!anki || !local) return;
  store.set(callback(anki, local));
  connectedToAnki.on();
  connectingToAnki.off();
}
function integrateHistoryUpdates(data:iCardAnki[], localData:CardList): CardList {
  const updatedData:CardList = localData;
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
