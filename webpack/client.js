import { resolve } from 'path'
import { // eslint-disable-line import/no-extraneous-dependencies
  HotModuleReplacementPlugin,
  optimize,
} from 'webpack'
import merge from 'webpack-merge' // eslint-disable-line import/no-extraneous-dependencies
import CopyWebpackPlugin from 'copy-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies
import HtmlWebpackPlugin from 'html-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies
import {
  PRODUCTION,
  outputPath,
  eslintRule,
  sassRule,
  fileRule,
  stats,
  definePlugin,
} from './base'
import { DEV_SERVER_PORT } from '../config'

const clientEntry = {
  context: resolve('client'),
  entry: './',
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      eslintRule,
      sassRule,
      fileRule,
    ],
  },
  resolve: {
    alias: {
      core: resolve('./client/core'),
    },
  },
  stats,
  plugins: [
    definePlugin,
  ],
}

export default merge(clientEntry, !PRODUCTION ? {
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
      template: './index.html',
    }),
    new HotModuleReplacementPlugin(),
  ],
} : {
  plugins: [
    new optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
    new CopyWebpackPlugin(['../index.template.html']),
  ],
})
