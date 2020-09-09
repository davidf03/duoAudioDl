import { writable } from 'svelte/store';

const createWritableStore = (key, startValue) => {
  const { subscribe, set } = writable(startValue);
  
  return {
    subscribe,
    set,
    useLocalStorage: () => {
      const json = localStorage.getItem(key);
      if (json) {
        set(JSON.parse(json));
      }
      
      subscribe(current => {
        localStorage.setItem(key, JSON.stringify(current));
      });
    }
  };
}

export const lngs = createWritableStore('lngs', []);
export const lng = createWritableStore('lng', '');
export const queue = createWritableStore('queue', {});
export const history = createWritableStore('history', {});
export const prefs = createWritableStore('prefs', {});

export const loadingStore = createWritableStore('loadingStore', true);

browser.storage.local.get([
  'lngs',
  'lng',
  'queue',
  'history',
  'prefs'
]).then(res => {
  const {
    lngs: lngsLocal,
    lng: lngLocal,
    queue: queueLocal,
    history: historyLocal,
    prefs: prefsLocal
  } = res;
  lngs.set(lngsLocal || []);
  lng.set(lngLocal || lngsLocal[0]);
  queue.set(queueLocal || {});
  history.set(historyLocal || {});
  prefs.set(prefsLocal || {});

  loadingStore.set(false);
});
