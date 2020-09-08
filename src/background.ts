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
  const { lngs = [], history = {}, queue = {} } = await browser.storage.local.get(['lngs','history','queue']);

  let hasAddedToQueue = false;

  for (const req of reqs) {
    const url = req.url;

    const originUrl = await browser.tabs.get(req.tabId).then(res => res.url.split('/').reverse());
    const lng = originUrl[2];

    if (history[lng]?.includes(url)) {
      return;
    }

    // if lang absent from queue, create group array and, if lang absent from lngs, add it
    if (!queue[lng]) {
      queue[lng] = [];
      lngs.indexOf(lng) === -1 && lngs.push(lng);
    }

    const groupname = originUrl[1]
    //find index of group within lang
    let groupIndex = queue[lng].findIndex(g => g.name === groupname);
    // console.log(groupIndex);
    // console.log(queue[lng].filter(g => g.name === groupname));
    if (groupIndex === -1) {
      console.log('pushing new group entry')
      // if absent, add new group
      groupIndex = queue[lng].length;
      queue[lng].unshift({
        name: groupname,
        cards: []
      });
    } else if (queue[lng][groupIndex].cards.includes(c => c.url === url)) {
      // if present, reprioritize card and its group
      const card = queue[lng][groupIndex].cards.splice(
        queue[lng][groupIndex].cards.findIndex(c => c.url === url), 1
      );
      queue[lng][groupIndex].cards.unshift(card);
      const group = queue[lng].splice(groupIndex, 1);
      queue[lng].unshift(group);
      return;
    }
    // add card to (potentially new) group of (potentially new) lang
    queue[lng][groupIndex].cards.unshift({ url, pending: true, fields: [] });
    hasAddedToQueue = true;
  }

  // update storage.local accordingly
  hasAddedToQueue && lngs.sort() && browser.storage.local.set({ queue, lngs });
  // console.log(queue);
  reqs = [];
}

function setIconToPending() {
  browser.browserAction.setIcon({ path: './icons/48-pending.png' });
}
