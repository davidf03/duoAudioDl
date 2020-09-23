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
  const localStores = [
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
  } = await browser.storage.local.get(localStores.map(s => s.key))
  .then((res:{[key:string]:string}) =>
    localStores.reduce((obj, s) =>
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

  // adding queue list for this lng as needed
  queue[lng] ??= [] as iCardGroup[];

  //find index of group
  const groupName:string = httpOriginUrlParser.getGroup(originUrl);
  let group:number = queue[lng]?.findIndex(g => g.name === name);
  // adding new group as needed
  let isNewGroup:boolean = false;
  if (typeof(group) !== 'number' || group === -1) {
    isNewGroup = true;
    group = 0;
    queue[lng].unshift({
      id: uuid(),
      name: groupName,
      cards: [] as iCard[]
    } as iCardGroup);
  }

  let hasModifiedQueue:boolean = false;

  reqs.forEach(req => {
    const audioUrl:string = req.url;
    const ttsName:string = audioUrlParser.getTTSName(audioUrl);
    // pass over if audioUrl TTS name not valid or card already dealt with
    if (
      !ttsNameMap[lng]?.includes(ttsName)
      || ignored[lng]?.find((g:iCardGroup): boolean => g.name === name)?.cards?.some((c:iCard): boolean => c.audioUrl === audioUrl)
      || history[lng]?.find((g:iCardGroup): boolean => g.name === name)?.cards?.some((c:iCard): boolean => c.audioUrl === audioUrl)
    ) {
      return;
    }
    hasModifiedQueue = true; // (everything after this will have modified the queue)
    // if new group or card not present
    const card:number = isNewGroup ? -1 : queue[lng][group].cards.findIndex((c:iCard): boolean => c.audioUrl === audioUrl);
    if (card === -1) {
      // add card to (potentially new) group of (potentially new) lng
      queue[lng][group].cards.unshift({
        id: uuid(),
        audioUrl,
        pending:true,
        fields:[],
        lastFields: []
      } as iCard);
      return;
    }
    // if card already exists bump priority
    queue[lng][group].cards.unshift(
      queue[lng][group].cards.splice(card, 1)[0]
    );
    queue[lng].unshift(
      queue[lng].splice(group, 1)[0]
    );
  });

  // update storage.local accordingly
  hasModifiedQueue && setStore('queue', queue);
  reqs = [];
}

function setIcon (queueLen:number): void {
  const path:string = queueLen > 0 ? './icons/48-pending.png' : './icons/48.png';
  browser.browserAction.setIcon({ path });
}
