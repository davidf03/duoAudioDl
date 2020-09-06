const pattern = 'https://*.cloudfront.net/astrid/*';
let duoAudioDl;

browser.webRequest.onBeforeRequest.addListener(
  addFileToQueue,
  { urls: [pattern] },
);

async function addFileToQueue(req) {
  duoAudioDl || await browser.storage.local.get('duoAudioDl').then(res => ({ duoAudioDl } = res));

  duoAudioDl.audioCardQueue = duoAudioDl.audioCardQueue || [];

  const url = req.url;
  let skill;
  await browser.tabs.get(req.tabId).then(res => skill = res.url.split('/').reverse()[1]);
  // let skill = req.originUrl.split('/')
  // skill = skill[skill.length - 2];

  let skillIndex = duoAudioDl.audioCardQueue.findIndex(f => f.skill === skill);
  if (skillIndex !== -1) {
    if (duoAudioDl.audioCardQueue[skillIndex].urls.includes(url)) {
      return;
    }
  } else {
    skillIndex = duoAudioDl.audioCardQueue.length;
    duoAudioDl.audioCardQueue.push({
      skill,
      urls: []
    });
  }
  duoAudioDl.audioCardQueue[skillIndex].urls.push(url);
  console.log(duoAudioDl);

  await browser.storage.local.set({ duoAudioDl });
}
