var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
// var SpritesmithPlugin = require('webpack-spritesmith')//合成雪碧图

var env = config.build.env

var webpackConfig = merge(baseWebpackConfig, {
  module: {//生成独立的loader e.g(css-loader=/css$/)
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      isRules: true //自定义参数，告诉utils是从这里调用的
    })
  },
    // e.g
    // [{
    //   loader: 'E:\\我的文档\\HBuilderProjects\\moren\\multiple-page\\node_modules\\_extract-text-webpack-plugin@2.1.0@extract-text-webpack-plugin\\loader.js',
    //   options: {
    //     omit: 1,
    //     remove: true
    //   }
    // }, {
    //   loader: 'vue-style-loader'
    // }, {
    //   loader: 'css-loader',
    //   options: {
    //     minimize: true,
    //     sourceMap: false
    //   }
    // }, {
    //   loader: 'less-loader',
    //   options: {
    //     minimize: true,
    //     sourceMap: false
    //   }
    // }]
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')//未被列在entry中，却又需要被打包出来的文件命名配置
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    //生产环境对vue中对那些warning和一些提示信息的代码进行了去除
    new webpack.DefinePlugin({
      'process.env': env
    }),
    //压缩 js (也可以压缩css,但是这里是用css-loader压缩)
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true,
      comments:config.multiplePage.isComments
    }),
    // 每一个用到了require("style.css")的entry chunks文件中抽离出css到单独的output文件
    new ExtractTextPlugin({//需要配合上面自动生成的loader的参数
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: config.build.index,
    //   template: 'index.html',
    //   inject: true,
    //   minify: {
    //     removeComments: true,
    //     collapseWhitespace: true,
    //     removeAttributeQuotes: true
    //     // more options:
    //     // https://github.com/kangax/html-minifier#options-quick-reference
    //   },
    //   // necessary to consistently work with multiple chunks via CommonsChunkPlugin
    //   chunksSortMode: 'dependency'
    // }),

    //把入口文件的内容出现2次以上的打包成common,这东西比较奇怪需要语序
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      chunks:baseWebpackConfig.entry,
      minChunks:2
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',//这个有个BUG要使用两次才能生成
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&// 如果模块是一个路径，而且在路径中有 "somelib" 这个名字出现，
          module.resource.indexOf(
            path.join(__dirname, '../node_modules')
          ) === 0// 而且它还被0个不同的 chunks/入口chunk 所使用，那请将它拆分到vendor
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']      
    }),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig


if(config.multiplePage.isMultiple){
  var pages = utils.getEntries(config.multiplePage.htmlPath)
  for (var page in pages) {
    // 配置合成雪碧图
    var sprit  = {
      src: {
        cwd: './src/img/',
        glob: '*.png'
      },
      target: {
        image: './dist/sprites/sprite.png',
        css: './dist/sprites/sprite.scss'
      },
      apiOptions: {
        cssImageRef: './sprite.png'
      },
      spritesmithOptions: {
        algorithm: 'top-down'
      }
    }
    // 配置生成的html文件，定义路径等
    var conf = {
      filename: page + '.html',
      template: pages[page], //模板路径
      inject: config.multiplePage.isAutoEntry,
      chunksSortMode: 'dependency',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      },
      chunks:['manifest','vendor','common',page],
      // excludeChunks: Object.keys(pages).filter(item => {
      //   return (item != page)
      // })
    }
    module.exports.plugins.push(new HtmlWebpackPlugin(conf))
    // module.exports.plugins.push(new SpritesmithPlugin(sprit))
  }
}else{
  module.exports.plugins.push(new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
          // more options:
          // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    })
  )
}
