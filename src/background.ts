import { ttsNameMap } from './ttsNameMap';
import { iCard, iCardGroup, iCardList } from './interfaces/iCardss';
import httpOriginUrlParser from './util/httpOriginUrlParser';
import audioUrlParser from './util/audioUrlParser';

const pattern:string = 'https://*.cloudfront.net/*/*';
let reqs = [], timeout; // TODO types

(async function init(): Promise<any> { // TODO return type
  browser.webRequest.onBeforeRequest.addListener(
    collectNewQueueEntries,
    { urls: [pattern] },
  );
  browser.storage.onChanged.addListener(() => {
    browser.storage.local.get('queue').then(res => res?.queue?.length > 0 && setIconToPending());
  });
})();

function collectNewQueueEntries (req): void {
  timeout = setTimeout(addEntriesToQueue, 1000);
  reqs.push(req);
}

async function addEntriesToQueue (): Promise<any> {
  const {
    history = [] as iCardList,
    ignored = [] as iCardList,
    queue = [] as iCardList,
    lngs = [] as string[]
  } = await browser.storage.local.get(['lngs','queue','history','ignored']);

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
    browser.storage.local.set({ lngs });
  }

  // ensure key exists
  if (!Object.keys(queue).includes(lng)) {
    queue.push({[lng]: []} as iCardList);
  }

  //find index of group
  const groupName:string = httpOriginUrlParser.getGroup(originUrl);
  let group:number = queue[lng]?.findIndex(g => g.name === name);
  // adding new list and/or group as needed
  let isNewGroup:boolean = false;
  if (typeof(group) !== 'number' || group === -1) {
    isNewGroup = true;
    group = 0;
    queue[lng] ??= [];
    queue[lng].push({name: groupName, cards: []} as iCardGroup);
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
      ignored[lng]?.find(g => g.name === name)?.some(c => c.audioUrl === audioUrl) ||
      history[lng]?.find(g => g.name === name)?.some(c => c.audioUrl === audioUrl)
    ) {
      return;
    }
    hasModifiedQueue = true; // (everything after this will have modified the queue)
    // if new group or card not present
    if (isNewGroup || !queue[lng][group].cards.includes(c => c.audioUrl === audioUrl)) {
      // add card to (potentially new) group of (potentially new) lng
      queue[lng][group].cards.unshift({audioUrl, pending:true, fields:[]} as iCard);
      return;
    }
    // if card already exists bump priority
    queue[lng][group].cards.unshift(
      queue[lng][group].cards.splice(
        queue[lng][group].cards.findIndex(c => c.audioUrl === audioUrl), 1
      )
    );
    queue[lng].unshift(
      queue[lng].splice(group, 1)
    );
  });

  // update storage.local accordingly
  hasModifiedQueue && browser.storage.local.set({ queue });
  reqs = [];
}

async function setIconToPending (): Promise<any> {
  browser.browserAction.setIcon({ path: './icons/48-pending.png' });
}
