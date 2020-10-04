const sveltePreprocess = require('svelte-preprocess');
const path = require('path');

const scssConfigPath = path.resolve(process.cwd(), 'src/scss/config.scss').replace(/\\/g, '/');

module.exports = {
  preprocess: sveltePreprocess({
    defaults: {
      markup: 'html',
      script: 'typescript',
      style: 'scss'
    },
    scss: {
      prependData: `@import '${scssConfigPath}';`
    }
  }),
};
