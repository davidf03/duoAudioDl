import { writable } from 'svelte/store';
import { CardList } from './interfaces/Cards';
import { Prefs } from './interfaces/Prefs';

const createWritableStore = (key:string, startValue:any) => {
  const { subscribe, set } = writable(startValue);
  
  return {
    subscribe,
    set,
    useLocalStorage: () => {
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

export const lngs = createWritableStore('lngs', [] as string[]);
export const lng = createWritableStore('lng', '' as string);
export const queue = createWritableStore('queue', [] as CardList[]);
export const history = createWritableStore('history', [] as CardList[]);
export const ignored = createWritableStore('ignored', [] as CardList[]);
export const prefs = createWritableStore('prefs', {} as Prefs);

export const loadingStore = createWritableStore('loadingStore', true);

browser.storage.local.get([
  'lngs',
  'lng',
  'queue',
  'history',
  'ignored',
  'prefs'
]).then(res => {
  const {
    lngs: lngsLocal,
    lng: lngLocal,
    queue: queueLocal,
    history: historyLocal,
    ignored: ignoredLocal,
    prefs: prefsLocal
  } = res;
  lngs.set(lngsLocal || [] as CardList[]);
  lng.set(lngLocal || lngsLocal && lngsLocal[0] || '' as string);
  queue.set(queueLocal || [] as CardList[]);
  history.set(historyLocal || [] as CardList[]);
  ignored.set(ignoredLocal || [] as CardList[]);
  prefs.set(prefsLocal || {} as Prefs);

  loadingStore.set(false);
});
