"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertQuestionSchema = exports.insertUserSchema = exports.healthCheck = exports.questions = exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)().notNull().primaryKey(),
    studentId: (0, pg_core_1.varchar)("student_id", { length: 50 }).notNull().unique(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
exports.questions = (0, pg_core_1.pgTable)("questions", {
    id: (0, pg_core_1.serial)().notNull().primaryKey(),
    title: (0, pg_core_1.varchar)("title", { length: 200 }).notNull(),
    content: (0, pg_core_1.text)("content").notNull(),
    correctAnswer: (0, pg_core_1.text)("correct_answer").notNull(),
    scoringCriteria: (0, pg_core_1.text)("scoring_criteria").notNull(),
    difficulty: (0, pg_core_1.integer)("difficulty").default(1).notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
exports.healthCheck = (0, pg_core_1.pgTable)("health_check", {
    id: (0, pg_core_1.serial)().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
});
const { createInsertSchema: createCoercedInsertSchema } = (0, drizzle_zod_1.createSchemaFactory)({
    coerce: { date: true },
});
exports.insertUserSchema = createCoercedInsertSchema(exports.users).pick({
    studentId: true,
    name: true,
});
exports.insertQuestionSchema = createCoercedInsertSchema(exports.questions).pick({
    title: true,
    content: true,
    correctAnswer: true,
    scoringCriteria: true,
    difficulty: true,
});
//# sourceMappingURL=schema.js.map