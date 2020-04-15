const Koa = require('koa');
const app = new Koa();

// logger

app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  ctx.cookies.set('name', 'weiyongzhi');
  const cookie = ctx.cookies.get('name');
  console.log('cookie:' + cookie)
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// response

app.use(async ctx => {
  //  ctx.cookies.set('name', 'weiyongzhi')
  ctx.body = 'Hello World';
});

app.listen(3000);