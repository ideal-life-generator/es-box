import { resolve } from 'path'
import { DefinePlugin } from 'webpack'
import webpackNodeExternals from 'webpack-node-externals'
import UglifyJSPlugin from 'uglifyjs-webpack-plugin'

export const { env: { PRODUCTION, SERVER } } = process

export const mode = PRODUCTION ? 'production' : 'development'

export const outputPath = resolve('build')

export const eslintRule = {
  test: /\.js$/,
  enforce: 'pre',
  exclude: /node_modules/,
  loader: 'eslint-loader',
  options: {
    quiet: true
  }
}

export const htmlRule = {
  test: /\.html$/,
  exclude: /node_modules/,
  use: 'html-loader'
}

export const babelRule = {
  test: /\.js$/,
  exclude: /node_modules/,
  use: 'babel-loader'
}

export const vueRule = {
  test: /\.vue$/,
  exclude: /node_modules/,
  use: 'vue-loader'
}

export const sassRule = {
  test: /\.sass$/,
  exclude: /node_modules/,
  use: [
    {
      loader: 'style-loader'
    },
    {
      loader: 'css-loader'
    },
    {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        data: '@import "styles/variables";',
        includePaths: [resolve('interface')]
      }
    }
  ]
}

export const fileRule = {
  test: /\.(svg|png|jpg)$/,
  exclude: /node_modules/,
  use: 'file-loader'
}

export const stats = {
  modules: false
}

export const uglify = new UglifyJSPlugin()

export const nodeExternals = webpackNodeExternals()

export const definePlugin = new DefinePlugin({
  PRODUCTION: `${PRODUCTION}`,
  SERVER: `${SERVER}`,
  'process.env': {
    NODE_ENV: `"${PRODUCTION ? 'production' : 'development'}"`
  }
})
