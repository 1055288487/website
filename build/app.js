"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Koa = require("koa");
const http = require("http");
const KoaRouter = require("koa-router");
const Bodyparser = require("koa-bodyparser");
const controllers = require("./controllers/indexController");
const path = require("path");
const render = require('koa-ejs'), koaStatic = require('koa-static-plus'), staticServe = require('koa-static-server');
// fs = require('fs')
// import indexController from './controllers/indexController'
const config_1 = require("./config");
const app = new Koa(), 
// auth = require('koa-basic-auth'),
convert = require('koa-convert'), bodyparser = Bodyparser(), router = new KoaRouter(), DEBUG = require('debug'), debug = DEBUG('index:debug'), logError = DEBUG('index:error');
app.use(function (ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            ctx.set('server', 'WSS/V8');
            ctx.set('Access-Control-Allow-Origin', '*');
            ctx.set('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
            ctx.set('Access-Control-Allow-Headers', 'x-requested-with,content-type,authorization');
            if (ctx.method === 'OPTIONS') {
                ctx.status = 200;
                return;
            }
            yield next();
        }
        catch (err) {
            // logError(err);
            if (err.status === 401) {
                ctx.status = 401;
                ctx.set('WWW-Authenticate', 'Basic');
                ctx.body = '未授权的访问';
            }
            else {
                ctx.status = 200;
                ctx.body = {
                    ret: 0,
                    msg: err.message
                };
            }
        }
    });
});
// app.use(auth({ name: config.auth.appkey, pass: config.auth.appsecret }));
app.use(router.allowedMethods())
    .use(convert(bodyparser))
    .use(staticServe({
    rootDir: './public',
    rootPath: '/public',
    index: 'index.html'
}))
    .use(router.routes());
router.all('/', (ctx) => {
    ctx.body = 'i\'m ok';
    ctx.res.writeHead(200, {});
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
let cs = controllers;
let keys = Object.keys(controllers);
keys.forEach(e => {
    let controller = cs[e];
    controller.init(router);
});
app.on('error', (err, ctx) => {
    logError('%s - error occured:%s', ctx.url, err);
});
let port = process.env.PORT || config_1.default.port;
const server = http.createServer(app.callback());
server.listen(port);
server.on('error', (error) => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            logError(port + ' requires elevated privileges');
            process.exit(1);
            break;
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
});
//# sourceMappingURL=app.js.map