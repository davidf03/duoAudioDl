import { v4 as uuid } from 'uuid'; // TODO false error (module not found); seems safe to ignore
import { ttsNameMap } from './maps/ttsNameMap';
import { CardList } from './classes/CardList';
import type { iCard } from './interfaces/iCards';
import httpOriginUrlParser from './util/httpOriginUrlParser';
import audioUrlParser from './util/audioUrlParser';

const pattern:string = 'https://*.cloudfront.net/*/*';
const queueStoreKey:string = 'queue';
const lngsStoreKey:string = 'lngs';
const localStores = [
  { key: queueStoreKey, defaultVal: new CardList(), class: CardList },
  { key: 'history', defaultVal: new CardList(), class: CardList },
  { key: 'ignored', defaultVal: new CardList(), class: CardList }
];
let reqs = [], timeout; // TODO types

(async function init(): Promise<void> {
  browser.webRequest.onBeforeRequest.addListener(
    collectNewQueueEntries,
    { urls: [pattern] },
  );
  browser.storage.onChanged.addListener(() => {
    const queueStoreDefaultVal:CardList = localStores.find(s => s.key === queueStoreKey).defaultVal as CardList;
    browser.storage.local.get(queueStoreKey).then(res => {
      const queue:CardList = parseJSON(res[queueStoreKey], queueStoreDefaultVal, localStores.find(s => s.key === queueStoreKey).class); // TODO how do you make this generic
      setIcon(queue ? queue.getLngs().length : 0)
    })
  });
})();

function collectNewQueueEntries (req): void {
  timeout = setTimeout(addEntriesToQueue, 1000);
  reqs.push(req);
}

async function addEntriesToQueue (): Promise<void> {
  const {
    queue,
    history,
    ignored
  } = await browser.storage.local.get(localStores.map(s => s.key))
  .then((res:{[key:string]:string}) =>
    localStores.reduce((obj, s) =>
      (obj[s.key] = parseJSON(res[s.key], s.defaultVal, s.class), obj), {}
    )
  );
  const setStore = async <T>(key:string, val:T): Promise<void> => browser.storage.local.set({ [key]: JSON.stringify(val) });

  let lng:string, originUrl:string;
  // get lng (there should be only one, unique one)
  const lngRegex:RegExp = new RegExp('^[a-z]{2}$','i');
  for (const req of reqs) {
    originUrl = await browser.tabs.get(req.tabId).then(res => res.url);
    lng = httpOriginUrlParser.getLng(originUrl);
    if (lng && lngRegex.test(lng)) break;
  }
  // exit if no lng urls
  if (!lng) return;

  const groupName:string = httpOriginUrlParser.getGroup(originUrl);

  let hasModifiedQueue:boolean = false;

  reqs.forEach(req => {
    const audioUrl:string = req.url;
    const ttsName:string = audioUrlParser.getTTSName(audioUrl);
    // pass over if audioUrl TTS name not valid or card already dealt with
    if (
      !ttsNameMap[lng]?.includes(ttsName)
      || ignored.hasCard(audioUrl)
      || history.hasCard(audioUrl)
    ) return;
    const card:iCard = {
      audioUrl,
      fields:[],
      lastFields: []
    };
    queue.addCard(card, groupName, lng);
    hasModifiedQueue = true;
  });
  reqs = [];

  if (!hasModifiedQueue) return;
  setStore(queueStoreKey, queue);
  setStore(lngsStoreKey, Array.from(new Set([].concat(
    queue.getLngs(),
    history.getLngs(),
    ignored.getLngs()
  ))));
}

function setIcon (queueLen:number): void {
  const path:string = queueLen > 0 ? './icons/48-pending.png' : './icons/48.png';
  browser.browserAction.setIcon({ path });
}

function parseJSON <T>(json:string, defaultVal:T, tClass?:{ new(...args: any[]): T }): T {
  const val:T = json ? JSON.parse(json) as T : defaultVal;
  return !tClass ? val : Object.assign(new tClass(), val) as T;
}
