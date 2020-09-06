const pattern = 'https://*.cloudfront.net/astrid/*';
let duoAudioDl;

browser.webRequest.onBeforeRequest.addListener(
  addFileToQueue,
  { urls: [pattern] },
);

async function addFileToQueue(req) {
  duoAudioDl || await browser.storage.local.get('duoAudioDl').then(res => duoAudioDl = res.duoAudioDl ?? {});

  duoAudioDl.cardQueue ??= [];

  const url = req.url;
  let skill;
  await browser.tabs.get(req.tabId).then(res => skill = res.url.split('/').reverse()[1]);
  // let skill = req.originUrl.split('/')
  // skill = skill[skill.length - 2];

  let skillIndex = duoAudioDl.cardQueue.findIndex(f => f.skill === skill);
  if (skillIndex !== -1) {
    if (duoAudioDl.cardQueue[skillIndex].cards.includes(c => c.url === url)) {
      return;
    }
  } else {
    skillIndex = duoAudioDl.cardQueue.length;
    duoAudioDl.cardQueue.push({
      skill,
      cards: []
    });
  }
  duoAudioDl.cardQueue[skillIndex].cards.push({ url, pending: true });
  console.log(duoAudioDl);

  await browser.storage.local.set({ duoAudioDl });
}
