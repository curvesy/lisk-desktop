const { resolve } = require('path');
const webpack = require('webpack'); // eslint-disable-line

// eslint-disable-next-line import/no-extraneous-dependencies
const { ProvidePlugin } = require('webpack');

module.exports = {
  mode: 'development',
  resolve: {
    fallback: {
      net: false,
      fs: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      path: require.resolve('path-browserify'),
    },
  },
  externals: {
    'node-hid': 'commonjs node-hid',
    usb: 'commonjs usb',
    bufferutil: 'bufferutil',
    'utf-8-validate': 'utf-8-validate',
    express: 'express',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        resolve: {
          alias: {
            Utils: resolve(__dirname, '../src/utils/api/'),
          },
          extensions: ['.js'],
        },
        options: {
          presets: [
            [
              '@babel/preset-env', {
                modules: false,
                targets: {
                  browsers: ['last 2 versions', 'safari >= 7'],
                },
              }],
            '@babel/preset-react',
          ],
          plugins: [
            'syntax-trailing-function-commas',
            'import-glob',
            [
              '@babel/plugin-transform-runtime',
              {
                helpers: false,
                regenerator: true,
              },
            ],
          ],
          env: {
            test: {
              plugins: ['istanbul'],
            },
          },
        },
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
        exclude: [/images/],
        options: {
          name: '[path][name]-[hash:6].[ext]',
        },
        loader: 'file-loader',
      },
      {
        test: /\.(png|svg)$/,
        exclude: [/fonts/],
        loader: 'url-loader',
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      // minSize: 30000,
      // maxSize: 0,
      // minChunks: 1,
      // maxAsyncRequests: 5,
      // maxInitialRequests: 3,
      // automaticNameDelimiter: '~',
      // name: false,
      // cacheGroups: {
      //   defaultVendors: {
      //     name: 'vendor',
      //     test: /[\\/]node_modules[\\/]/,
      //   },
      //   head: {
      //     name: 'head',
      //     priority: 1,
      //     test: /styles\.head\.css$/,
      //   },
      //   styles: {
      //     name: 'styles',
      //     priority: 2,
      //     test: /^((?!styles\.head).)*\.css$/,
      //   },
      //   default: {
      //     minChunks: 2,
      //     priority: -20,
      //     reuseExistingChunk: true,
      //   },
      // },
    },
  },
  plugins: [
    new ProvidePlugin({
      process: 'process/browser.js',
      Buffer: ['buffer', 'Buffer'],
    }),
    new webpack.EnvironmentPlugin({
      NACL_FAST: 'disable',
    }),
  ],
};
