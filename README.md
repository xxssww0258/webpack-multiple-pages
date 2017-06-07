# webpack-multiple-pages
根据 vue-cli 修改的多页面，不一定vue才能用，其他框架也能用

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
*	添加插件默认全局注入jquery
*	添加html-loader解析html图片路径
*	添加.vue解析data-src(默认只解析src)
*	取消build生产map
*	删除css压缩时的注释代码
*	删除js压缩时的注释代码
*	添加自动补前缀（原本只补.vue）
*	添加common.js存放公共 js(vendor.js是存放长期不修改的)
*	默认新增依赖less-loader,less,sass,stylus,postcss,html,autoprefixer,imports,exports,expose
*	还有webpack-spritesmith，但是没有做处理，暂时不可用，如果以后想要兼容ie7才会进行修改
*	还有一堆我忘记了的修改。。。

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
* 估计还有许多loader存在问题