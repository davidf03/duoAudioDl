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
  const { history = [], queue = [] } = await browser.storage.local.get(['history','queue']);

  let hasAddedToQueue = false;

  for (const req of reqs) {
    const url = req.url;
    if (history.includes(url)) {
      return;
    }
    const skill = await browser.tabs.get(req.tabId).then(res => res.url.split('/').reverse()[1]);
    let index = queue.findIndex(f => f.skill === skill);
    if (index === -1) {
      index = queue.length;
      queue.push({
        skill,
        cards: []
      });
    } else if (queue[index].cards.includes(c => c.url === url)) {
      return;
    }
    queue[index].cards.push({ url, pending: true, fields: [] });
    hasAddedToQueue = true;
  }

  hasAddedToQueue && browser.storage.local.set({ queue });
  reqs = [];
}

function setIconToPending() {
  browser.browserAction.setIcon({ path: './icons/48-pending.png' });
}
