import { z } from 'zod';
export declare const getRandomQuestionDto: z.ZodObject<{
    userId: z.ZodNumber;
}, z.core.$strip>;
export declare const submitAnswerDto: z.ZodObject<{
    userId: z.ZodNumber;
    questionId: z.ZodNumber;
    answer: z.ZodString;
}, z.core.$strip>;
export type GetRandomQuestionDto = z.infer<typeof getRandomQuestionDto>;
export type SubmitAnswerDto = z.infer<typeof submitAnswerDto>;
