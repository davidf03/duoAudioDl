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
export const history = createWritableStore('history', {});
export const queue = createWritableStore('queue', {});

export const loading = createWritableStore('loading', true);

browser.storage.local.get([
  'prefs',
  'history',
  'queue'
]).then(res => {
  const {
    prefs: prefsLocal,
    history: historyLocal,
    queue: queueLocal
  } = res;
  prefs.set(prefsLocal || {});
  history.set(historyLocal || {});
  queue.set(queueLocal || {});

  loading.set(false);
});
