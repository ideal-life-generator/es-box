import { resolve } from 'path'
import { HotModuleReplacementPlugin } from 'webpack' // eslint-disable-line import/no-extraneous-dependencies
import merge from 'webpack-merge' // eslint-disable-line import/no-extraneous-dependencies
import CopyWebpackPlugin from 'copy-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies
import {
  isProduction,
  eslintRule,
  babelRule,
  vueRule,
  definePlugin,
  cleanWebpackPlugin,
} from './base'
import { clientDevServerPort } from '../config'

const config = {
  target: 'web',
  context: resolve('client'),
  entry: './index',
  output: {
    path: resolve('build/static'),
    filename: 'client.js',
    sourceMapFilename: 'client.js.map',
  },
  module: {
    rules: [
      eslintRule,
      babelRule,
      vueRule,
      {
        test: /\.(png|jpg|otf|eot|woff|ttf|svg)$/,
        exclude: /node_modules/,
        use: 'file-loader',
      },
    ],
  },
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
    },
  },
  plugins: [
    definePlugin,
    cleanWebpackPlugin,
  ],
}

export default !isProduction ? merge(config, {
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: clientDevServerPort,
    hot: true,
    inline: true,
    historyApiFallback: true,
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new CopyWebpackPlugin(['./static/index.html']),
  ],
}) : merge(config, {
  devtool: 'source-map',
  plugins: [],
})
