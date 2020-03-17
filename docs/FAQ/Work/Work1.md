---
title: 前端请求的正确打开方式 
date: 2019-10-31
tags:
- 前端
- postman
---

> 现如今的企业都是在前后端分离开发的背景之下开发，各端各司其职，利于管理。

![work日常工作](http://static.pengyunfei.top/image/Work/work1.png)

## 前言
在部分分离开发情况下，后端负责广义上的接口，前端负责广义上的界面。大家都遵循 `Restful` 的开发规范来约束自己。因此对于前端的要求也就越来越高，需要懂得起码的服务器端知识，得自己拿开发文档的接口，自己来接数据。对于新入门的小伙伴可能就会存在一定的难度，本文就在该背景之下，对于前端接接口提出几项解决方案。

## 古老的浏览器请求
最常见的莫过于直接在浏览器输入网址，然后就会收到来自后端返回的`Json`数据，简单粗暴，并没有复杂的操作，缺点就是只能调试，`GET` 请求，所以并不适合复杂的项目使用。的确对于过往的开发方式，这些都不需要前端操心，但现如今就不一样了。时代得进步啊，不多扯，上图。

![work日常工作](http://static.pengyunfei.top/image/Work/work2.gif)

## 忠实的快递员postMan
既然有前后端分离开发的背景需求，就势必拥有一些为需求所服务的人。有市场就有需求吗。`postMan` 应运而生。你还别说的确是好用。后端开发，前端开发，甚至是手机端开发，只要你需要调试接口数据，它都能解决你的难题，接下来就见识一下他的威力。

![work日常工作](http://static.pengyunfei.top/image/Work/work3.gif)

哎，就是这么顺畅，目前就只显示了`GET`，`POST` 请求，当然肯定是还支持`HEAD`,`DELETE`,`PUT`,`OPTIONS`等各种请求方式。就不做过多阐述，也都是比较简单的操作，需要注意的是。如果后端支持的数据格式是表单形式的就要勾选 `application/x-www-form-urlencoded`,如果是`JSON`的格式就可以选择`raw`勾选`JSON`直接书写用来访问。详情见下图.

![work日常工作](http://static.pengyunfei.top/image/Work/work4.gif)

可以看出，`postMan` 算的上是一款神器，能解决开发中的百分之九十九的问题，但还有百分之一百的问题无法解决，就是写法臃肿，每次请求都要复制相同的域名，可能还有相同的参数，最主要是没请求一次，菜单栏都会有一条记录产生，久而久之，分类就会变得复杂，不利于管理。

![work日常工作](http://static.pengyunfei.top/image/Work/work5.gif)

### postMan的偷懒试写法
见识到上面的写法，我估计再好的产品都会被弃坑，太臃肿了。接下来就来体验下偷懒者的写法。

![work日常工作](http://static.pengyunfei.top/image/Work/work6.gif)

这样就舒服很多了是吧，新建一个域名的结合，每次请求该域名下的所有路径都选择该集合，发送完之后，怕请求多了，找不到？不用担心，直接保存当前请求，并且编辑语义化的标签，以后每次点该条语句。都会重复该条，简直就是技术宅的福音啊。

## VSCode懒人小插件REST-Client
说起`VScode` 宇宙第一强，没人反对吧？当然你要非说`IDE` 那咱也没办法不是，就开发来说这绝对算的上是微软的最良心的一款软件。以插件多的满天飞而闻名与技术圈，没错，这次要介绍的也是他的一款请求插件`REST-Client` ,绝对算的上是懒人插件。也是唯一一个需要写代码的请求方式。
```javascript
@hostname=http://localhost
@port=3000
@host={{hostname}}:{{port}}

#### 个人信息
{{host}}/profile

#### 首页
{{host}}

#### 登录页
POST {{host}}/api/signin
Content-Type: application/json;charset=UTF-8

{
    "name":"彭云飞",
    "password":"666"
}
```
找到项目的根目录，新建一个`.http`的文件，写上如上代码，这些都看的懂吧，看不懂的老老实实面壁思过去
域名`hostname`配上端口号`port`组合成主机号`host`,请求时再加上服务器所需要的格式类型`Content-Type`，一款新鲜出炉的懒人包，当然你也可以不必抽的这么细，直接配合上主机号也是可以的。
操作方法简单到没有朋友

![work日常工作](http://static.pengyunfei.top/image/Work/work7.gif)

## 终端利器Curl
这款可谓是终端命令爱好者的福音，也是实力秀肌肉的绝佳利器，熟悉`Linux` 各种操作指令，各种请求协议，才能驾驭这种操作。小编也是偷摸着学了学才勉强能敲一些命令。这可真不是人写的东西。当然这也仅仅只是冰山一角的操作方式。

![work日常工作](http://static.pengyunfei.top/image/Work/work8.gif)

稍作解释，首先申明数据请求，并且带上请求的数据，后面更上申明类型，配合上请求方式，最后加上请求地址。咱也解释不清楚，真有想法的可以去看一下[阮一峰老师的curl](http://www.ruanyifeng.com/blog/2019/09/curl-reference.html)，再来细细品味，定会受益匪浅。

综上所说，正常开发使用`postMan` 中规中矩，循环搞点花里胡哨的就用 `EST-Client`,循环秀技术的，当然前提是你得有技术的推荐`Curl`,可别翻车就行。