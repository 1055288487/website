import { BaseController } from './BaseController'
// import CompanyService from '../services/CompanyService';
// import Company from '../model/company';
import * as koa from 'koa';
import * as Router from 'koa-router';


export class AnswerController extends BaseController {

    init(router: Router): void {
        router.get('/index', this.index);

        router.get('/reg', this.registered);

        // router.post('/reg', this.reg);

        // router.get('/login', this.reg);

        // router.post('/login', this.reg);

        // router.get('/post', this.post);

        // router.post('/post', this.post);

        // router.get('/logout', this.post);

    }


    // app.get('/', function(req, res) {
    //     res.render('index', { title: '主页' });
    // });
    // app.get('/reg', function(req, res) {
    //     res.render('reg', { title: '注册' });
    // });
    // app.post('/reg', function(req, res) {
    // });
    // app.get('/login', function(req, res) {
    //     res.render('login', { title: '登录' });
    // });
    // app.post('/login', function(req, res) {
    // });
    // app.get('/post', function(req, res) {
    //     res.render('post', { title: '发表' });
    // });
    // app.post('/post', function(req, res) {
    // });
    // app.get('/logout', function(req, res) {
    // });

    async  index(ctx: koa.Context) {
        await ctx.render('index', { title: '首页' });
    }

    async  registered(ctx: koa.Context) {
        await ctx.render('index', { title: '注册' });
    }


    async  login(ctx: koa.Context) {
        await ctx.render('index', { title: '登录' });
    }

    async  post(ctx: koa.Context) {
        await ctx.render('index', { title: '发表' });
    }

    async  logout(ctx: koa.Context) {
        await ctx.render('index', { title: '退出' });
    }
}
export default new AnswerController();