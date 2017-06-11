var path = require('path')//node的路径工具
var utils = require('./utils')//vue-cli的小方法
var webpack = require('webpack')//webpack
var config = require('../config')//项目总配置文件
var vueLoaderConfig = require('./vue-loader.conf')//vue-loader的配置文件
var es3ifyWebpackPlugin=require('es3ify-webpack-plugin');//ie8兼容保留字插件


vueLoaderConfig.transformToRequire=config.multiplePage.dateUrl;//.vue-loader添加解析src,data-src加载路径
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@static':resolve('static')
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',
      options: vueLoaderConfig
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      include: [resolve('src'), resolve('test')]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    },{
    	test:/\.html$/,
    	loader:'html-loader'
    }]
  },
     plugins: [
       new webpack.ProvidePlugin({//全局变量插件
//当webpack加载到某个js模块里，出现了未定义且名称符合（字符串完全匹配）配置中key的变量时，会自动require配置中value所指定的js模块。
//不能为node_modules里的js注入
         $: 'jquery',
         jQuery:'jquery',
         'window.jQuery':'jquery',
         'window.$': 'jquery',
       }),
       new es3ifyWebpackPlugin(),//ie8兼容插件
     ],
  // externals: {
  //     mui: "@/lib/mui/mui.js"
  // },
}

if (config.multiplePage.isMultiple) {
  module.exports.entry = utils.getEntries(config.multiplePage.entryPath)
}

    