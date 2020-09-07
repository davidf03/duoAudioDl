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

export const history = createWritableStore('history', []);
export const ignored = createWritableStore('ignored', []);
export const queue = createWritableStore('queue', []);
export const deck = createWritableStore('deck', '');
export const loading = createWritableStore('loading', true);

browser.storage.local.get([
  'history',
  'ignored',
  'queue',
  'deck'
]).then(res => {
  const {
    history: historyLocal,
    ignored: ignoredLocal,
    queue: queueLocal,
    deck: deckLocal
  } = res;
  history.set(historyLocal || []);
  ignored.set(ignoredLocal || []);
  queue.set(queueLocal || []);
  deck.set(deckLocal || '');

  loading.set(false);
});
