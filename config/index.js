// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')//路径工具

module.exports = {
  build: {
    env: require('./prod.env'),//当前是生产环境
    index: path.resolve(__dirname, '../dist/index.html'),//生成的模板html路径
    assetsRoot: path.resolve(__dirname, '../dist'),//生产位置
    assetsSubDirectory: 'static',//静态文件位置
    assetsPublicPath: './',//相对位置
    productionSourceMap: false,//是否生成map
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,//是否压缩
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),//当前环境是开发环境
    port: 8080,//服务器端口号
    autoOpenBrowser: true,//自动打开浏览器
    assetsSubDirectory: 'static',//静态文件位置
    assetsPublicPath: '/',//
    proxyTable: {},//代理设置http://www.jianshu.com/p/95b2caf7e0da  https://vuejs-templates.github.io/webpack/proxy.html
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: true//是否生成map
  },
  multiplePage:{
    isMultiple:true,//是否使用多页面模式(否的话为默认vue-cli的模式)
    isAutoEntry:true,//是否自动导入 公共JS和入口文件JS
    isComments:false,//是否不删除JS和css注释
    isES3:true,//是否兼容ie8,还需手动require(es5-shim,es-sham,babel-polyfill,console-polyfill)
    dateUrl:{'img':['src','data-src']},//.vue-loader解析date-src的路径 img是标签，解析img中src和data-src
    entryPath:path.resolve(__dirname, '../src/module/**/index.js'),//多页面的入口文件位置,要求入口文件和html同名为index
    htmlPath:path.resolve(__dirname, '../src/module/**/index.html')//多页面的模板文件位置,要求入口文件和html同名为index
  }
}
