require('es5-shim')  ;//es5api
require('es5-shim/es5-sham') ;//es5api2
require('console-polyfill')//console api
require("babel-polyfill");//es6api
//reqyure('es6-promise')//es6-promise兼容(babel-polyfill好像已经兼容了es6-promise)
let a=[1,2,34,4];

a.map((v)=>{console.log(v);return v*2})