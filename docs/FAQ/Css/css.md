---
title: Css写法小技巧
date: 2019-10-29
tags:
- CSS
---


>那些年被忽略的好用却不被熟知的`Css`特性


## 前言
说到`css`,无嵌套，无变量定义，写法繁重，是他没错了。如果你还这样认为，不好意思，你可能已经落伍了，当然排除预处理器，类似与`postcss`,`sass`,`less`,`stylus`这种语法，但是缺点就是一堆包的配置，关键就是不支持低阶语法，`css`虽然繁琐，但是以其良好的兼容性，还是底层框架的首选，虽然不知道有不有用，看看又不花钱。

## 传统的css
```html
<div class="container">
    <div class="container-child1">
        <div class="container-child1-child1"></div>
        <div class="container-child1-child2"></div>
        <div class="container-child1-child3">
            ...
        </div>
    </div>
</div>
<style>
    .container{
        color:'red'
    }
    .container .container-child1 {
        color:'yellow'
    }
    .container .container-child1 .container-child1-child1 {
        color:'green'
        //...
    }
</style>
```
## css替代品
这种代码想必很眼熟吧，臃肿，繁琐，不移维护，😤这TM谁看的懂,一大串密密麻麻。正所谓，有需求就有市场 一系列预处理就因运而生，就以Less举例
```less
    .container{
        color:'red'
    }
    .container .container-child1 {
        color:'yellow'
    }
    .container .container-child1 .container-child1-child1 {
        color:'green'
        //...
    }

    .container{
        color:'red'
        .container-child1 {
            color:'yellow'
            .container-child1-child1 {
                color:'green'
                //...
            }
        }
    }
```
搞定收工，当然他的功能不仅于此，还可以定义变量函数等等等等.....

## 如今的css
- 定义变量
- 定义函数
- 计算差值 
- ...由于太多不一一列举罒ω罒

没错这些在两年前都已经支持，你没听错两年前，我还没大学毕业😢，我可能是个假前端，切图仔。
```html
<style>
    :root{
        --color:'red';
        --backGround:'green';
    }
    .span{
        --size:'66px';
        color:var(--color);
        font-size:var(--size);
    }
    .p{
        background:var(--backGround);
    }
</style>
```
`:root`中的参数属于全局变量，任何地方都可以使用,`.span`中的`--size`属于局部变量，只能够在当前作用于使用，有点js的意识了。当然，还可以定义函数哦,瞅着。
```html
<style>
    :root{
        --color:'red';
        --fn:()=>{
            console.log('我是谁，我在哪');
        }
    }
</style>
```
没想到吧😏，也没报错，但是他的确被赋值到全局变量上去了，虽然我也不知道这样有啥用，咱也不知道，咱也不敢问。反正B格到位了