import { resolve } from 'path'
import { DefinePlugin } from 'webpack' // eslint-disable-line import/no-extraneous-dependencies
import webpackNodeExternals from 'webpack-node-externals' // eslint-disable-line import/no-extraneous-dependencies
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

export const { env: { PRODUCTION, SERVER } } = process

export const outputPath = resolve('build')

export const eslintRule = {
  test: /\.js$/,
  enforce: 'pre',
  exclude: /node_modules/,
  loader: 'eslint-loader',
  options: {
    quiet: true,
  },
}

export const babelRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: 'babel-loader',
}

export const vueRule = {
  test: /\.vue$/,
  exclude: /node_modules/,
  use: 'vue-loader',
}

export const sassRule = {
  test: /\.sass$/,
  exclude: /node_modules/,
  use: ['style-loader', 'css-loader', 'sass-loader'],
}

export const fileRule = {
  test: /\.(png|jpg)$/,
  exclude: /node_modules/,
  use: 'file-loader',
}

export const stats = {
  modules: false,
}

export const uglify = new UglifyJSPlugin()

export const nodeExternals = webpackNodeExternals()

export const definePlugin = new DefinePlugin({
  PRODUCTION,
  SERVER,
  'process.env': {
    NODE_ENV: `"${PRODUCTION ? 'production' : 'development'}"`,
  },
})
