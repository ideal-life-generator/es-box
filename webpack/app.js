import merge from 'webpack-merge' // eslint-disable-line import/no-extraneous-dependencies
import nodeExternals from 'webpack-node-externals' // eslint-disable-line import/no-extraneous-dependencies
import ReloadServerPlugin from 'reload-server-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies
import {
  isProduction,
  outputPath,
  eslintRule,
  babelRule,
  definePlugin,
  cleanWebpackPlugin,
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
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: 'html-loader',
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    definePlugin,
    cleanWebpackPlugin,
  ],
}

export default !isProduction ? merge(config, {
  plugins: [
    new ReloadServerPlugin({
      script: 'build/app.js',
    }),
  ],
}) : merge(config, {
  plugins: [],
})
