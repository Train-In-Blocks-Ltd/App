'use strict'
const utils = require('./utils')
const config = require('../config')
const { merge } = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin')
const {InjectManifest} = require('workbox-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name].js')
  },
  performance: {
    maxEntrypointSize: 2500000,
    maxAssetSize: 1500000
  },
  stats: {
    errorDetails: true
  },
  optimization: {
    minimize: false,
    minimizer: [
      // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
      // `...`,
      new CssMinimizerPlugin(),
    ],
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      maxInitialRequests: 30,
      minChunks: 2,
      minSize: 50000,
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](?!@okta[\\/]okta-vue)(.*?)[\\/]/,
          name(module) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](?!@okta[\\/]okta-vue)(.*?)([\\/]|$)/)[1]
            // npm package names are URL-safe, but some servers don't like @ symbols
            return `npm.${packageName.replace('@', '')}`
          }
        },
        oktaVue: {
          test: /[\\/]node_modules[\\/](@okta)[\\/](okta-vue)[\\/]/,
          name: 'oktaVue'
        }
      }
    }
  },
  plugins: [
    // extract css into its own file
    new ExtractTextPlugin({
      filename: utils.assetsPath('css/[name].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
    }),
    new PreloadWebpackPlugin({
      rel: 'preload',
      include: 'initial',
      fileBlacklist: [/\.svg/],
      as(entry) {
        if (/\.css$/.test(entry)) return 'style'
        return 'script'
      }
    }),
    new InjectManifest({
      swSrc: './src/traininblocks-sw.js',
      swDest: 'traininblocks-sw.js',
      exclude: [/\.map$/]
    })
  ]
})
if (process.env.REPORT) {
  process.traceDeprecation = true
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
