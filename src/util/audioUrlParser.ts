export default {
  getId: (url:string): string => {
    const parts = url.split('/').reverse();
    return `${parts[1]}-${parts[0]}`;
  },
  getTTSName: (url:string): string => url.split('/').reverse()[1]
};
