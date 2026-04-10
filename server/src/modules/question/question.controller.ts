import { Controller, Post, Body, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { Request } from 'express';
import { QuestionService } from './question.service';
import { getRandomQuestionDto, submitAnswerDto } from './question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Post('random')
  @HttpCode(HttpStatus.OK)
  async getRandomQuestion(@Body() body: unknown) {
    // 验证请求数据
    const result = getRandomQuestionDto.safeParse(body);
    if (!result.success) {
      return {
        success: false,
        message: result.error.issues[0]?.message || '参数验证失败',
      };
    }
    
    return await this.questionService.getRandomQuestion(result.data);
  }

  @Post('submit')
  @HttpCode(HttpStatus.OK)
  async submitAnswer(@Body() body: unknown, @Req() req: Request) {
    // 验证请求数据
    const result = submitAnswerDto.safeParse(body);
    if (!result.success) {
      return {
        success: false,
        message: result.error.issues[0]?.message || '参数验证失败',
      };
    }
    
    // 提取请求头用于 LLM 调用
    const headers = req.headers as Record<string, string>;
    
    return await this.questionService.submitAnswer(result.data, headers);
  }
}
