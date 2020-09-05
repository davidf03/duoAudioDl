const pattern = 'https://*.cloudfront.net/astrid/*';
const files = [];

browser.webRequest.onBeforeRequest.addListener(
  downloadFile,
  {urls:[pattern]},
);

function downloadFile(requestDetails) {
  const url = requestDetails.url;

  let folder = requestDetails.originUrl.split('/')
  folder = folder[folder.length - 2];

  const name = url.split('astrid/')[1];
  let folderIndex = files.findIndex(f => f.folder === folder);

  if (folderIndex !== -1) {
    if (files[folderIndex].files.includes(name)) {
      return;
    }
    folderIndex = files.length;
    files.push({
      folder,
      files: []
    });
  }
  files[folderIndex].files.push(name);

  let downloading = browser.downloads.download({
    url: url,
    filename: `duoAudioDlFiles/${folder}/${name}.mp3`,
  }).catch(() => {
    files.splice(files.indexOf(name), 1);
  });

  console.log(files);
}
