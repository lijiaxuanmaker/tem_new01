import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(body: unknown): Promise<{
        success: boolean;
        userId: any;
        name: any;
        studentId: any;
        message?: undefined;
    } | {
        success: boolean;
        message: string;
    }>;
}
