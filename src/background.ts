import { ttsNameMap } from './nameMap';
import { Card, CardGroup, CardList } from './interfaces/Cards';

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
    history = [] as CardList[],
    ignored = [] as CardList[],
    queue = [] as CardList[],
    lngs = [] as string[]
  } = await browser.storage.local.get(['history','ignored','queue','lngs']);

  let lng:string, originUrl:string;
  // get lng (there should be only one, unique one)
  const lngRegex:RegExp = new RegExp('^[a-z]{2}$','i');
  for (const req of reqs) {
    originUrl = await browser.tabs.get(req.tabId).then(res => res.url.split('/').reverse());
    lng = originUrl[2];
    if (lng && lngRegex.test(lng)) break;
  }
  // exit if no lng urls
  if (!lng) return;
  // add lng if not already added
  lngs.indexOf(lng) === -1 && lngs.push(lng), lngs.sort() && browser.storage.local.set({ lngs });

  // add CardList for lng if not present
  let list:number = queue.findIndex(l => l.lng === lng);
  if (list === -1) {
    list = queue.length;
    queue.push({lng, groups:[]} as CardList);
  }

  const name:string = originUrl[1];
  let isNewGroup:boolean = false;
  //find index of group
  let group:number = queue[list].findIndex(g => g.name === name);
  // if absent, add new
  if (group === -1) {
    isNewGroup = true;
    group = 0;
    queue[list].unshift({name, cards:[]} as CardGroup);
  }

  let hasModifiedQueue:boolean = false;

  reqs.forEach(req => {
    const audioUrl:string = req.url;
    // pass over if audioUrl TTS name not valid
    const ttsName:string = audioUrl.split('/').reverse()[1];
    if (!ttsNameMap.find(l => l.lng === lng)?.names?.includes(ttsName)) {
      return;
    }
    // pass over if already dealt with
    if (
      ignored.find(l => l.lng === lng)?.groups?.find(g => g.name === name).some(c => c.audioUrl === audioUrl) ||
      history.find(l => l.lng === lng)?.groups?.find(g => g.name === name).some(c => c.audioUrl === audioUrl)
    ) {
      return;
    }
    hasModifiedQueue = true; // (everything after this will have modified the queue)
    // if new group or card not present
    if (isNewGroup || !queue[list][group].cards.includes(c => c.audioUrl === audioUrl)) {
      // add card to (potentially new) group of (potentially new) lng
      queue[list][group].cards.unshift({audioUrl, pending:true, fields:[]} as Card);
      return;
    }
    // if card already exists bump priority
    queue[list][group].cards.unshift(
      queue[list][group].cards.splice(
        queue[list][group].cards.findIndex(c => c.audioUrl === audioUrl), 1
      )
    );
    queue[list].unshift(
      queue[list].splice(group, 1)
    );
  });

  // update storage.local accordingly
  hasModifiedQueue && browser.storage.local.set({ queue });
  reqs = [];
}

async function setIconToPending (): Promise<any> {
  browser.browserAction.setIcon({ path: './icons/48-pending.png' });
}
