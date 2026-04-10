"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../storage/database/supabase-client");
let AuthService = class AuthService {
    async login(dto) {
        const client = (0, supabase_client_1.getSupabaseClient)();
        const { data: existingUser, error: queryError } = await client
            .from('users')
            .select('*')
            .eq('student_id', dto.studentId)
            .single();
        if (queryError && queryError.code !== 'PGRST116') {
            throw new Error(`查询用户失败: ${queryError.message}`);
        }
        if (existingUser) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map