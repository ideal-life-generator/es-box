import { BannerPlugin } from 'webpack'
import merge from 'webpack-merge'
import ReloadServerPlugin from 'reload-server-webpack-plugin'
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

const graphql = {
  target: 'node',
  entry: './index',
  output: {
    path: outputPath,
    filename: 'graphql.js',
  },
  module: {
    rules: [
      // eslintRule,
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

export default !PRODUCTION ? merge(graphql, {
  devtool: 'inline-source-map',
  plugins: [
    new BannerPlugin({
      raw: true,
      banner: 'import "source-map-support/register"',
    }),
    new ReloadServerPlugin({
      script: 'build/graphql.js',
    }),
  ],
}) : merge(graphql, {
  plugins: [],
})
