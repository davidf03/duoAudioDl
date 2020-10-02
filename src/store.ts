import { writable } from 'svelte/store';
import AnkiConnect from './ankiConnect';
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
export const lngs = createPersistentStore('lngs', [] as string[]);
export const lng = createPersistentStore('lng', '' as string);
export const prefs = createPersistentStore('prefs', {} as iPrefs);

// anki-based stores
export const history = createPersistentStore('cards', new CardList(), CardList);
export const deckNamesAndIds = createPersistentStore('deckNamesAndIds', [] as iNameAndId[]);
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

export const loadingQueue = createSwitchStore(true);
export const loadedQueue = createSwitchStore(false);
export const loadingIgnored = createSwitchStore(true);
export const loadedIgnored = createSwitchStore(false);
export const loadingPrefs = createSwitchStore(true);
export const loadedPrefs = createSwitchStore(false);
export const loadingLngs = createSwitchStore(true);
export const loadedLngs = createSwitchStore(false);
export const loadingLng = createSwitchStore(true);
export const loadedLng = createSwitchStore(false);

export const loadingHistory = createSwitchStore(true);
export const loadedHistory = createSwitchStore(false);
export const loadingDeckNamesAndIds = createSwitchStore(true);
export const loadedDeckNamesAndIds = createSwitchStore(false);
export const loadingTemplates = createSwitchStore(true);
export const loadedTemplates = createSwitchStore(false);

export const connectingToAnki = createSwitchStore(true);
export const connectedToAnki = createSwitchStore(false);


// init local stores
Promise.all([
  initLocalStore(queue, loadingQueue, loadedQueue),
  initLocalStore(ignored, loadingIgnored, loadedIgnored),
  initLocalStore(prefs, loadingPrefs, loadedPrefs),

  Promise.all([
    initLocalStore(lngs, loadingLngs, loadedLngs),
    initLocalStore(lng, loadingLng, loadedLng)
  ]).then((res:any): void => {
    const lngRes:string = res[1];
    const lngsRes:string[] = res[0];
    // set lng for the first time, if possible and never set before
    !lngRes && lngsRes?.length > 0 && lng.set(lngsRes[0]);
  })
])
.then((): void => {
  loadedStore.on();
  loadingStore.off();
})
.catch((): void => {
  loadingStore.off()
});


// init anki-based stores
Promise.all([
  initJointStore(
    'deckNamesAndIds', 6, undefined,
    deckNamesAndIds,
    loadingDeckNamesAndIds, loadedDeckNamesAndIds,
    AnkiParser.namesAndIds.from
  ),
  Promise.allSettled([
    initLocalStore(templates),
    AnkiConnect.invoke('modelNamesAndIds', 6).then((res:iNamesAndIdsAnki): iNameAndId[] => AnkiParser.namesAndIds.from(res))
  ]).then((res:any): Promise<iTemplate[]> => {
    if (res[1].status !== 'fulfilled') {
      loadingTemplates.off();
      throw new Error('Failed to fetch modelNamesAndIds');
    }
    const templateNamesAndIds:iNameAndId[] = res[1].value ?? [];
    if (templateNamesAndIds.length === 0) {
      loadedTemplates.on();
      loadingTemplates.off();
      Promise.resolve([]);
    }
    // ankiConnect kind of useless here, requires calling individually for each, otherwise could use iniJointStore()
    return Promise.all(templateNamesAndIds?.map((templateInfo:iNameAndId): Promise<iTemplateAnki> =>
      AnkiConnect.invoke('modelFieldNames', 6, { modelName: templateInfo.name })
    )).then((ankiTemplates:iTemplateAnki[]): iTemplate[] => {
      const updatedTemplates:iTemplate[] = AnkiParser.templates.from(ankiTemplates, templateNamesAndIds);
      templates.set(updatedTemplates);

      loadedTemplates.on();
      loadingTemplates.off();

      return updatedTemplates;
    }).catch((): iTemplate[] => {
      throw new Error('Failed to fetch models');
    })
  })
])
.then((): void => {
  connectedToAnki.on();
  connectingToAnki.off();
})
.catch((): void => {
  connectingToAnki.off();
});

async function initLocalStore
  <T>(
    store:iLocalStore<T>,
    loader?:iSwitchStore,
    loaderDone?:iSwitchStore
  ): Promise<T> {
  return store.useLocalStorage().then((res:T): T => {
    loaderDone && loaderDone.on();
    loader && loader.off();
    return res;
  }).catch((err:string): T => {
    loader && loader.off();
    return;
  });
}

async function initJointStore // TODO this function is still serviceable, but is no longer semantic, and should be rewritten, given that all anki-based stores completely supplant their local counter parts and/or require more nuance; the only reason anki waits for local is to ensure it writes over the local store set during useLocalStore()
  <T, U>(
    action:string,
    version:number,
    params:any,
    store:iLocalStore<U>,
    loader:iSwitchStore,
    loaderDone:iSwitchStore,
    callback:iUpdatesCallback<T, U>

  ): Promise<U> {
  // load anki and local simultaneously; last to load calls callback; if local loads first set store while updates from anki load
  let anki:T;
  let local:U;
  return Promise.allSettled([
    AnkiConnect.invoke(action, version, params).then((res:T): U => {
      anki = res;
      return completeJointStoreHalf(anki, local, store, loader, loaderDone, callback);
    }),
    store.useLocalStorage().then((res:U): U => {
      local = res;
      return completeJointStoreHalf(anki, local, store, loader, loaderDone, callback);
    })
  ]).then((res): U => res[0].value ?? res[1].value);
}
function completeJointStoreHalf
  <T, U>(
    anki:T,
    local:U,
    store:iLocalStore<U>,
    loader:iSwitchStore,
    loaderDone:iSwitchStore,
    callback:iUpdatesCallback<T, U>
  ): U {
  if (!anki || !local) return;
  const updatedData:U = callback(anki, local);
  store.set(updatedData);
  loaderDone.on();
  loader.off();
  return updatedData;
}
function integrateHistoryUpdates(data:iCardAnki[], localData:CardList): CardList {
  const updatedData:CardList = localData;
  // const ankiCards:iCard[] = AnkiParser.cards.from(data);
  // cards.forEach(); // by some id, update information in matching cards in history
  return updatedData;
}
