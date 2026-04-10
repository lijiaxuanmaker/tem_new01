import { pgTable, serial, timestamp, varchar, text, integer } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import { createSchemaFactory } from "drizzle-zod"
import { z } from "zod"

// 用户表
export const users = pgTable("users", {
	id: serial().notNull().primaryKey(),
	studentId: varchar("student_id", { length: 50 }).notNull().unique(),
	name: varchar("name", { length: 100 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// 题目表
export const questions = pgTable("questions", {
	id: serial().notNull().primaryKey(),
	title: varchar("title", { length: 200 }).notNull(),
	content: text("content").notNull(), // 题干内容
	correctAnswer: text("correct_answer").notNull(), // 正确答案
	scoringCriteria: text("scoring_criteria").notNull(), // 判分标准（JSON格式）
	difficulty: integer("difficulty").default(1).notNull(), // 难度等级 1-5
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

// 系统健康检查表
export const healthCheck = pgTable("health_check", {
	id: serial().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});

// 使用 createSchemaFactory 配置 date coercion
const { createInsertSchema: createCoercedInsertSchema } = createSchemaFactory({
  coerce: { date: true },
});

// Zod schemas for validation
export const insertUserSchema = createCoercedInsertSchema(users).pick({
	studentId: true,
	name: true,
});

export const insertQuestionSchema = createCoercedInsertSchema(questions).pick({
	title: true,
	content: true,
	correctAnswer: true,
	scoringCriteria: true,
	difficulty: true,
});

// TypeScript types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Question = typeof questions.$inferSelect;
export type InsertQuestion = z.infer<typeof insertQuestionSchema>;
