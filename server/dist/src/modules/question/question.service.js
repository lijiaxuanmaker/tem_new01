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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuestionService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../storage/database/supabase-client");
const coze_coding_dev_sdk_1 = require("coze-coding-dev-sdk");
let QuestionService = class QuestionService {
    constructor() {
        const config = new coze_coding_dev_sdk_1.Config();
        this.llmClient = new coze_coding_dev_sdk_1.LLMClient(config);
    }
    async getRandomQuestion(dto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: questions, error } = await client
            .from('questions')
            .select('id, title, content');
        if (error) {
            throw new Error(`获取题目失败: ${error.message}`);
        }
        if (!questions || questions.length === 0) {
            return {
                success: false,
                message: '题库中暂无题目',
            };
        }
        const randomIndex = Math.floor(Math.random() * questions.length);
        const question = questions[randomIndex];
        return {
            success: true,
            questionId: question.id,
            title: question.title,
            content: question.content,
        };
    }
    async submitAnswer(dto, headers) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: question, error } = await client
            .from('questions')
            .select('*')
            .eq('id', dto.questionId)
            .single();
        if (error || !question) {
            return {
                success: false,
                message: '题目不存在',
            };
        }
        const systemPrompt = `你是一位专业的医学教育评估专家，负责对学生的临床案例答案进行评分。

评分标准：
${question.scoring_criteria}

请根据以下评分维度进行评估，并严格按以下JSON格式返回结果（不要包含任何markdown标记）：

{
  "score": 总分(整数0-100),
  "serviceScore": 服务流程得分(整数0-20),
  "professionalScore": 专业能力得分(整数0-60),
  "communicationScore": 沟通人文得分(整数0-20),
  "strengths": ["优点1", "优点2", "优点3"],
  "improvements": ["改进建议1", "改进建议2", "改进建议3"],
  "detailedFeedback": {
    "serviceProcess": "服务流程方面的具体评价",
    "professionalAbility": "专业能力方面的具体评价",
    "communication": "沟通人文方面的具体评价"
  }
}`;
        const userPrompt = `题目：${question.title}

题干：
${question.content}

标准答案：
${question.correct_answer}

学生答案：
${dto.answer}

请对学生答案进行评分，给出结构化的反馈。`;
        try {
            const customHeaders = headers ? coze_coding_dev_sdk_1.HeaderUtils.extractForwardHeaders(headers) : undefined;
            const messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt },
            ];
            const response = await this.llmClient.invoke(messages, {
                model: 'doubao-seed-1-8-251228',
                temperature: 0.3,
            });
            let scoreResult;
            try {
                let content = response.content;
                content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
                const jsonMatch = content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    scoreResult = JSON.parse(jsonMatch[0]);
                }
                else {
                    throw new Error('无法解析评分结果');
                }
            }
            catch (parseError) {
                console.error('JSON解析错误:', parseError);
                scoreResult = {
                    score: 60,
                    serviceScore: 12,
                    professionalScore: 36,
                    communicationScore: 12,
                    strengths: ['已完成基本回答'],
                    improvements: ['建议更详细地分析病例', '建议关注TDM相关内容'],
                    detailedFeedback: {
                        serviceProcess: '请在回答中注意服务流程的完整性',
                        professionalAbility: '需要加强专业知识的应用',
                        communication: '建议增加人文关怀相关内容'
                    }
                };
            }
            return {
                success: true,
                score: scoreResult.score || 60,
                serviceScore: scoreResult.serviceScore || 12,
                professionalScore: scoreResult.professionalScore || 36,
                communicationScore: scoreResult.communicationScore || 12,
                strengths: scoreResult.strengths || [],
                improvements: scoreResult.improvements || [],
                detailedFeedback: scoreResult.detailedFeedback || {},
                correctAnswer: question.correct_answer,
                scoringCriteria: question.scoring_criteria,
            };
        }
        catch (llmError) {
            console.error('LLM 判分失败:', llmError);
            return {
                success: true,
                score: 60,
                serviceScore: 12,
                professionalScore: 36,
                communicationScore: 12,
                strengths: ['已完成回答'],
                improvements: ['自动评分系统暂时不可用，请对照标准答案进行自我评估'],
                detailedFeedback: {
                    serviceProcess: '评分系统暂时不可用',
                    professionalAbility: '评分系统暂时不可用',
                    communication: '评分系统暂时不可用'
                },
                correctAnswer: question.correct_answer,
                scoringCriteria: question.scoring_criteria,
            };
        }
    }
};
exports.QuestionService = QuestionService;
exports.QuestionService = QuestionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], QuestionService);
//# sourceMappingURL=question.service.js.map