import { z } from 'zod';
export declare const loginDto: z.ZodObject<{
    studentId: z.ZodString;
    name: z.ZodString;
}, z.core.$strip>;
export type LoginDto = z.infer<typeof loginDto>;
