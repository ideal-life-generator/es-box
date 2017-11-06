import { HotModuleReplacementPlugin } from 'webpack'
import { smart, smartStrategy } from 'webpack-merge'
import {
  NODE_ENV,
  clientContext,
  outputPath,
  eslintRule,
  babelRule,
  fileLoader,
  reactHotLoaderRule,
  definePlugin,
  htmlWebpackPlugin,
} from './base'
import { clientDevServerPort } from '../config'

const config = {
  target: 'web',
  context: clientContext,
  entry: [
    './index',
  ],
  output: {
    path: outputPath,
    filename: 'client.js',
    sourceMapFilename: 'client.js.map',
  },
  module: {
    rules: [
      eslintRule,
      reactHotLoaderRule,
      babelRule,
      fileLoader,
    ],
  },
  plugins: [
    definePlugin,
  ],
}

export default (() => (NODE_ENV !== 'production' ? smartStrategy({
  entry: 'prepend',
})(config, {
  entry: [
    'babel-polyfill',
    'react-hot-loader/patch',
  ],
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    port: clientDevServerPort,
    hot: true,
    historyApiFallback: true,
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    htmlWebpackPlugin,
  ],
}) : smart(config, {
  plugins: [
    htmlWebpackPlugin,
  ],
})))()
