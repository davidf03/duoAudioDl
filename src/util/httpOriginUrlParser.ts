export default {
  getLng: url => url.split('/').reverse()[2],
  getGroup: url => url.split('/').reverse()[1]
};
