import { smart } from 'webpack-merge'
import nodeExternals from 'webpack-node-externals'
import ReloadServerPlugin from 'reload-server-webpack-plugin'
import {
  NODE_ENV,
  outputPath,
  eslintRule,
  babelRule,
  definePlugin,
} from './base'

const config = {
  target: 'node',
  entry: './index',
  output: {
    path: outputPath,
    filename: 'app.js',
    sourceMapFilename: 'app.js.map',
  },
  module: {
    rules: [
      eslintRule,
      babelRule,
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    definePlugin,
  ],
}

export default (() => (NODE_ENV !== 'production' ? smart(config, {
  plugins: [
    new ReloadServerPlugin({
      script: 'build/app.js',
    }),
  ],
}) : smart(config, {
  plugins: [],
})))()
