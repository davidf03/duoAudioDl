const pattern = 'https://*.cloudfront.net/astrid/*';
let reqs = [], timeout;

(function init() {
  browser.webRequest.onBeforeRequest.addListener(
    collectNewQueueEntries,
    { urls: [pattern] },
  );
  browser.storage.onChanged.addListener(() => {
    browser.storage.local.get('queue').then(res => res?.queue?.length > 0 && setIconToPending());
  });
})();

function collectNewQueueEntries(req) {
  timeout = setTimeout(addEntriesToQueue, 1000);
  reqs.push(req);
}

async function addEntriesToQueue() {
  const { history = {}, ignored = {}, queue = {}, lngs = [] } = await browser.storage.local.get(['history','ignored','queue','lngs']);

  let lng, originUrl;
  const lngRegex = new RegExp('^[a-z]{2}$','i');
  // look for lng in urls (there should only be one unique one)
  for (const req of reqs) {
    originUrl = await browser.tabs.get(req.tabId).then(res => res.url.split('/').reverse());
    lng = originUrl[2];
    if (lng && lngRegex.test(lng)) break;
  }
  // exit if no lng urls
  if (!lng) return;
  // add lng if not already added
  lngs.indexOf(lng) === -1 && lngs.push(lng), lngs.sort() && browser.storage.local.set({ lngs });
  queue[lng] ??= [];

  const groupname = originUrl[1];
  let isNewGroup = false;
  //find index of group
  let groupIndex = queue[lng].findIndex(g => g.name === groupname);
  // if absent, add new
  if (groupIndex === -1) {
    isNewGroup = true;
    groupIndex = queue[lng].length;
    queue[lng].unshift({
      name: groupname,
      cards: []
    });
  }

  let hasModifiedQueue = false;

  reqs.forEach(req => {
    const url = req.url;
    // pass over if already dealt with
    if (ignored[lng]?.includes(url) || history[lng]?.includes(url)) {
      return;
    }
    hasModifiedQueue = true; // (everything after this will have modified the queue)
    // if new group or card not present
    if (isNewGroup || !queue[lng][groupIndex].cards.includes(c => c.url === url)) {
      // add card to (potentially new) group of (potentially new) lng
      queue[lng][groupIndex].cards.unshift({ url, pending: true, fields: [] });
      return;
    }
    // if card already exists bump priority
    queue[lng][groupIndex].cards.unshift(
      queue[lng][groupIndex].cards.splice(
        queue[lng][groupIndex].cards.findIndex(c => c.url === url), 1
      )
    );
    queue[lng].unshift(
      queue[lng].splice(groupIndex, 1)
    );
  });

  // update storage.local accordingly
  hasModifiedQueue && browser.storage.local.set({ queue });
  reqs = [];
}

async function setIconToPending() {
  browser.browserAction.setIcon({ path: './icons/48-pending.png' });
}
