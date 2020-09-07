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
  await browser.storage.local.get(['history','queue']).then(res => {
    const { history = [], queue = [] } = res;
    handler(history, queue);
  });

  async function handler(history, queue) {
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
    }

    await browser.storage.local.set({ history, queue });
    reqs = [];
    if (queue.length) {
      setIconToPending();
    }
    console.log(history, queue);
  }
}

function setIconToPending() {
  browser.browserAction.setIcon({ path: './icons/48-pending.png' });
}
