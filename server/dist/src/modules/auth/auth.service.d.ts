import { LoginDto } from './auth.dto';
export declare class AuthService {
    login(dto: LoginDto): Promise<{
        success: boolean;
        message: string;
        userId?: undefined;
        name?: undefined;
        studentId?: undefined;
    } | {
        success: boolean;
        userId: any;
        name: any;
        studentId: any;
        message?: undefined;
    }>;
}
