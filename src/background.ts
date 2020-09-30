import _ from 'lodash';
import { ttsNameMap } from './maps/ttsNameMap';
import { CardList } from './classes/CardList';
import type { iCard } from './interfaces/iCards';
import HTTPOriginUrlParser from './util/HTTPOriginUrlParser';
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
  timeout = setTimeout(async () => await addEntriesToQueue(), 1000);
  reqs.push(req);
}

async function addEntriesToQueue (): Promise<void> {
  const reqsInstance = _.cloneDeep(reqs);
  reqs = [];
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
  const setStore = <T>(key:string, val:T): Promise<void> => browser.storage.local.set({ [key]: JSON.stringify(val) });

  let lng:string, originUrl:string;
  // get lng (there should be only one, unique one)
  const lngRegex:RegExp = new RegExp('^[a-z]{2}$','i');
  for (const req of reqsInstance) {
    if (req.tabId === -1) continue;
    originUrl = await browser.tabs.get(req.tabId).then(res => res.url);
    lng = HTTPOriginUrlParser.getLng(originUrl);
    if (lng && lngRegex.test(lng)) break;
  }
  // exit if no lng urls
  if (!lng) return;

  const groupName:string = HTTPOriginUrlParser.getGroup(originUrl);

  // skip cards if audioUrl TTS name not valid or card already exists
  const filteredReqsInstance = reqsInstance.filter(req => {
    const audioUrl:string = req.url;
    if (!audioUrl) return false;
    const ttsName:string = audioUrlParser.getTTSName(audioUrl);
    if (
      !ttsNameMap[lng]?.includes(ttsName)
      || queue.hasCard(audioUrl)
      || ignored.hasCard(audioUrl)
      || history.hasCard(audioUrl)
    ) return false;

    const card:iCard = {
      audioUrl,
      audioFile: null,
      groups: [groupName],
      fields: []
    };
    return queue.addCard(card, groupName, lng);
  });

  if (filteredReqsInstance.length === 0) return;

  // set lngs and queue added cards
  const lngs:string[] = Array.from(new Set([].concat(
    queue.getLngs(),
    history.getLngs(),
    ignored.getLngs()
  )));
  setStore(lngsStoreKey, lngs);
  await setStore(queueStoreKey, queue);

  // download files for all new cards and commit to queue
  Promise.all(filteredReqsInstance.map(req => {
    const audioUrl:string = req.url;

    const xhr:XMLHttpRequest = new XMLHttpRequest();
    const fileReader:FileReader = new FileReader();

    return new Promise((resolve) => {
      xhr.open('GET', audioUrl, true);
      xhr.responseType = 'arraybuffer';
      xhr.addEventListener('load', () => resolve(), false);
      xhr.send();
    }).then(() => new Promise<string|ArrayBuffer>((resolve) => {
      const blob:Blob = new Blob([xhr.response], {type: 'audio/ogg'});
      fileReader.onload = (e) => resolve(e.target.result);
      fileReader.readAsDataURL(blob);
    }));
  })).then(async (audioFiles:any[]) => {
    const queueStoreDefaultVal:CardList = localStores.find(s => s.key === queueStoreKey).defaultVal as CardList;
    const queue:CardList = await browser.storage.local.get(queueStoreKey).then(res => parseJSON(res[queueStoreKey], queueStoreDefaultVal, CardList));
    for (let i=0; i<filteredReqsInstance.length; i++) {
      const card:iCard = queue.getCard(filteredReqsInstance[i].url);
      card.audioFile = audioFiles[i] as string;
      queue.updateCard(card);
    }
    setStore(queueStoreKey, queue);
  });
}

function setIcon (queueLen:number): void {
  const path:string = queueLen > 0 ? './icons/48-pending.png' : './icons/48.png';
  browser.browserAction.setIcon({ path });
}

function parseJSON <T>(json:string, defaultVal:T, tClass?:{ new(): T }): T {
  const val:T = json ? JSON.parse(json) as T : defaultVal;
  return !tClass ? val : Object.assign(new tClass(), val) as T;
}
