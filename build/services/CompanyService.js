"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseServices_1 = require("./baseServices");
class CompanyService extends baseServices_1.BaseServices {
    constructor() {
        super('collaborators');
    }
}
exports.CompanyService = CompanyService;
exports.default = new CompanyService();
//# sourceMappingURL=CompanyService.js.map