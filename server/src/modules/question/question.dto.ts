import { z } from 'zod';

export const getRandomQuestionDto = z.object({
  userId: z.number().int().positive('用户ID必须为正整数'),
});

export const submitAnswerDto = z.object({
  userId: z.number().int().positive('用户ID必须为正整数'),
  questionId: z.number().int().positive('题目ID必须为正整数'),
  answer: z.string().min(1, '答案不能为空'),
});

export type GetRandomQuestionDto = z.infer<typeof getRandomQuestionDto>;
export type SubmitAnswerDto = z.infer<typeof submitAnswerDto>;
