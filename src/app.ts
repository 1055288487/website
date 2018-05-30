import * as Koa from 'koa';
import * as http from 'http';
import * as  KoaRouter from 'koa-router';
import * as Bodyparser from 'koa-bodyparser';
import * as controllers from './controllers/indexController';
import * as  path from 'path'

const render = require('koa-ejs'),
    koaStatic = require('koa-static-plus'),
    staticServe = require('koa-static-server')
    // fs = require('fs')
// import indexController from './controllers/indexController'
import config from './config';
const app = new Koa(),
    // auth = require('koa-basic-auth'),
    convert = require('koa-convert'),
    bodyparser = Bodyparser(),
    router = new KoaRouter(),
    DEBUG = require('debug'),
    debug = DEBUG('index:debug'),
    logError = DEBUG('index:error');


app.use(async function (ctx: Koa.Context, next: Function) {

    try {
        ctx.set('server', 'WSS/V8');
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
        ctx.set('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization');
        if (ctx.method === 'OPTIONS') {
            ctx.status = 200;
            return
        }
        await next();
    } catch (err) {
        // logError(err);
        if (err.status === 401) {
            ctx.status = 401;
            ctx.set('WWW-Authenticate', 'Basic');
            ctx.body = '未授权的访问';
        } else {
            ctx.status = 200;
            ctx.body = {
                ret: 0,
                msg: err.message
            }
        }
    }
});

// app.use(auth({ name: config.auth.appkey, pass: config.auth.appsecret }));
app.use(router.allowedMethods())
    .use(convert(bodyparser))
    .use(staticServe({                       // 加载静态资源文件
        rootDir: './public',
        rootPath: '/public',
        index: 'index.html'
      }))
    .use(router.routes());

router.all('/', (ctx: Koa.Context) => {
    ctx.body = 'i\'m ok';
    ctx.res.writeHead(200, {})
});

// static
app.use(convert(koaStatic(path.join(__dirname, '../public'), {
    pathPrefix: ''
})));

render(app, {
    root: path.join(__dirname, '../views'),
    layout: 'index',
    viewExt: 'ejs',
    cache: false,
    debug: false
});


let cs: any = controllers;
let keys = Object.keys(controllers);
keys.forEach(e => {
  let controller: IRouter = cs[e] as IRouter;
  controller.init(router);
})



app.on('error', (err: Error, ctx: Koa.Context) => {
    logError('%s - error occured:%s', ctx.url, err);
})

let port = process.env.PORT || config.port;
const server = http.createServer(app.callback());


server.listen(port);

server.on('error', (error: any) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logError(port + ' requires elevated privileges');
            process.exit(1);
            break
        case 'EADDRINUSE':
            logError(port + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
});

server.on('listening', () => {
    debug('app listening on:%j', server.address());
})
