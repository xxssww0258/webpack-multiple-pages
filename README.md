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
*	小于10k图标或文字转base64(兼容性为ie8 32Kkb以下)
*	对.vue执行less,sass,postcss,stylus,autoprefixer等处理
*	css合并压缩,不压缩注释,提取公共样式
*	js合并压缩 ,不压缩注释，
*	js提取常用模块vendor,常用模块的hash证明manifest,和main.js
*	自动生成html模板,且自动导入vendor,manifest,main,css
*	复制static文件到dist

## 这个项目修改的大致内容

*	修改成多页面模式
*	取消build生产map
*	删除css压缩时的注释代码
*	删除js压缩时的注释代码
*	添加自动补前缀（原本只补.vue）
*	添加common.js存放公共 js(vendor.js是存放长期不修改的)
*	默认新增依赖less,sass,stylus,postcss,html,autoprefixer,imports,exports,expose,json
*	还有webpack-spritesmith，但是没有做处理，暂时不可用，如果以后想要兼容ie7才会进行修改

*	还有一堆我忘记了的修改。。。






## 已知BUG
> 某些情况下导入字体路径会错误(需手动修改，进入build后的css文件搜索后缀如ttf)

> vendor.js需要被多个页面引入才会产生，不影响实际开发,反而减少了一次http请求(好事)

## 注意
* 代码内含大量冗余无用的注释，自行判断

* css-loader 不能类似解析 url(data:xxxx,svg())的css语法

* export-loader N个月没更新,不支持webpack2.0,需要手动修改loader,默认输出module.exports,2个以上输出export

`if is es2015 module   
__webpack_exports__["default"] =//..  
else  
module.exports = //..`

* 估计还有许多loader存在问题