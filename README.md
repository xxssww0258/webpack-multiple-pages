# vue-cli-multiple-pages
vue-cli  多页面

## 参考
*	<https://github.com/Aka-xXx/vue-multi-page/>
> 主要是在这个的基础上进行优化修改

## 使用
>基于vue-cli 修改的多页面项目

>选项在config/index.js
	
	npm run build
	npm run dev



## 修改的大致内容
*	取消build生产map
*	删除css压缩时的注释代码
*	删除js压缩时的注释代码
*	添加自动补前缀（原本只补.vue）
*	添加common.js存放公共 js(manifest.js是存放长期不修改的)
*	默认已经依赖less,sass
*	还有一堆我忘记了的修改。。。

>修改成多页面模式

>在module/创建模块.e.g:module/index[这是模块名]/index.js[默认入口文件]

>在module/创建模块.e.g:module/index[这是模块名]/index.html[默认模版]



## 已知BUG
> 某些情况下导入字体路径会错误(需手动修改，进入css文件搜索后缀如ttf)

> vendor.js需要被多个页面引入才会产生，不影响实际开发

## 注意
> 代码内含大量冗余无用的注释，自行判断

> css-loader 不能类似解析 url(data:xxxx,svg())
