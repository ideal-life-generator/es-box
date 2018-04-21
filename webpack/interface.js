import { resolve } from 'path'
import { HotModuleReplacementPlugin } from 'webpack'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {
  PRODUCTION,
  mode,
  outputPath,
  eslintRule,
  htmlRule,
  babelRule,
  vueRule,
  sassRule,
  fileRule,
  stats,
  definePlugin,
  uglify
} from './base'
import { DEV_SERVER_PORT } from '../config'

const interf = {
  context: resolve('interface'),
  entry: './',
  output: {
    path: outputPath,
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      // eslintRule,
      htmlRule,
      babelRule,
      vueRule,
      sassRule,
      fileRule
    ]
  },
  stats,
  plugins: [
    definePlugin,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    })
  ],
  mode
}

export default merge(
  interf,
  !PRODUCTION
    ? {
        devtool: 'cheap-module-source-map',
        devServer: {
          port: DEV_SERVER_PORT,
          hot: true,
          inline: true,
          historyApiFallback: true,
          stats
        },
        plugins: [new HotModuleReplacementPlugin()]
      }
    : {
        plugins: [uglify]
      }
)
