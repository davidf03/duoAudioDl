const pattern = 'https://*.cloudfront.net/*/*';
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
  for (const req of reqs) {
    originUrl = await browser.tabs.get(req.tabId).then(res => res.url.split('/').reverse());
    lng = originUrl[2];
    if (lng) break;
  }
  // exit if no lng urls
  if (!lng) return;
  // add lng if not already added
  lngs.indexOf(lng) === -1 && lngs.push(lng), lngs.sort() && browser.storage.local.set({ lngs });

  queue[lng] ??= [];
  const groupname = originUrl[1];
  //find index of group
  let isNewGroup = false;
  let groupIndex = queue[lng].findIndex(g => g.name === groupname);
  if (groupIndex === -1) {
    isNewGroup = true;
    // if absent, add new group
    groupIndex = queue[lng].length;
    queue[lng].unshift({
      name: groupname,
      cards: []
    });
  }

  let hasModifiedQueue = false;

  for (const req of reqs) {
    const url = req.url;

    // ignore lng if invalid or ignore url if already dealt with
    if (ignored[lng]?.includes(url) || history[lng]?.includes(url)) {
      continue;
    }
    // if not new group and card already exists
    if (!isNewGroup && queue[lng][groupIndex].cards.includes(c => c.url === url)) {
      // reprioritize card and its group
      queue[lng][groupIndex].cards.unshift(
        queue[lng][groupIndex].cards.splice(
          queue[lng][groupIndex].cards.findIndex(c => c.url === url), 1
        )
      );
      queue[lng].unshift(
        queue[lng].splice(groupIndex, 1)
      );
      hasModifiedQueue = true;
      continue;
    }
    // add card to (potentially new) group of (potentially new) lng
    queue[lng][groupIndex].cards.unshift({ url, pending: true, fields: [] });
    hasModifiedQueue = true;
  }

  // update storage.local accordingly
  hasModifiedQueue && browser.storage.local.set({ queue });
  reqs = [];
}

function setIconToPending() {
  browser.browserAction.setIcon({ path: './icons/48-pending.png' });
}
