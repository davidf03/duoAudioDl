import { writable } from 'svelte/store';
import { iCardList } from './interfaces/iCardss';
import { iPrefs } from './interfaces/iPrefss';

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

// permanent stores
export const lngs = createWritableStore('lngs', [] as string[]);
export const lng = createWritableStore('lng', '' as string);
export const queue = createWritableStore('queue', [] as iCardList[]);
export const history = createWritableStore('history', [] as iCardList[]);
export const ignored = createWritableStore('ignored', [] as iCardList[]);
export const prefs = createWritableStore('prefs', {} as iPrefs);

// temporary stores
export const loadingStore = writable(true as boolean);
export const playingAudioId = writable();
export const expandedCardId = writable();

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
  lngs.set(lngsLocal || [] as iCardList[]);
  lng.set(lngLocal || lngsLocal && lngsLocal[0] || '' as string);
  queue.set(queueLocal || [] as iCardList[]);
  history.set(historyLocal || [] as iCardList[]);
  ignored.set(ignoredLocal || [] as iCardList[]);
  prefs.set(prefsLocal || {} as iPrefs);

  loadingStore.set(false as boolean);
});
