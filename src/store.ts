import { writable } from 'svelte/store';
import AnkiConnect from './customPackages/ankiConnect';
import AnkiParser from './util/AnkiParser';
import { CardList } from './classes/CardList';
import type { iPrefs } from './interfaces/iPrefs';
import type { iNameAndId } from './interfaces/iNameAndId';
import type { iTemplate } from './interfaces/iTemplate';
import type { iCardAnki } from './interfaces/iCardAnki';
import type { iTemplateAnki } from './interfaces/iTemplateAnki';
import { iNotification } from './interfaces/iNotification';
import { iNamesAndIdsAnki } from './interfaces/iNamesAndIdsAnki';


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
export const lng = createPersistentStore('lng', '' as string);
export const prefs = createPersistentStore('prefs', {} as iPrefs);

// anki-based stores
export const history = createPersistentStore('cards', new CardList(), CardList);
export const decks = createPersistentStore('decks', [] as iNameAndId[]);
export const templates = createPersistentStore('templates', [] as iTemplate[])

// temporary stores
const createNotificationsStore = (): any => {
  const startValue:iNotification[] = [];
  const { subscribe, set, update } = writable(startValue);
  return {
    subscribe,
    set,
    add: (n:iNotification): void => update((ns:iNotification[]): iNotification[] => [...ns, n]),
    addUniqueCode: (n:iNotification) => update((ns:iNotification[]): iNotification[] =>
      ns.findIndex((notification:iNotification): boolean => notification.code === n.code) === -1 ? [...ns, n] : ns
    ),
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
export const loadedStore = createSwitchStore(false);

export const loadingLng = createSwitchStore(true);
export const loadedLng = createSwitchStore(false);
export const resolvedLng = createSwitchStore(false);

export const loadingQueue = createSwitchStore(true);
export const loadedQueue = createSwitchStore(false);
export const loadingHistory = createSwitchStore(true);
export const loadedHistory = createSwitchStore(false);
export const loadingIgnored = createSwitchStore(true);
export const loadedIgnored = createSwitchStore(false);

export const loadingTemplates = createSwitchStore(true);
export const loadedTemplates = createSwitchStore(false);
export const loadingDecks = createSwitchStore(true);
export const loadedDecks = createSwitchStore(false);

export const loadingPrefs = createSwitchStore(true);
export const loadedPrefs = createSwitchStore(false);

export const loadingAnkiDecks = createSwitchStore(true);
export const loadedAnkiDecks = createSwitchStore(false);
export const loadingAnkiHistory = createSwitchStore(true);
export const loadedAnkiHistory = createSwitchStore(false);
export const loadingAnkiTemplates = createSwitchStore(true);
export const loadedAnkiTemplates = createSwitchStore(false);

export const connectingToAnki = createSwitchStore(true);
export const connectedToAnki = createSwitchStore(false);

const localStoreLoadingStatuses:{[key:string]:number} = {};
const ankiLoadingStatuses:{[key:string]:number} = {};

function setMainLoaderStatus (
  statusObject:{[key:string]:number},
  loader:iSwitchStore,
  loaderDone:iSwitchStore
): void {
  let isOngoing:boolean = false;
  for (let key of Object.keys(statusObject)) {
    if (statusObject[key] === 1) {
      loader.off();
      return;
    }
    if (statusObject[key] === 0) {
      isOngoing = true;
    }
  }
  if (isOngoing) return;
  loaderDone.on();
  loader.off();
}

// init local stores
initLocalStore(prefs, 'prefs', loadingPrefs, loadedPrefs),

Promise.all([
  initLocalStore(lng, 'lng', loadingLng, loadedLng),
  initLocalStore(queue, 'queue', loadingQueue, loadedQueue),
  initLocalStore(history, 'history', loadingHistory, loadedHistory), // TODO replace with joint init or similar to update from anki
  initLocalStore(ignored, 'ignored', loadingIgnored, loadedIgnored)
]).then((res:any): void => {
  const lngRes:string = res[0];
  const queueLngs:string[] = res[1]?.getLngs() || [];
  // forcing lng to one in the queue to go directly to card creation
  if (queueLngs.length > 0 && !queueLngs.includes(lngRes)) {
    lng.set(queueLngs[0]);
    resolvedLng.on();
    return;
  }
  if (lngRes) {
    resolvedLng.on();
    return;
  }

  // in case it's somehow not set, got unset, etc. for any card to be in history/ignored, a lng must first have been selected, therefore any presently selected lng, if not in the queue, must be found here
  const historyLngs:string[] = res[2]?.getLngs() || [];
  const ignoredLngs:string[] = res[3]?.getLngs() || [];
  if (historyLngs.length === 0 || ignoredLngs.length === 0) {
    resolvedLng.on();
    return;
  }
  const lngs:string[] = Array.from(new Set([].concat(
    historyLngs,
    ignoredLngs
  ))).sort();

  lng.set(lngs[0]);
  resolvedLng.on();
});

initJointStore(
  'decks',
  'deckNamesAndIds', 6, undefined,
  decks,
  loadingDecks, loadedDecks,
  loadingAnkiDecks, loadedAnkiDecks,
  AnkiParser.namesAndIds.from
);

// templates
const templatesStatusKey:string = 'templates';
ankiLoadingStatuses[templatesStatusKey] = 0;
Promise.allSettled([
  initLocalStore(templates, templatesStatusKey, loadingAnkiTemplates, loadedAnkiTemplates),
  AnkiConnect.invoke('modelNamesAndIds', 6).then((res:iNamesAndIdsAnki): iNameAndId[] => AnkiParser.namesAndIds.from(res))
]).then((res:any): Promise<iTemplate[]> => {
  if (res[1].status !== 'fulfilled') {
    throw new Error('Failed to fetch modelNamesAndIds');
  }

  const templateNamesAndIds:iNameAndId[] = res[1].value ?? [];
  if (templateNamesAndIds.length === 0) {
    Promise.resolve([]);
  }
  // ankiConnect kind of useless here, requires calling individually for each, otherwise could use iniJointStore()
  return Promise.all(templateNamesAndIds?.map((templateInfo:iNameAndId): Promise<iTemplateAnki> =>
    AnkiConnect.invoke('modelFieldNames', 6, { modelName: templateInfo.name })
  )).then((ankiTemplates:iTemplateAnki[]): iTemplate[] => {
    const updatedTemplates:iTemplate[] = AnkiParser.templates.from(ankiTemplates, templateNamesAndIds);
    templates.set(updatedTemplates);
    setLoaderSucceeded(templatesStatusKey, loadingAnkiTemplates, loadedAnkiTemplates, ankiLoadingStatuses, connectingToAnki, connectedToAnki);
    return updatedTemplates;
  }).catch((): iTemplate[] => {
    setLoaderFailed(templatesStatusKey, loadingAnkiTemplates, ankiLoadingStatuses, connectingToAnki, connectedToAnki);
    throw new Error('Failed to fetch models');
  })
});

async function initLocalStore
  <T>(
    store:iLocalStore<T>,
    key:string,
    loader:iSwitchStore,
    loaderDone:iSwitchStore
  ): Promise<T> {
  localStoreLoadingStatuses[key] = 0;
  return store.useLocalStorage().then((res:T): T => {
    setLoaderSucceeded(key, loader, loaderDone, localStoreLoadingStatuses, loadingStore, loadedStore);
    return res;
  }).catch((): T => {
    setLoaderFailed(key, loader, localStoreLoadingStatuses, loadingStore, loadedStore)
    return;
  });
}

async function initJointStore // TODO this function is still serviceable, but is no longer semantic, and should be rewritten, given that all anki-based stores completely supplant their local counter parts and/or require more nuance; the only reason anki waits for local is to ensure it writes over the local store set during useLocalStore()
  <T, U>(
    key:string,
    action:string,
    version:number,
    params:any,
    store:iLocalStore<U>,
    localLoader:iSwitchStore,
    localLoaderDone:iSwitchStore,
    ankiLoader:iSwitchStore,
    ankiLoaderDone:iSwitchStore,
    callback:iUpdatesCallback<T, U>
): Promise<U> {
  // load anki and local simultaneously; last to load calls callback; if local loads first set store while updates from anki load
  let anki:T;
  let local:U;
  ankiLoadingStatuses[key] = 0;
  return Promise.allSettled([
    AnkiConnect.invoke(action, version, params).then((res:T): U => {
      anki = res;
      return completeJointStoreHalf(
        key,
        anki, local, store,
        ankiLoader, ankiLoaderDone,
        ankiLoadingStatuses, connectingToAnki, connectedToAnki,
        callback
      );
    }).catch(() => setLoaderFailed(key, ankiLoader, ankiLoadingStatuses, connectingToAnki, connectedToAnki)),
    store.useLocalStorage().then((res:U): U => {
      local = res;
      return completeJointStoreHalf(
        key,
        anki, local, store,
        localLoader, localLoaderDone,
        localStoreLoadingStatuses, loadingStore, loadedStore,
        callback
      );
    }).catch(() => setLoaderFailed(key, localLoader, localStoreLoadingStatuses, loadingStore, loadedStore))
  ]).then((res): U => res[0].value ?? res[1].value);
}
function completeJointStoreHalf
  <T, U>(
    key:string,
    anki:T,
    local:U,
    store:iLocalStore<U>,
    loader:iSwitchStore,
    loaderDone:iSwitchStore,
    loadingStatuses:{[key:string]:number},
    mainLoader:iSwitchStore,
    mainLoaderDone:iSwitchStore,
    callback:iUpdatesCallback<T, U>
): U {
  let val:U;
  if (anki && local) {
    const updatedData:U = callback(anki, local);
    store.set(updatedData);
    val = updatedData;
  }
  setLoaderSucceeded(key, loader, loaderDone, loadingStatuses, mainLoader, mainLoaderDone);
  return val;
}
function integrateHistoryUpdates(data:iCardAnki[], localData:CardList): CardList {
  const updatedData:CardList = localData;
  // const ankiCards:iCard[] = AnkiParser.cards.from(data);
  // cards.forEach(); // by some id, update information in matching cards in history
  return updatedData;
}

function setLoaderSucceeded (
  key:string,
  loader:iSwitchStore,
  loaderDone:iSwitchStore,
  statuses:{[key:string]:number},
  mainLoader:iSwitchStore,
  mainLoaderDone:iSwitchStore
): void {
  loaderDone.on();
  loader.off();
  statuses[key] = 2;
  setMainLoaderStatus(statuses, mainLoader, mainLoaderDone);
}

function setLoaderFailed (
  key:string,
  loader:iSwitchStore,
  statuses:{[key:string]:number},
  mainLoader:iSwitchStore,
  mainLoaderDone:iSwitchStore
): void {
  loader.off();
  statuses[key] = 1;
  setMainLoaderStatus(statuses, mainLoader, mainLoaderDone);
}
