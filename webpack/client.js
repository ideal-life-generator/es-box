import { smart } from 'webpack-merge'
import {
  NODE_ENV,
  clientContext,
  outputPath,
  eslintRule,
  babelRule,
  fileLoader,
  definePlugin,
  htmlWebpackPlugin,
} from './base'
import { clientDevServerPort } from '../config'

const config = {
  target: 'web',
  context: clientContext,
  entry: [
    // 'babel-polyfill',
    'react-hot-loader/patch',
    './index',
  ],
  output: {
    path: outputPath,
    filename: 'client.js',
    sourceMapFilename: 'client.js.map',
  },
  devtool: 'cheap-module-eval-source-map',
  module: {
    rules: [
      eslintRule,
      babelRule,
      fileLoader,
    ],
  },
  plugins: [
    definePlugin,
  ],
}

export default (() => (NODE_ENV !== 'production' ? smart(config, {
  devServer: {
    port: clientDevServerPort,
    // hot: true,
    // inline: true,
    historyApiFallback: true,
  },
  plugins: [
    htmlWebpackPlugin,
  ],
}) : smart(config, {
  plugins: [
    htmlWebpackPlugin,
  ],
})))()
