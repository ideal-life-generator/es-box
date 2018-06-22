import { resolve } from 'path'
import { HotModuleReplacementPlugin } from 'webpack'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import {
  PRODUCTION,
  mode,
  outputPath,
  eslintRule,
  htmlRule,
  babelRule,
  vueRule,
  sassRule,
  fileRule,
  stats,
  definePlugin,
  uglify
} from './base'
import { DEV_SERVER_PORT } from '../config'
import VueLoaderPlugin from 'vue-loader/lib/plugin'

const interf = {
  context: resolve('interface'),
  entry: './',
  output: {
    path: outputPath,
    filename: '[name].[hash].js',
    publicPath: '/'
  },
  module: {
    rules: [
      // eslintRule,
      htmlRule,
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.sass$/,
        exclude: /node_modules/,
        use: [
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              indentedSyntax: true
            }
          }
        ]
      },
      vueRule,
      fileRule
    ]
  },
  stats,
  plugins: [
    definePlugin,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    new VueLoaderPlugin()
  ],
  mode
}

export default merge(
  interf,
  !PRODUCTION
    ? {
        devtool: 'cheap-module-source-map',
        devServer: {
          port: DEV_SERVER_PORT,
          hot: true,
          inline: true,
          historyApiFallback: true,
          stats
        },
        plugins: [new HotModuleReplacementPlugin()]
      }
    : {
        plugins: [uglify]
      }
)
