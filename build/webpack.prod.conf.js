var path = require('path')//路径工具
var utils = require('./utils')//小方法
var webpack = require('webpack')//webpack
var config = require('../config')//项目配置文件
var merge = require('webpack-merge')//webpack的合并工具
var baseWebpackConfig = require('./webpack.base.conf')//项目基础webpack配置
var CopyWebpackPlugin = require('copy-webpack-plugin')//复制插件
var HtmlWebpackPlugin = require('html-webpack-plugin')//生成html插件
var ExtractTextPlugin = require('extract-text-webpack-plugin')//抽离css
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')//css重复数据删除

var env = config.build.env //获取判断当前环境

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
  devtool: config.build.productionSourceMap ? '#source-map' : false,//是否生成map文件
  output: {//出口文件配置
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')//未被列在entry中，却又需要被打包出来的文件命名配置
  },
  plugins: [//插件列表配置
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    //生产环境对vue中对那些warning和一些提示信息的代码进行了去除
    new webpack.DefinePlugin({
      'process.env': env//配置全局环境为生产环境
    }),
    //压缩 js (也可以压缩css,但是这里是用css-loader压缩)
    new webpack.optimize.UglifyJsPlugin({//是否兼容ie8的压缩模式
			compress: {
				warnings: false, //危险警告压缩,估计是取消报错
				properties: !config.multiplePage.isES3, //false,兼容ie8,a["foo"] → a.foo
			},
			output: {
				beautify: false, //这条本人测试发现可以取消,但是原兼容博主在博文中说道会 把引号被压缩掉
				quote_keys: config.multiplePage.isES3, //true,兼容ie8,应该是保留引用key
			},
			mangle:{
				screw_ie8: !config.multiplePage.isES3,//false,兼容ie8,取消兼容ie8
			},
			sourceMap: true,
			comments: config.multiplePage.isComments
    }),
    // 每一个用到了require("style.css")的entry chunks文件中抽离出css到单独的output文件
    new ExtractTextPlugin({//抽取css,并且使用上面utils生成的loader的参数(这个插件本身不进行压缩css,只是抽取合并,参数里带css-loader压缩)
      filename: utils.assetsPath('css/[name].[contenthash].css')
    }),
    // Compress extracted CSS. We are using this plugin so that possible.
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({//解决extract-text-webpack-plugin CSS重复问题，但是又一次压缩css(是以安全模式压缩)
      cssProcessorOptions: {
        safe: true//查找并修复CSS语法错误。
      }
    }),
    // 下面这些被我移动到webpack项目配置文件出口补充
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
    new webpack.optimize.CommonsChunkPlugin({//分离公共js到common中，不来自node_modules文件夹
      name: 'common',
      chunks:baseWebpackConfig.entry,
      minChunks:2
    }),
    // split vendor js into its own file
    new webpack.optimize.CommonsChunkPlugin({//分离公共js到vendor中，来自node_modules文件夹
      name: 'vendor',//这个有个BUG要使用两次才能生成
      minChunks: function (module, count) {
        // any required modules inside node_modules are extracted to vendor
        return (
          module.resource &&
          /\.js$/.test(module.resource) &&// 如果模块是一个路径，而且在路径中有 "somelib" 这个名字出现，
          module.resource.indexOf(
            path.join(__dirname, '../node_modules') // 声明公共的模块来自node_modules文件夹
          ) === 0// 而且它还被0个不同的 chunks/入口chunk 所使用，那请将它拆分到vendor
        )
      }
    }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    //上面虽然已经分离了第三方库,每次修改编译都会改变vendor的hash值，导致浏览器缓存失效。原因是vendor包含了webpack在打包过程中会产生一些运行时代码，运行时代码中实际上保存了打包后的文件名。当修改业务代码时,业务代码的js文件的hash值必然会改变。一旦改变必然会导致vendor变化。vendor变化会导致其hash值变化。
    //下面主要是将运行时代码提取到单独的manifest文件中，防止其影响vendor.js
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      chunks: ['vendor']      
    }),

    // copy custom static assets
    new CopyWebpackPlugin([// 复制静态资源,将static文件内的内容复制到指定文件夹
      {
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.productionGzip) { //配置文件开启了gzip压缩
  var CompressionWebpackPlugin = require('compression-webpack-plugin')//引入压缩文件的组件,该插件会对生成的文件进行压缩，生成一个.gz文件

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]', //目标文件名
      algorithm: 'gzip',//使用gzip压缩
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,//资源文件大于10240B=10kB时会被压缩
      minRatio: 0.8//最小压缩比达到0.8时才会被压缩
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig//webpack项目配置文件出口


if(config.multiplePage.isMultiple){//判断是否开启多页面模式
  var pages = utils.getEntries(config.multiplePage.htmlPath)
  for (var page in pages) {
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
//webpack项目配置文件出口补充
    module.exports.plugins.push(new HtmlWebpackPlugin(conf))//生成html文件
  }
}else{
  module.exports.plugins.push(new HtmlWebpackPlugin({//默认的vue-cli单页面出口
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
