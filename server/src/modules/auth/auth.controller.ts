import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, LoginDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: unknown) {
    // 验证请求数据
    const result = loginDto.safeParse(body);
    if (!result.success) {
      return {
        success: false,
        message: result.error.issues[0]?.message || '参数验证失败',
      };
    }
    
    const loginResult = await this.authService.login(result.data);
    return loginResult;
  }
}
