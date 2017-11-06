import { resolve } from 'path'
import {
  DefinePlugin,
} from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const { stringify } = JSON

export const { env: { NODE_ENV } } = process

export const clientContext = resolve('client')

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

export const fileLoader = {
  test: /\.(png|jpg|otf|eot|woff|ttf|svg)$/,
  exclude: /node_modules/,
  use: 'file-loader',
}

export const reactHotLoaderRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: ['react-hot-loader/webpack'],
}

export const definePlugin = new DefinePlugin({
  process: {
    env: {
      NODE_ENV: stringify(NODE_ENV),
    },
  },
})

export const htmlWebpackPlugin = new HtmlWebpackPlugin({
  title: 'Starter',
  template: './index.html',
})
