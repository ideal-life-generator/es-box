import { resolve } from 'path'
import { // eslint-disable-line import/no-extraneous-dependencies
  HotModuleReplacementPlugin,
  optimize,
} from 'webpack'
import merge from 'webpack-merge' // eslint-disable-line import/no-extraneous-dependencies
import CopyWebpackPlugin from 'copy-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies
import VueSSRClientPlugin from 'vue-server-renderer/client-plugin' // eslint-disable-line import/no-extraneous-dependencies
import VueSSRServerPlugin from 'vue-server-renderer/server-plugin' // eslint-disable-line import/no-extraneous-dependencies
import HtmlWebpackPlugin from 'html-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies
import {
  PRODUCTION,
  outputPath,
  eslintRule,
  babelRule,
  vueRule,
  sassRule,
  fileRule,
  stats,
  nodeExternals,
  definePlugin,
} from './base'
import { DEV_SERVER_PORT } from '../config'

const serverEntry = {
  target: 'node',
  context: resolve('client'),
  entry: './entry-server',
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      eslintRule,
      babelRule,
      vueRule,
      sassRule,
      fileRule,
    ],
  },
  stats,
  externals: nodeExternals,
  plugins: [
    definePlugin,
    new VueSSRServerPlugin(),
  ],
}

const clientEntry = {
  context: resolve('client'),
  entry: './entry-client',
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      eslintRule,
      babelRule,
      vueRule,
      sassRule,
      fileRule,
    ],
  },
  stats,
  plugins: [
    definePlugin,
  ],
}

export default !PRODUCTION ? merge(clientEntry, {
  devtool: 'cheap-module-source-map',
  devServer: {
    port: DEV_SERVER_PORT,
    hot: true,
    inline: true,
    historyApiFallback: true,
    stats,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: '../index.template.dev.html',
    }),
    new HotModuleReplacementPlugin(),
  ],
}) : [serverEntry, merge(clientEntry, {
  plugins: [
    new optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new VueSSRClientPlugin(),
    new CopyWebpackPlugin(['../index.template.html']),
  ],
})]
