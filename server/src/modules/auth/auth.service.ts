import { Injectable } from '@nestjs/common';
import { getSupabaseClient } from '@/storage/database/supabase-client';
import { LoginDto } from './auth.dto';

@Injectable()
export class AuthService {
  async login(dto: LoginDto) {
    const client = getSupabaseClient();
    
    // 查询用户是否存在
    const { data: existingUser, error: queryError } = await client
      .from('users')
      .select('*')
      .eq('student_id', dto.studentId)
      .single();
    
    if (queryError && queryError.code !== 'PGRST116') {
      // PGRST116 表示未找到记录，其他错误则抛出
      throw new Error(`查询用户失败: ${queryError.message}`);
    }
    
    if (existingUser) {
      // 用户已存在，验证姓名
      if (existingUser.name !== dto.name) {
        return {
          success: false,
          message: '学号与姓名不匹配',
        };
      }
      return {
        success: true,
        userId: existingUser.id,
        name: existingUser.name,
        studentId: existingUser.student_id,
      };
    }
    
    // 用户不存在，创建新用户
    const { data: newUser, error: insertError } = await client
      .from('users')
      .insert({
        student_id: dto.studentId,
        name: dto.name,
      })
      .select()
      .single();
    
    if (insertError) {
      throw new Error(`创建用户失败: ${insertError.message}`);
    }
    
    return {
      success: true,
      userId: newUser.id,
      name: newUser.name,
      studentId: newUser.student_id,
    };
  }
}
