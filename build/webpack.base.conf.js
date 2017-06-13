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

module.exports = {//webpack项目配置文件出口
  entry: {
    app: './src/main.js'//默认单页时的入口文件,在多页面下无作为
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],//忽略后缀
    alias: {//自定义路径
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
      '@static':resolve('static')
    }
  },
  module: {
    rules: [{
      test: /\.vue$/,
      loader: 'vue-loader',//.vue文件的处理
      options: vueLoaderConfig
    }, {
      test: /\.jsx?$/,
      loader: 'babel-loader',//babel转换，配置文件在根目录的.babelrc
      include: [resolve('src'), resolve('test')]
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url-loader',//转base64
      options: {
        limit: 10000,
        name: utils.assetsPath('img/[name].[hash:7].[ext]')
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',//转base64
      options: {
        limit: 10000,
        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
      }
    },{
    	test:/\.html$/,
    	loader:'html-loader'//html文件解析src和require(.html)
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

//webpack项目配置文件出口的补充
if (config.multiplePage.isMultiple) {//是否启动多页面模式
  module.exports.entry = utils.getEntries(config.multiplePage.entryPath)
}

if (config.multiplePage.isES3){//ie8兼容保留字插件
	module.exports.plugins.push(new es3ifyWebpackPlugin())
}
