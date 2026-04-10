"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDto = void 0;
const zod_1 = require("zod");
exports.loginDto = zod_1.z.object({
    studentId: zod_1.z.string().min(1, '学号不能为空'),
    name: zod_1.z.string().min(1, '姓名不能为空'),
});
//# sourceMappingURL=auth.dto.js.map