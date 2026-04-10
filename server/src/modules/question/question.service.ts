import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { GetRandomQuestionDto, SubmitAnswerDto } from './question.dto';
import { LLMClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

@Injectable()
export class QuestionService {
  private llmClient: LLMClient;

  constructor() {
    const config = new Config();
    this.llmClient = new LLMClient(config);
  }

  async getRandomQuestion(dto: GetRandomQuestionDto) {
    const client = getSupabaseClient();
    
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

  async submitAnswer(dto: SubmitAnswerDto, headers?: Record<string, string>) {
    const client = getSupabaseClient();
    
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
    
    // 使用 LLM 进行智能判分
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
      const customHeaders = headers ? HeaderUtils.extractForwardHeaders(headers) : undefined;
      
      const messages = [
        { role: 'system' as const, content: systemPrompt },
        { role: 'user' as const, content: userPrompt },
      ];
      
      const response = await this.llmClient.invoke(messages, {
        model: 'doubao-seed-1-8-251228',
        temperature: 0.3,
      });
      
      // 解析 LLM 返回的 JSON
      let scoreResult;
      try {
        // 清理响应内容，移除可能的markdown标记
        let content = response.content;
        // 移除 ```json 和 ``` 标记
        content = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '');
        // 提取 JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          scoreResult = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法解析评分结果');
        }
      } catch (parseError) {
        console.error('JSON解析错误:', parseError);
        // 如果解析失败，使用默认评分
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
    } catch (llmError) {
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
}
