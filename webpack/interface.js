import { resolve } from 'path'
import { HotModuleReplacementPlugin } from 'webpack' // eslint-disable-line import/no-extraneous-dependencies
import merge from 'webpack-merge' // eslint-disable-line import/no-extraneous-dependencies
import HtmlWebpackPlugin from 'html-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies
import {
  PRODUCTION,
  outputPath,
  eslintRule,
  babelRule,
  sassRule,
  fileRule,
  alias,
  stats,
  definePlugin,
} from './base'
import { DEV_SERVER_PORT } from '../config'

const interf = {
  context: resolve('interface'),
  entry: './',
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
  },
  module: {
    rules: [
      // eslintRule,
      babelRule,
      sassRule,
      fileRule,
    ],
  },
  resolve: {
    alias: { core: alias.core },
  },
  stats,
  plugins: [
    definePlugin,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
    }),
  ],
}

export default merge(interf, !PRODUCTION ? {
  devtool: 'cheap-module-source-map',
  devServer: {
    port: DEV_SERVER_PORT,
    hot: true,
    inline: true,
    historyApiFallback: true,
    stats,
  },
  plugins: [
    new HotModuleReplacementPlugin(),
  ],
} : {})
