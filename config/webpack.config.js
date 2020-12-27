/* eslint-disable linebreak-style */

const path = require('path');
const nodeExternals = require('webpack-node-externals')

//const WebpackBuildLogPlugin = require("webpack-build-log-plugin");

const ROOT_DIRECTORY = path.join(__dirname, '..');
const SRC_DIRECTORY = path.join(ROOT_DIRECTORY, 'src');

const config = {
  name: 'server',
  target: 'node',
  entry: [
    path.join(SRC_DIRECTORY, 'app.js'),
  ],
  output: {
    path: path.join(ROOT_DIRECTORY, 'dst'),
    filename: 'server.js',
  },

  mode: 'development',
  plugins: [

  ],
  node: {
    // Need this when working with express, otherwise the build fails
    __dirname: false,   // if you don't put this is, __dirname
    __filename: false,  // and __filename return blank or /
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          SRC_DIRECTORY,
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  optimization: {
    minimize: false,
  },
};

module.exports = config;
