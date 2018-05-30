"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
class default_1 {
    static uuid(len = 32) {
        return crypto.randomBytes(len / 2).toString('hex');
    }
}
exports.default = default_1;
//# sourceMappingURL=util.js.map