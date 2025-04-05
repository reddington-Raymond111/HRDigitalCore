import { pgTable, text, serial, integer, date, boolean, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Department Schema
export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  parentId: integer("parent_id").references(() => departments.id),
});

export const insertDepartmentSchema = createInsertSchema(departments).omit({
  id: true,
});

// Position Schema
export const positions = pgTable("positions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  departmentId: integer("department_id").references(() => departments.id).notNull(),
  payscaleMin: integer("payscale_min"),
  payscaleMax: integer("payscale_max"),
});

export const insertPositionSchema = createInsertSchema(positions).omit({
  id: true,
});

// Employee Schema
export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  address: text("address"),
  dateOfBirth: date("date_of_birth"),
  emergencyContact: text("emergency_contact"),
  positionId: integer("position_id").references(() => positions.id),
  managerId: integer("manager_id").references(() => employees.id),
  hireDate: date("hire_date"),
  status: text("status").default("active"), // active, inactive, onboarding, terminated
  profilePicture: text("profile_picture"),
});

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
});

// Contract Schema
export const contracts = pgTable("contracts", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  contractType: text("contract_type").notNull(), // permanent, temporary, contractor
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  salary: integer("salary"),
  currency: text("currency").default("USD"),
  documents: text("documents"), // URL to document
  renewalDate: date("renewal_date"),
  status: text("status").default("active"), // active, pending, terminated
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
});

// Document Schema
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  name: text("name").notNull(),
  type: text("type").notNull(), // contract, id, certificate, etc.
  path: text("path").notNull(), // URL to document
  uploadDate: timestamp("upload_date").defaultNow(),
  expiryDate: date("expiry_date"),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadDate: true,
});

// Compensation Schema
export const compensations = pgTable("compensations", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  effectiveDate: date("effective_date").notNull(),
  salary: integer("salary").notNull(),
  currency: text("currency").default("USD"),
  reason: text("reason"), // promotion, annual review, etc.
  approvedBy: integer("approved_by").references(() => employees.id),
});

export const insertCompensationSchema = createInsertSchema(compensations).omit({
  id: true,
});

// Benefits Schema
export const benefits = pgTable("benefits", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").references(() => employees.id).notNull(),
  benefitType: text("benefit_type").notNull(), // health, retirement, etc.
  provider: text("provider"),
  policyNumber: text("policy_number"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date"),
  amount: integer("amount"),
  frequency: text("frequency"), // monthly, yearly, etc.
  details: json("details"),
});

export const insertBenefitSchema = createInsertSchema(benefits).omit({
  id: true,
});

// Workflow Schema
export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  steps: json("steps").notNull(),
  createdBy: integer("created_by").references(() => employees.id),
});

export const insertWorkflowSchema = createInsertSchema(workflows).omit({
  id: true,
});

// Workflow Instance Schema
export const workflowInstances = pgTable("workflow_instances", {
  id: serial("id").primaryKey(),
  workflowId: integer("workflow_id").references(() => workflows.id).notNull(),
  employeeId: integer("employee_id").references(() => employees.id),
  currentStep: integer("current_step").default(0),
  status: text("status").default("pending"), // pending, approved, rejected
  data: json("data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkflowInstanceSchema = createInsertSchema(workflowInstances).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// User Schema (for authentication)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  employeeId: integer("employee_id").references(() => employees.id),
  role: text("role").default("user"), // admin, hr_manager, employee
  isActive: boolean("is_active").default(true),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

// Export types
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;

export type Position = typeof positions.$inferSelect;
export type InsertPosition = z.infer<typeof insertPositionSchema>;

export type Employee = typeof employees.$inferSelect;
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;

export type Contract = typeof contracts.$inferSelect;
export type InsertContract = z.infer<typeof insertContractSchema>;

export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type Compensation = typeof compensations.$inferSelect;
export type InsertCompensation = z.infer<typeof insertCompensationSchema>;

export type Benefit = typeof benefits.$inferSelect;
export type InsertBenefit = z.infer<typeof insertBenefitSchema>;

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;

export type WorkflowInstance = typeof workflowInstances.$inferSelect;
export type InsertWorkflowInstance = z.infer<typeof insertWorkflowInstanceSchema>;

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
