"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("../util");
class default_1 {
    constructor(value) {
        if (!value)
            return;
        this.id = value.id || util_1.default.uuid();
        this.name = value.name || '';
        this.tel = value.tel || '';
        this.companyName = value.companyName || '';
        this.email = value.email || '';
        this.leaveMessage = value.leaveMessage || '';
        this.timestamp = value.timestamp || Date.now();
    }
}
exports.default = default_1;
//# sourceMappingURL=company.js.map