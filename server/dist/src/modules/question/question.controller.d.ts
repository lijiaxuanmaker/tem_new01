import { Request } from 'express';
import { QuestionService } from './question.service';
export declare class QuestionController {
    private readonly questionService;
    constructor(questionService: QuestionService);
    getRandomQuestion(body: unknown): Promise<{
        success: boolean;
        questionId: any;
        title: any;
        content: any;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
    submitAnswer(body: unknown, req: Request): Promise<{
        success: boolean;
        score: any;
        serviceScore: any;
        professionalScore: any;
        communicationScore: any;
        strengths: any;
        improvements: any;
        detailedFeedback: any;
        correctAnswer: any;
        scoringCriteria: any;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
}
