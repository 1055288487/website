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
const BaseController_1 = require("./BaseController");
class AnswerController extends BaseController_1.BaseController {
    init(router) {
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
    index(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('index', { title: '首页' });
        });
    }
    registered(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('index', { title: '注册' });
        });
    }
    login(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('index', { title: '登录' });
        });
    }
    post(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('index', { title: '发表' });
        });
    }
    logout(ctx) {
        return __awaiter(this, void 0, void 0, function* () {
            yield ctx.render('index', { title: '退出' });
        });
    }
}
exports.AnswerController = AnswerController;
exports.default = new AnswerController();
//# sourceMappingURL=CompanyController.js.map