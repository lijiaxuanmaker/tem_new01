"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submitAnswerDto = exports.getRandomQuestionDto = void 0;
const zod_1 = require("zod");
exports.getRandomQuestionDto = zod_1.z.object({
    userId: zod_1.z.number().int().positive('用户ID必须为正整数'),
});
exports.submitAnswerDto = zod_1.z.object({
    userId: zod_1.z.number().int().positive('用户ID必须为正整数'),
    questionId: zod_1.z.number().int().positive('题目ID必须为正整数'),
    answer: zod_1.z.string().min(1, '答案不能为空'),
});
//# sourceMappingURL=question.dto.js.map