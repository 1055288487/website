/// <reference types="koa-router" />
/// <reference types="koa" />
import { BaseController } from './BaseController';
import * as koa from 'koa';
import * as Router from 'koa-router';
export declare class AnswerController extends BaseController {
    init(router: Router): void;
    index(ctx: koa.Context): Promise<void>;
    registered(ctx: koa.Context): Promise<void>;
    login(ctx: koa.Context): Promise<void>;
    post(ctx: koa.Context): Promise<void>;
    logout(ctx: koa.Context): Promise<void>;
}
declare const _default: AnswerController;
export default _default;
