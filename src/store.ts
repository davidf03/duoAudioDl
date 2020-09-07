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

export const prefs = createWritableStore('prefs', {});
export const lngs = createWritableStore('lngs', []);
export const lng =  createWritableStore('lng', '');
export const history = createWritableStore('history', []);
export const queue = createWritableStore('queue', []);

export const loading = createWritableStore('loading', true);

browser.storage.local.get([
  'prefs',
  'lngs',
  'lng',
  'history',
  'queue'
]).then(res => {
  const {
    prefs: prefsLocal,
    lngs: lngsLocal,
    lng: lngLocal,
    history: historyLocal,
    queue: queueLocal
  } = res;
  prefs.set(prefsLocal || {});
  lngs.set(lngsLocal || []);
  lng.set(lngLocal || lngs[0]);
  history.set(historyLocal || []);
  queue.set(queueLocal || []);

  loading.set(false);
});
