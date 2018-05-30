"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    /**
     * 返回正确的数据
     * @param _data
     */
    ok(_data) {
        return {
            ret: 1,
            msg: 'ok',
            data: _data
        };
    }
    /**
     *
     * @param _msg 数据异常数据
     * @param _data
     */
    bad(_msg, _data) {
        return {
            ret: 0,
            msg: _msg || '',
            data: _data
        };
    }
}
exports.BaseController = BaseController;
//# sourceMappingURL=BaseController.js.map