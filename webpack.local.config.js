const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const path = require('path');

const baseConfig = require('./webpack.base.config');

const nodeModulesDir = path.resolve(__dirname, 'node_modules');

baseConfig.mode = 'development';

baseConfig.entry = [
  'react-hot-loader/patch',
  'whatwg-fetch',
  '@babel/polyfill',
  './frontend/js/index.js',
];

baseConfig.optimization = {
  moduleIds: 'named',
  splitChunks: {
    chunks: 'all',
  },
};

baseConfig.output = {
  path: path.resolve('./frontend/bundles/'),
  publicPath: 'http://localhost:3000/frontend/bundles/',
  filename: '[name].js',
};

baseConfig.module.rules.push(
  {
    test: /\.jsx?$/,
    exclude: [nodeModulesDir],
    loader: require.resolve('babel-loader'),
  },
  {
    test: /\.(woff(2)?|eot|ttf)(\?v=\d+\.\d+\.\d+)?$/,
    use: [
      {
          loader: 'url-loader',
          options: {
              limit: 100000,
          }
      }
    ],
  }
);

baseConfig.plugins = [
  new webpack.EvalSourceMapDevToolPlugin({
    exclude: /node_modules/
  }),
  new webpack.NoEmitOnErrorsPlugin(), // don't reload if there is an error
  new BundleTracker({
    filename: './webpack-stats.json',
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      context: __dirname,
      postcss: [autoprefixer],
    },
  }),
  new CircularDependencyPlugin({
    // exclude detection of files based on a RegExp
    exclude: /a\.js|node_modules/,
    // add errors to webpack instead of warnings
    failOnError: true,
    // set the current working directory for displaying module paths
    cwd: process.cwd(),
  }),
];

baseConfig.resolve.alias = {
  'react-dom': '@hot-loader/react-dom',
};

module.exports = baseConfig;
