import { GetRandomQuestionDto, SubmitAnswerDto } from './question.dto';
export declare class QuestionService {
    private llmClient;
    constructor();
    getRandomQuestion(dto: GetRandomQuestionDto): Promise<{
        success: boolean;
        message: string;
        questionId?: undefined;
        title?: undefined;
        content?: undefined;
    } | {
        success: boolean;
        questionId: any;
        title: any;
        content: any;
        message?: undefined;
    }>;
    submitAnswer(dto: SubmitAnswerDto, headers?: Record<string, string>): Promise<{
        success: boolean;
        message: string;
        score?: undefined;
        serviceScore?: undefined;
        professionalScore?: undefined;
        communicationScore?: undefined;
        strengths?: undefined;
        improvements?: undefined;
        detailedFeedback?: undefined;
        correctAnswer?: undefined;
        scoringCriteria?: undefined;
    } | {
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
    }>;
}
