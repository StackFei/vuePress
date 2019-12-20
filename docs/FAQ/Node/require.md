---
title: 尝试实现一个简易require
date: 2019-12-21
tags:
- Node
- require
---

>require 基于CommonJs规范


```js
const path = require('path');
const fs = require('fs');
const vm  = require('vm');

function Module(id) {
    this.id = id;
    this.exports = {}
}

Module.wrap = [
    "(function(exports,module,require,__dirname,__filename){",
    "})"
]
Module._extenstions = {
    '.js'(module) {
        const content = fs.readFileSync(module.id, 'utf8');
        const contentStr = Module.wrap[0] + content + Module.wrap[1]
        const fn = vm.runInThisContext(contentStr)
        fn.call()
        console.log(fn())
    },
    '.json'(module) {
        // console.log(module)
        const json = fs.readFileSync(module.id, 'utf8');
        module.exports = json
    }
}


function tryModuleLoad(module) {
    // console.log(module)
    const extension = path.extname(module.id, 'utf8')
    Module._extenstions[extension](module)
}

function req(modulePath) {
    let absPathName = path.resolve(__dirname, modulePath);
    let module = new Module(absPathName);
    tryModuleLoad(module);
    return module.exports;
}
// let obj = req('./json.json')
let js = req('./js.js')
// console.log(obj);

```