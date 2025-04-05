// Database Types (Corresponding to schema.ts)
export type Department = {
  id: number;
  name: string;
  description?: string | null;
  parentId?: number | null;
};

export type Position = {
  id: number;
  title: string;
  description?: string | null;
  departmentId: number;
  payscaleMin?: number | null;
  payscaleMax?: number | null;
};

export type Employee = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  dateOfBirth?: Date | string | null;
  emergencyContact?: string | null;
  positionId?: number | null;
  managerId?: number | null;
  hireDate?: Date | string | null;
  status?: string;
  profilePicture?: string | null;
};

export type Contract = {
  id: number;
  employeeId: number;
  contractType: string;
  startDate: Date | string;
  endDate?: Date | string | null;
  salary?: number | null;
  currency?: string;
  documents?: string | null;
  renewalDate?: Date | string | null;
  status?: string;
};

export type Document = {
  id: number;
  employeeId: number;
  name: string;
  type: string;
  path: string;
  uploadDate: Date | string;
  expiryDate?: Date | string | null;
};

export type Compensation = {
  id: number;
  employeeId: number;
  effectiveDate: Date | string;
  salary: number;
  currency?: string;
  reason?: string | null;
  approvedBy?: number | null;
};

export type Benefit = {
  id: number;
  employeeId: number;
  benefitType: string;
  provider?: string | null;
  policyNumber?: string | null;
  startDate: Date | string;
  endDate?: Date | string | null;
  amount?: number | null;
  frequency?: string | null;
  details?: Record<string, any> | null;
};

export type Workflow = {
  id: number;
  name: string;
  description?: string | null;
  steps: WorkflowStep[];
  createdBy?: number | null;
};

export type WorkflowStep = {
  id: number;
  name: string;
  approver?: number | null;
};

export type WorkflowInstance = {
  id: number;
  workflowId: number;
  employeeId?: number | null;
  currentStep: number;
  status: string;
  data?: Record<string, any> | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

export type User = {
  id: number;
  username: string;
  password: string;
  employeeId?: number | null;
  role: string;
  isActive: boolean;
};

// Dashboard Types
export type DashboardSummary = {
  totalEmployees: number;
  newHires: number;
  pendingApprovals: number;
  contractRenewals: number;
};

export type OrgChartNode = {
  id: number;
  name: string;
  position: string;
  department?: string;
  managerId: number | null;
  level: number;
};

// Form Types
export type EmployeeFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  positionId?: string;
  managerId?: string;
  hireDate?: string;
  status?: string;
  profilePicture?: string;
};

export type ContractFormData = {
  employeeId: string;
  contractType: string;
  startDate: string;
  endDate?: string;
  salary?: string;
  currency?: string;
  documents?: string;
  renewalDate?: string;
  status?: string;
};

export type BenefitFormData = {
  employeeId: string;
  benefitType: string;
  provider?: string;
  policyNumber?: string;
  startDate: string;
  endDate?: string;
  amount?: string;
  frequency?: string;
  details?: string;
};

export type WorkflowFormData = {
  name: string;
  description?: string;
  steps: WorkflowStepFormData[];
};

export type WorkflowStepFormData = {
  id: number;
  name: string;
  approver?: string;
};

// Settings Types
export type AppSettings = {
  companyName: string;
  companyLogo?: string;
  currency: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  timezone: string;
  fiscalYearStart: string;
};

export type NotificationSettings = {
  emailNotifications: boolean;
  contractRenewalNotice: number;
  documentExpiryNotice: number;
  birthdayReminders: boolean;
  workAnniversaries: boolean;
};

export type SecuritySettings = {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
  };
  twoFactorAuth: boolean;
  sessionTimeout: number;
};
