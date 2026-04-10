import { z } from 'zod';

export const loginDto = z.object({
  studentId: z.string().min(1, '学号不能为空'),
  name: z.string().min(1, '姓名不能为空'),
});

export type LoginDto = z.infer<typeof loginDto>;
