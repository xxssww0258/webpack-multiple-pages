var path = require('path')
var glob = require('glob')
var config = require('../config')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

exports.assetsPath = function (_path) {
  var assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {//options是loader的选项配置
  options = options || {}

  var cssLoader = {//默认添加的loader
    loader: 'css-loader',//压缩css代码
    options: {
      //当为生产环境则选择第二个自定义参数 去除注释(也支持前缀补全但是不会设置)
      minimize: process.env.NODE_ENV === 'production' && {discardComments:{removeAll: config.multiplePage.isComments}}, //生成环境下压缩文件
      sourceMap: options.sourceMap,//根据参数是否生成sourceMap文件
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {//生成loader
    var loaders = [cssLoader] // 默认是css-loader
    if (loader) {// 如果有参数，则插入[参数1-loader]和[options:{参数2}],但只能插入1个
      loaders.push({//这里的loader是给ExtractTextPlugin.extract(use:)注入的必须的loader--默认注入本身如less注入less-loader
        loader: loader + '-loader',//loader:css-loader
        options: Object.assign({}, loaderOptions, {//将loaderOptions和sourceMap组成一个对象
          sourceMap: options.sourceMap
        })
      });
    }

    if(options.isRules){//如果是从webpack.prod.conf调用的话
    //自定义全部(css,less,sass,stylus,postcss)注入postcss-loader补全前缀
      loaders.push({
        loader: 'postcss-loader',
        options:{ plugins: (loader) => [ require('autoprefixer')()]}
      });
    }

    // 在指定选项时提取CSS
    // 如果是生成环境的话
    if (options.extract) { 
      return ExtractTextPlugin.extract({//ExtractTextPlugin分离js中引入的css文件
        use: loaders,//处理的loader
        fallback: 'vue-style-loader' //没有被提取分离时使用的loader
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return { //返回css类型对应的loader组成的对象 generateLoaders()来生成loader
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),///\.less$/,添加less-loader
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }

  // return 了类似这些
  // css:[{
  //   loader: 'E:\\我的文档\\HBuilderProjects\\moren\\multiple-page\\node_modules\\_extract-text-webpack-plugin@2.1.0@extract-text-webpack-plugin\\loader.js',
  //   options: {omit: 1,remove: true}
  // }, {
  //   loader: 'vue-style-loader'
  // }, {
  //   loader: 'css-loader',
  //   options: {minimize: true,sourceMap: false}
  // }]


}

// 生成独立rules[loader] (除了.vue,.vue是返回上面的)
exports.styleLoaders = function (options) {//options是判断生成环境和压缩的参数
  var output = []//新建一个数组
  var loaders = exports.cssLoaders(options)//把cssLoaders()return的东西继续处理
  for (var extension in loaders) {//遍历
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),//拼接上test:/.css$/
      use: loader                               //拼接上use:[loader]
    })
  }
  return output                                 //返回给rules
}

//多页面用的处理，传入路径，返回入口文件对象e.g{app:./build/app.js}
exports.getEntries = function(globPath) {
  var entries = {}
    //同步获取文件列表，返回数组遍历
  glob.sync(globPath).forEach(function(entry) {
    // entry是匹配到的路径(包括本身)
    var extname = path.extname(entry) //获取后缀
    var basename = path.basename(entry, path.extname(entry), 'router.js') // 获取前缀(过滤后缀)，且过滤router.js

    var tmp = entry.split('/').splice(-3) //只获取最后3个路径
    var moduleName = tmp.slice(1, 2); //获取[1,2)也就是中间那个的路径
    entries[moduleName] = entry //得到{app:./build/app}
  })
  return entries
}
