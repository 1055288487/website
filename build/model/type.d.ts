/// <reference types="koa-router" />
import * as Router from 'koa-router';
declare global  {
    interface IResult<T> {
        ret: number;
        msg: string;
        data?: T;
    }
    /**
     * 路由注册
     */
    interface IRouter {
        init(router: Router): void;
    }
}
export {  };
