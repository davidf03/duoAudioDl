export default {
  getId: (url) => url.split('/').reverse()[0],
  getTTSName: (url) => url.split('/').reverse()[1]
};
