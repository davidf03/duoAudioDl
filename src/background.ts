import { v4 as uuid } from 'uuid'; // TODO false error (module not found); seems safe to ignore
import { ttsNameMap } from './maps/ttsNameMap';
import { iCard, iCardGroup, iCardList } from './interfaces/iCards';
import httpOriginUrlParser from './util/httpOriginUrlParser';
import audioUrlParser from './util/audioUrlParser';

const pattern:string = 'https://*.cloudfront.net/*/*';
let reqs = [], timeout; // TODO types

(async function init(): Promise<any> { // TODO return type
  browser.webRequest.onBeforeRequest.addListener(
    collectNewQueueEntries,
    { urls: [pattern] },
  );
  browser.storage.onChanged.addListener(() =>
    browser.storage.local.get('queue').then((res:{queue?:string;}) => 
      setIcon(res?.queue ? Object.keys(res?.queue)?.length : 0)
    )
  );
})();

function collectNewQueueEntries (req): void {
  timeout = setTimeout(addEntriesToQueue, 1000);
  reqs.push(req);
}

async function addEntriesToQueue (): Promise<any> {
  const parseJSON = <T>(json:string, defaultVal:T): T => json ? JSON.parse(json) : defaultVal;
  const pastStores = [
    { key: 'queue', defaultVal: {} as iCardList },
    { key: 'history', defaultVal: {} as iCardList },
    { key: 'ignored', defaultVal: {} as iCardList },
    { key: 'lngs', defaultVal: [] as string[] }
  ];
  const {
    queue,
    history,
    ignored,
    lngs
  } = await browser.storage.local.get(pastStores.map(s => s.key))
  .then(res =>
    pastStores.reduce((obj, s) =>
      (obj[s.key] = parseJSON(res[s.key], s.defaultVal), obj), {}
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

  // add lng if not already added
  if (lngs.indexOf(lng) === -1) {
    lngs.push(lng);
    lngs.sort();
    setStore('lngs', lngs);
  }

  queue[lng] ??= [] as iCardGroup[];

  //find index of group
  const groupName:string = httpOriginUrlParser.getGroup(originUrl);
  let group:number = queue[lng]?.findIndex(g => g.name === name);
  // adding new list and/or group as needed
  let isNewGroup:boolean = false;
  if (typeof(group) !== 'number' || group === -1) {
    isNewGroup = true;
    group = 0;
    queue[lng].unshift({
      id: uuid(),
      name: groupName,
      cards: []
    } as iCardGroup);
  }

  let hasModifiedQueue:boolean = false;

  reqs.forEach(req => {
    const audioUrl:string = req.url;
    // pass over if audioUrl TTS name not valid
    const ttsName:string = audioUrlParser.getTTSName(audioUrl);
    if (!ttsNameMap[lng]?.includes(ttsName)) {
      return;
    }
    // pass over if already dealt with
    if (
      ignored[lng]?.find(g => g.name === name)?.cards?.some(c => c.audioUrl === audioUrl) ||
      history[lng]?.find(g => g.name === name)?.cards?.some(c => c.audioUrl === audioUrl)
    ) {
      return;
    }
    hasModifiedQueue = true; // (everything after this will have modified the queue)
    // if new group or card not present
    if (isNewGroup || !queue[lng][group].cards.some(c => c.audioUrl === audioUrl)) {
      // add card to (potentially new) group of (potentially new) lng
      queue[lng][group].cards.unshift({
        id: uuid(),
        audioUrl,
        pending:true,
        fields:[]
      } as iCard);
      return;
    }
    // if card already exists bump priority
    queue[lng][group].cards.unshift(
      queue[lng][group].cards.splice(
        queue[lng][group].cards.findIndex(c => c.audioUrl === audioUrl), 1
      )[0]
    );
    queue[lng].unshift(queue[lng].splice(group, 1)[0]);
  });

  // update storage.local accordingly
  hasModifiedQueue && setStore('queue', queue);
  reqs = [];
}

function setIcon (queueLen:number): void {
  const path:string = queueLen > 0 ? './icons/48-pending.png' : './icons/48.png';
  browser.browserAction.setIcon({ path });
}
