## 前端也得懂得持续集成持续部署（github + docker + ci/cd）

> 首先你得懂啥叫持续集成（部署）, 但是我们今天讨论的不是理论知识, 在这里**不会和你讲各种命令的理论知识**, 第一次他这种东西可能会觉得很高大上, 其实大部分都是死步骤, 全都是固化的流程, 废话不多说, 现在就来从零到一来开始实操,

### 准备工作

- 云服务器
- github账户
- 看得懂基本的docker命令
- 懂基本的shell命令
- 稍微得懂点服务端知识（node）即可

> 不懂也没关系, cv总会吧, 阿里云服务器的安全组得开放对应的端口, 不然外网无法访问

### 本地工作

首先需要在`github` 初始化总控制的项目, 该项目控制自动构建的核心, 我们初始化名为`webhook`, 这里需要创建一个基本的服务脚本, 首先需要搞清楚这个脚本的作用, 再结合作用来扩充,

- 处于持续运行阶段, 接收github的访问请求
- 接收到请求能自动构建docker镜像, 并且自动拉取指定位置的最新代码构建打包
- 每次提交构建可以设置短信验证提醒

基于以上需求, 我们的目录大致如下 

```shell
── src
   ├── webhook.js   
   ├── poject-server.sh 
   └── poject-web.sh    
```

还是比较简单的, 首先不考虑`shell`脚本该如何编写, 现将基本的`js`功能上传解决, 步骤也都是固定的, 得看一下`webhook`的官方文档, 伸手党可直接cv

```javascript
let http = require('http');
let server = http.createServer(function(req,res){
  console.log(req.method,req.url);
  }else{
    res.end('Not Found!');
  }
});
server.listen(4000,()=>{
  console.log('服务正在4000端口上启动!');
});
```

目前还是比较乞丐, 现将这套项目上传到`github`, 然后按如下步骤配置`webhook`, 找到刚刚上传的控制项目**`setting` > `webhooks`**配置如下

- Payload URL： **http://you-ip-prot/wehbook**
- Content type： **appliaction/json**
- Secret ：**秘钥**<看你心情填>
- 其余设置默认即可

### 服务器配置

配置完成后, 登录到自己的服务器, 创建一个存放项目的文件夹这里默认`poject`, 回到服务器安装所需要的`NODE`,`GIT`,`NPM`,`NVM`,`DOCKER`,`PM2`

```shell
//安装docker
yum install -y yum-utils   device-mapper-persistent-data   lvm2
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
yum install -y docker-ce docker-ce-cli containerd.io

//安装杂项
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
source /root/.bashrc
nvm install stable
npm i nrm -g
nrm use taobao
npm i pm2 -g
```

回到刚刚创建的目录`poject`, 拉取`github`上的`webhook`项目, 然后运用运行, 命令行输出`服务正在4000端口上启动!`即可.回到本地, 我们先创建一个基本的`node`的服务端简单的运行一下。

```javascript
let http = require("http");
let users = [
  { id: 1, name: "dddddddddddddddd" },
  { id: 2, name: "dddddddddddddddd" },
  { id: 2, name: "dddddddddddddddd" },
  { id: 2, name: "dddddddddddddddd" },
  { id: 2, name: "dddddddddddddddd" },
  { id: 2, name: "dddddddddddddddd" },
];
let server = http.createServer(function(req, res) {
  if (req.url == "/api") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify(users));
  } else {
    res.end("Now Found!");
  }
});
server.listen(3000, () => {
  console.log("服务正在3000端口上启动!");
});
```

操作也和`webhook`的项目一样, 直接推送到`github`上, 并且也得配置`webhook`和上述操作无异, 回到服务器拉取到刚刚创建的`node`项目, 运行起来, 

### docker配置

找到刚刚创建的`node`服务, 创建`DockerFile`文件, 简单介绍一下

```docker
FROM node
LABEL name="object-server"
LABEL version="1.0"
COPY . /app
WORKDIR /app
RUN npm install
EXPOSE 3000
CMD npm start
```

`FROM`构建一个`node`环境的镜像, `LABEL`就是一个标识,`COPY`将本地文件夹`.`拷贝到`/app`执行, 执行`WORKDIR`命令运行,

### sh配置

`docker`命令已经能执行, 我们需要能执行`DockerFile`的脚本来自动执行, 回到配置的`webhook`项目,创建运行对应项目的`DcokerFile`的`shell`脚本, 由于本次只有后端项目, 顾命名`object-server.sh`, 为了便于观察, 我们在对应的命令打出结果.

- webhooks -> object-server.sh

```shell
#!/bin/bash
WORK_PATH='/usr/poject/object-server'
cd $WORK_PATH
echo "清理server代码"
git reset --hard origin/master
git clean -f
echo "拉取server最新代码"
git pull origin master
echo "开始构建镜像"
docker build -t object-server:1.0 .
echo "删除旧容器"
docker stop object-server-container
docker rm object-server-container
echo "启动新容器"
docker container run -p 3000:3000 -d --name object-server-container -d object-server:1.0
```

切记你的`WORK_PATH`必须对应到项目, 其次构建镜像是必须跟上版本号`docker build -t object-server:1.0 . 不然可能会出现无法构建镜像的尴尬局面,  `

升级`webhook`的配置, 来接受`github`的请求命令, 并且便利该目录下的所有项目的`shell`脚本.

```javascript
let http = require('http');
let crypto = require('crypto');
var spawn = require('child_process').spawn;
const SECRET = '123456';
function sign (data) {
  return 'sha1=' + crypto.createHmac('sha1', SECRET).update(data).digest('hex')
}
let server = http.createServer(function(req,res){
  console.log(req.method,req.url);
  if(req.url == '/webhook' && req.method =='POST'){
    let buffers = []; 
    req.on('data',function(data){
      buffers.push(data);
    });
    req.on('end',function(){
      let body = Buffer.concat(buffers);
      let sig   = req.headers['x-hub-signature'];
      let event = req.headers['x-github-event'];
      let id    = req.headers['x-github-delivery'];
      if(sig !== sign(body)){
        return res.end('Not Allowed');
      }
      res.setHeader('Content-Type','application/json');
      res.end(JSON.stringify({"ok":true}));
      //===========开始部署ci/cd===================
      if(event === 'push'){
        let payload = JSON.parse(body);
        let child = spawn('sh', [`./${payload.repository.name}.sh`]);
        let buffers = [];
        child.stdout.on('data', function (buffer) { buffers.push(buffer)});
        child.stdout.on('end', function () {
          let logs = Buffer.concat(buffers).toString();
          console.log(logs)
        });
      }
    });
  }else{
    res.end('Not Found!');
  }
});
server.listen(4000,()=>{
  console.log('服务正在4000端口上启动!');
});
```

`SECRET`是在`github`设置的秘钥`crypto`加解密, 全都是死的代码流程, 在将其部署到`github`上, 回到服务器拉取最新的部署代码, 使用`pm2`启动守护进程, 打印对应的日志来观察.

### 验证

回到`object-server`修改些许代码, 会观察到服务器的`logs`打印出在对应`sh`脚本设置的输出, 

```reStructuredText
1|webhook  | POST /webhook
1|webhook  | 清理server代码
1|webhook  | HEAD 现在位于 77bbbaa savesss
1|webhook  | 拉取server最新代码
1|webhook  | 更新 77bbbaa..2897017
1|webhook  | Fast-forward
1|webhook  |  .dockerignore    |  3 +--
1|webhook  |  README.md        |  1 -
1|webhook  |  object-server.sh | 15 ---------------
1|webhook  |  server.js        | 13 ++++++-------
1|webhook  |  4 files changed, 7 insertions(+), 25 deletions(-)
1|webhook  |  delete mode 100644 README.md
1|webhook  |  delete mode 100644 object-server.sh
1|webhook  | 开始构建镜像
1|webhook  | Sending build context to Docker daemon  153.1kB
1|webhook  | Step 1/8 : FROM node
1|webhook  |  ---> 2af77b226ea7
1|webhook  | Step 2/8 : LABEL name="object-server"
1|webhook  |  ---> Using cache
1|webhook  |  ---> b9d116d99088
1|webhook  | Step 3/8 : LABEL version="1.0"
1|webhook  |  ---> Using cache
1|webhook  |  ---> 9e659d5d4dfb
1|webhook  | Step 4/8 : COPY . /app
1|webhook  |  ---> 96cbb119be36
1|webhook  | Step 5/8 : WORKDIR /app
1|webhook  |  ---> Running in 45f31d071199
1|webhook  | Removing intermediate container 45f31d071199
1|webhook  |  ---> ce1d7eac7396
......
```

### 扩展

此后每次都不需要自己构建部署到服务器, 只需要`push`上传代码, 便可达到自动部署的功能, 上述只是后台代码, 其实前台代码, 也只是需要在对应的`shell`脚本中加入以下打包即可,

```shell
#!/bin/bash
WORK_PATH='/usr/poject/object-web'
cd $WORK_PATH
echo "清理web代码"
git reset --hard origin/master
git clean -f
echo "拉取web最新代码"
git pull origin master

echo "编译"
npm run build

echo "开始构建镜像"
docker build -t object-web:1.0 .
echo "删除旧容器"
docker stop object-web-container
docker rm object-web-container
echo "启动新容器"
docker container run -p 80:80 -d --name object-web-container -d object-web:1.0
```

### 总结

只需要编写对应的`webhook`服务器脚本, 编写对应的项目的`shell`脚本, 再在对应的项目中创建执行`docker`命令的`DockerFile`, 传说中的持续集成持续部署就搞定了. 当然这只是讲解`push`指令的操作, 也可以监控其他的指令, 然后对应的操作权限即可, 也可在操作成功后发送短信验证或者邮箱验证, 最后再来复习一下目录结构,

```shell
── poject
   ├── webhook   
   |   ├── webhooks.js
   |   ├── poject-server.sh
   |   └── poject-web.sh
   ├── poject-server
   |   ├── server.js  
   |   └── DockerFile
   ├── poject-web
   |   ├── web.js  
   |   └── DockerFile
```

至此, 基于`github`,`docker`,`ci/cd`的持续集成部署便搞定了.
 **地址：<https://github.com/StackFei/FAQ/tree/cicd#>**

