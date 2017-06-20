# webpack-multiple-pages
根据 vue-cli 修改的多页面，不一定vue才能用，其他框架也能用,IE8兼容处理

## 参考
*	<https://github.com/Aka-xXx/vue-multi-page/>
> 主要是在这个的基础上进行优化修改

> 只是使用了vue-router,没有添加单元测试和语法检测
 
## 使用
>基于vue-cli 修改的多页面项目

>选项在config/index.js

1. 在module/文件下创建新的文件夹,这些文件夹的名字就是,build后的html文件名
> 默认有个index文件夹

e.g.  在module/创建模块.e.g:module/index[这是模块名]/index.js[默认入口文件]

e.g.  在module/创建模块.e.g:module/index[这是模块名]/index.html[默认模版]

	npm run build
	npm run dev
	需要从https://github.com/xxssww0258/exports-loader.git覆盖node_modules里的exports-loader
## 介绍vue-cli npm run build做的事情

> 欢迎补充

*	识别.vue文件
*	babel转es5
*	img,js,css统一加上hash
*	小于10k图标或文字转base64(兼容性为ie8 32Kkb以下)
*	对.vue执行less,sass,postcss,stylus,autoprefixer等处理
*	css合并压缩,不压缩注释,提取公共样式
*	js合并压缩 ,不压缩注释，
*	js提取常用模块vendor,常用模块的hash证明manifest,和main.js
*	自动生成html模板,且自动导入vendor,manifest,main,css
*	复制static文件到dist

## 这个项目修改的大致内容

*	修改成多页面模式
*   兼容ie8处理(默认兼容)
*   默认统一babel转commonjs规范(自动import 转require解决webpack打包ie8下报错)

>	不做兼容可以去`.babelrc`删掉`transform-es2015-modules-commonjs`

*	修改babel-loader正则兼容jax语法为/\.jsx?$/
*	添加插件默认全局注入jquery
*	添加html-loader解析html图片路径
*	添加.vue解析data-src(默认只解析src)
*	取消build生产map
*	删除css压缩时的注释代码
*	删除js压缩时的注释代码
*	添加自动补前缀（原本只补.vue）
*	添加common.js存放公共 js(vendor.js是存放长期不修改的)
*	默认新增依赖`less-loader` `less` `sass-loader` `node-sass` `stylus` `postcss-loader` `html-loader` `autoprefixer` `imports-loader` `exports-loader` `expose-loader` `transform-es2015-modules-commonjs` `es5-shim` `console-polyfill` `babel-polyfill` `es3ify-webpack-plugin`
*	还有一堆我忘记了的修改。。。

### 兼容情况下
>  兼容情况下只能使用amd规范的require,无法使用 import 和 export,所以上面使用了babel转换规范为commonjs

*  默认引入 es3ify-webpack-plugin(es3保留字兼容,es3属性保留字兼容,default兼容)
*  需要手动给模板.html添加<pre><code>
	<!--[if lt IE 9]>
		<script src="https://cdn.bootcss.com/es5-shim/4.5.9/es5-shim.min.js"></script>//给es3环境添加es5 API
		<script src="https://cdn.bootcss.com/es5-shim/4.5.9/es5-sham.min.js"></script>//给es3环境添加es5 API2
		<script src="https://cdn.bootcss.com/html5shiv/3.7.3/html5shiv.min.js"></script>//识别标签
		<script src="https://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>//媒体查询
    <![endif]-->
</code></pre>
*  or手动`require('es5-shim')` es5api
*  手动`require('es5-shim/es5-sham')` es5api加强包
*  手动`require('console-polyfill')` 估计是console的es6api
*  手动`import "babel-polyfill"` es6api=core.js + regenerator runtime 
	*  promise和fetch 需要   fetch-ie8 和require('es6-promise');//Promise 兼容 (babel-polyfill好像已经兼容了promise)
	*  Object.assgin 需要使用 core.js //建议不用Object.assgin()和Object.is()
*  优化修改UglifyJsPlugin,不会报错
<pre><code>
new webpack.optimize.UglifyJsPlugin({//uglify-js问题
    compress: {
        properties: false,
        warnings: false
    },
    output: {
        beautify: true,//这条本人测试发现可以取消,但是原兼容博主在博文中说道会 把引号被压缩掉
        quote_keys: true
    },
    mangle: {
        screw_ie8: false
    },
    sourceMap: false
})
</code></pre>
1. `es3ify-webpack-plugin` == `es3ify-loader` == `transform-es3-property-literals` + `babel-plugin-transform-es3-member-expression-literals` + `babel-plugin-add-module-exports`
2. `transform-es3-property-literals`// 保留字兼容
3. `babel-plugin-transform-es3-member-expression-literals`//保留字属性兼容
4. `babel-plugin-add-module-exports`//default字兼容
## 已知BUG
> 某些情况下导入字体路径会错误(需手动修改，进入build后的css文件搜索后缀如ttf)--添加html-loader后好像已经解决

> vendor.js需要被多个页面引入才会产生，不影响实际开发,反而减少了一次http请求(好事)

## 注意
* 代码内含大量冗余无用的注释，自行判断
* html里的style.css不会添加前缀
* css-loader 不能类似解析url('data:image/svg+xml;charset=utf-8,<svg...')的css语法,改为url('data:image/svg+xml;base64,PHN2Zw...')
* export-loader N个月没更新,不支持export和module.exports选择，而import和module.exports混用会报错
所以我fork了个export-loader,添加了2个参数 详情<https://https://github.com/xxssww0258/exports-loader/>
* `exporse-loader` 和` webpack.ProvidePlugin`不会为node_modules里的js注入全局变量,需手动复制再导入
* less-loader 还要安装less `npm install --save-dev less-loader less`
* webpack2.0自动添加json-loader
* .vue文件都由vue-loader处理 例如html-loader不会解析.vue里面的src
* Babel默认只转换新的JavaScript句法（syntax），而不转换新的API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。必须使用babel-polyfill

>需要兼容的情况es3环境中需手动导入es5的api:`es5-shim`,`es5-sham`或es6api,在es5环境中需手动导入es6环境：`babel-polyfill`,`console-polyfill`

* 为了解决extract-text-webpack-plugin CSS重复问题vue-cli压缩了2次css代码，build时间较长
* 估计还有许多loader存在问题