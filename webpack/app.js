import merge from 'webpack-merge' // eslint-disable-line import/no-extraneous-dependencies
import ReloadServerPlugin from 'reload-server-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies
import {
  PRODUCTION,
  outputPath,
  eslintRule,
  babelRule,
  vueRule,
  stats,
  nodeExternals,
  definePlugin,
} from './base'

const config = {
  target: 'node',
  entry: './index',
  output: {
    path: outputPath,
    filename: 'app.js',
  },
  module: {
    rules: [
      eslintRule,
      babelRule,
      vueRule,
    ],
  },
  stats,
  externals: nodeExternals,
  plugins: [
    definePlugin,
  ],
}

export default !PRODUCTION ? merge(config, {
  devtool: 'source-map',
  plugins: [
    new ReloadServerPlugin({
      script: 'build/app.js',
    }),
  ],
}) : merge(config, {
  plugins: [],
})
