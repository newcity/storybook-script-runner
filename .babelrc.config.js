/*
  File is called `.babelrc.config.js` instead of `.babelrc.js` so that Storybook
  doesn't try to use it. This also means that the Babel CLI won't use it automatically,
  so we have to specify it with the `--config-file` option.
*/

module.exports = (api) => {
  const isProduction = api.env('production');

  const presets = [
    ...(isProduction ? ['minify'] : ''),
    '@babel/preset-typescript',
  ];

  const plugins = [
    'transform-remove-export',
    'iife-wrap',
  ];

  return {
    presets,
    plugins,
    comments: false,
  };
};
