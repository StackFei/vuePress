## 求索首页

```javascript
const Koa = require("koa");
const router = require("koa-router")();
const bodyParser = require("koa-bodyparser");
const app = new Koa();
const IndexModel = require("./model/index");
const Token = require("./utils/token");

app.use(bodyParser());
router.get("/", async (ctx, next) => {
  ctx.body = ctx;
});

// User registered All One
router.post("/registered", async (ctx, next) => {
  let username = ctx.request.body.username || "";
  let password = ctx.request.body.password || "";
  const model = new IndexModel({
    username,
    password
  });
  model.save((err, data) => {
    if (err) {
      return (ctx.body = {
        code: 0,
        msg: "注册失败"
      });
    } else {
      return (ctx.body = {
        code: 0,
        msg: "注册成功"
      });
    }
  });
});

// User login
router.post("/login", async (ctx, next) => {
  const name = "张三";
  const token = Token.encrypt({ name: name }, "10s");
  let data = Token.decrypt(token);
  if (data.token) {
    return (ctx.body = {
      code: 0,
      msg: "Token",
      token
    });
  } else {
    return (ctx.body = {
      code: 0,
      msg: "不配拥有Token"
    });
  }
});

app.use(router.routes());

app.listen(3000, () => {
  console.log("server is running");
});

```
