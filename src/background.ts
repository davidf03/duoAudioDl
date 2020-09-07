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
  timeout = setTimeout(addEntriesToQueue, 100);
  reqs.push(req);
}

async function addEntriesToQueue() {
  const { history = {}, queue = {}, lngs = {} } = await browser.storage.local.get(['history','queue','lngs']);

  let hasAddedToQueue = false;

  for (const req of reqs) {
    const url = req.url;
    const originUrl = await browser.tabs.get(req.tabId).then(res => res.url.split('/').reverse());
    const lng = originUrl[2];
    if (history[lng]?.includes(url)) {
      return;
    }
    // if lang absent from queue, create group array and, if lang absent from lngs, add it
    queue[lng] ??= [] && lngs.find(lng) || lngs.push(lng);

    const groupname = originUrl[1]
    //find index of group within lang
    let groupIndex = queue[lng].findIndex(f => f.name === groupname);
    if (groupIndex === -1) {
      // if absent, add new group
      groupIndex = queue[lng].cards.length;
      queue[lng].unshift({
        name: groupname,
        cards: []
      });
    } else if (queue[lng][groupIndex].cards.includes(c => c.url === url)) {
      // if present, reprioritize card and its group
      queue[lng][groupIndex].cards.unshift(
        queue[lng][groupIndex].cards.splice(
          queue[lng][groupIndex].cards.findIndex(c => c.url === url),
          1
        )
      );
      queue[lng].unshift(
        queue[lng].splice(groupIndex, 1)
      );
      return;
    }
    // add card to (potentially new) group of (potentially new) lang
    queue[lng][groupIndex].cards.unshift({ url, pending: true, fields: [] });
    hasAddedToQueue = true;
  }

  // update storage.local accordingly
  hasAddedToQueue && lngs.sort() && browser.storage.local.set({ queue, lngs });
  reqs = [];
}

function setIconToPending() {
  browser.browserAction.setIcon({ path: './icons/48-pending.png' });
}
