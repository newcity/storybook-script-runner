const path = require('path');
const { ProvidePlugin } = require('webpack');

module.exports = {
  core: {
    builder: 'webpack5',
  },

  // use CSF 3.0
  features: {
    storyStoreV7: true,
  },

  framework: '@storybook/html',

  stories: [
    path.resolve(__dirname, '..', 'components/**/*.stories.@(js|ts)'),
  ],

  staticDirs: [path.resolve(__dirname, '..', 'static')],

  addons: [
    {
      name: '@storybook/addon-postcss',
      options: {
        postcssLoaderOptions: {
          implementation: require('postcss'),
        },
      },
    },
    {
      name: '@storybook/addon-essentials',
      options: {
        actions: false, // not using this
      },
    },
    '@storybook/addon-a11y',
  ],

  typescript: {
    check: true,
  },

  webpackFinal: async (config) => {
    // enable top-level await (requires Webpack 5; see the top of this file)
    config.experiments = {
      ...(config.experiments ? config.experiments : {}),
      topLevelAwait: true,
    };

    // polyfill `Buffer` to make twing-loader compatible with Webpack 5; see https://viglucci.io/how-to-polyfill-buffer-with-webpack-5
    config.plugins.push(new ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }));
    config.resolve = {
      ...(config.resolve ? config.resolve : {}),
      fallback: {
        ...(config.resolve?.fallback ? config.resolve.fallback : {}),
        buffer: require.resolve('buffer/'),
      },
    };

    config.module.rules.push({
      test: /\.twig/,
      use: [
        {
          loader: 'twing-loader',
          options: {
            environmentModulePath: path.resolve(
              __dirname,
              'twing-environment.js'
            ),
          },
        },
        {
          loader: path.resolve(
            __dirname,
            'inject-relative-path-html-comments-loader.js'
          ),
        },
      ],
      include: path.resolve(__dirname, '..', 'components'),
    });

    return config;
  },
};
