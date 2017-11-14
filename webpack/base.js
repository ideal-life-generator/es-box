import { resolve } from 'path'
import { DefinePlugin } from 'webpack' // eslint-disable-line import/no-extraneous-dependencies
import CleanWebpackPlugin from 'clean-webpack-plugin' // eslint-disable-line import/no-extraneous-dependencies

const { env: { NODE_ENV } } = process

export const isProduction = NODE_ENV === 'production'

export const outputPath = resolve('build')

export const eslintRule = {
  test: /\.js$/,
  enforce: 'pre',
  exclude: /node_modules/,
  use: 'eslint-loader',
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

export const definePlugin = new DefinePlugin({
  PRODUCTION: isProduction,
  'process.env': {
    NODE_ENV: `"${NODE_ENV}"`,
  },
})

export const cleanWebpackPlugin = new CleanWebpackPlugin(['build'], { root: resolve() })
