"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionController = void 0;
const common_1 = require("@nestjs/common");
const question_service_1 = require("./question.service");
const question_dto_1 = require("./question.dto");
let QuestionController = class QuestionController {
    constructor(questionService) {
        this.questionService = questionService;
    }
    async getRandomQuestion(body) {
        const result = question_dto_1.getRandomQuestionDto.safeParse(body);
        if (!result.success) {
            return {
                success: false,
                message: result.error.issues[0]?.message || '参数验证失败',
            };
        }
        return await this.questionService.getRandomQuestion(result.data);
    }
    async submitAnswer(body, req) {
        const result = question_dto_1.submitAnswerDto.safeParse(body);
        if (!result.success) {
            return {
                success: false,
                message: result.error.issues[0]?.message || '参数验证失败',
            };
        }
        const headers = req.headers;
        return await this.questionService.submitAnswer(result.data, headers);
    }
};
exports.QuestionController = QuestionController;
__decorate([
    (0, common_1.Post)('random'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "getRandomQuestion", null);
__decorate([
    (0, common_1.Post)('submit'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], QuestionController.prototype, "submitAnswer", null);
exports.QuestionController = QuestionController = __decorate([
    (0, common_1.Controller)('question'),
    __metadata("design:paramtypes", [question_service_1.QuestionService])
], QuestionController);
//# sourceMappingURL=question.controller.js.map