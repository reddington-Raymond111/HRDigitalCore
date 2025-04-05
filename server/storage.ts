import {
  departments, InsertDepartment, Department,
  positions, InsertPosition, Position,
  employees, InsertEmployee, Employee,
  contracts, InsertContract, Contract,
  documents, InsertDocument, Document,
  compensations, InsertCompensation, Compensation,
  benefits, InsertBenefit, Benefit,
  workflows, InsertWorkflow, Workflow,
  workflowInstances, InsertWorkflowInstance, WorkflowInstance,
  users, InsertUser, User
} from "@shared/schema";

export interface IStorage {
  // User Management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Department Management
  getDepartment(id: number): Promise<Department | undefined>;
  getDepartments(): Promise<Department[]>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department | undefined>;
  deleteDepartment(id: number): Promise<boolean>;
  
  // Position Management
  getPosition(id: number): Promise<Position | undefined>;
  getPositions(): Promise<Position[]>;
  getPositionsByDepartment(departmentId: number): Promise<Position[]>;
  createPosition(position: InsertPosition): Promise<Position>;
  updatePosition(id: number, position: Partial<InsertPosition>): Promise<Position | undefined>;
  deletePosition(id: number): Promise<boolean>;
  
  // Employee Management
  getEmployee(id: number): Promise<Employee | undefined>;
  getEmployees(): Promise<Employee[]>;
  getEmployeesByDepartment(departmentId: number): Promise<Employee[]>;
  getEmployeesByPosition(positionId: number): Promise<Employee[]>;
  getEmployeesByManager(managerId: number): Promise<Employee[]>;
  createEmployee(employee: InsertEmployee): Promise<Employee>;
  updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: number): Promise<boolean>;
  
  // Contract Management
  getContract(id: number): Promise<Contract | undefined>;
  getContracts(): Promise<Contract[]>;
  getContractsByEmployee(employeeId: number): Promise<Contract[]>;
  getContractsForRenewal(days: number): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined>;
  deleteContract(id: number): Promise<boolean>;
  
  // Document Management
  getDocument(id: number): Promise<Document | undefined>;
  getDocuments(): Promise<Document[]>;
  getDocumentsByEmployee(employeeId: number): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<boolean>;
  
  // Compensation Management
  getCompensation(id: number): Promise<Compensation | undefined>;
  getCompensations(): Promise<Compensation[]>;
  getCompensationsByEmployee(employeeId: number): Promise<Compensation[]>;
  createCompensation(compensation: InsertCompensation): Promise<Compensation>;
  updateCompensation(id: number, compensation: Partial<InsertCompensation>): Promise<Compensation | undefined>;
  deleteCompensation(id: number): Promise<boolean>;
  
  // Benefit Management
  getBenefit(id: number): Promise<Benefit | undefined>;
  getBenefits(): Promise<Benefit[]>;
  getBenefitsByEmployee(employeeId: number): Promise<Benefit[]>;
  createBenefit(benefit: InsertBenefit): Promise<Benefit>;
  updateBenefit(id: number, benefit: Partial<InsertBenefit>): Promise<Benefit | undefined>;
  deleteBenefit(id: number): Promise<boolean>;
  
  // Workflow Management
  getWorkflow(id: number): Promise<Workflow | undefined>;
  getWorkflows(): Promise<Workflow[]>;
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined>;
  deleteWorkflow(id: number): Promise<boolean>;
  
  // Workflow Instance Management
  getWorkflowInstance(id: number): Promise<WorkflowInstance | undefined>;
  getWorkflowInstances(): Promise<WorkflowInstance[]>;
  getWorkflowInstancesByEmployee(employeeId: number): Promise<WorkflowInstance[]>;
  getWorkflowInstancesByStatus(status: string): Promise<WorkflowInstance[]>;
  createWorkflowInstance(workflowInstance: InsertWorkflowInstance): Promise<WorkflowInstance>;
  updateWorkflowInstance(id: number, workflowInstance: Partial<InsertWorkflowInstance>): Promise<WorkflowInstance | undefined>;
  deleteWorkflowInstance(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private departments: Map<number, Department>;
  private positions: Map<number, Position>;
  private employees: Map<number, Employee>;
  private contracts: Map<number, Contract>;
  private documents: Map<number, Document>;
  private compensations: Map<number, Compensation>;
  private benefits: Map<number, Benefit>;
  private workflows: Map<number, Workflow>;
  private workflowInstances: Map<number, WorkflowInstance>;
  
  private userId: number;
  private departmentId: number;
  private positionId: number;
  private employeeId: number;
  private contractId: number;
  private documentId: number;
  private compensationId: number;
  private benefitId: number;
  private workflowId: number;
  private workflowInstanceId: number;
  
  constructor() {
    this.users = new Map();
    this.departments = new Map();
    this.positions = new Map();
    this.employees = new Map();
    this.contracts = new Map();
    this.documents = new Map();
    this.compensations = new Map();
    this.benefits = new Map();
    this.workflows = new Map();
    this.workflowInstances = new Map();
    
    this.userId = 1;
    this.departmentId = 1;
    this.positionId = 1;
    this.employeeId = 1;
    this.contractId = 1;
    this.documentId = 1;
    this.compensationId = 1;
    this.benefitId = 1;
    this.workflowId = 1;
    this.workflowInstanceId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }
  
  private initializeData() {
    // Add an HR Manager user
    this.createUser({
      username: "hrmanager",
      password: "password123", // In real app, this would be hashed
      role: "hr_manager",
      employeeId: null,
      isActive: true
    });
    
    // Add departments
    const executiveDept = this.createDepartment({
      name: "Executive",
      description: "Executive leadership team",
      parentId: null
    });
    
    const hrDept = this.createDepartment({
      name: "Human Resources",
      description: "HR department",
      parentId: null
    });
    
    const engineeringDept = this.createDepartment({
      name: "Engineering",
      description: "Engineering department",
      parentId: null
    });
    
    const designDept = this.createDepartment({
      name: "Design",
      description: "Design department",
      parentId: null
    });
    
    const marketingDept = this.createDepartment({
      name: "Marketing",
      description: "Marketing department",
      parentId: null
    });
    
    const financeDept = this.createDepartment({
      name: "Finance",
      description: "Finance department",
      parentId: null
    });
    
    // Add positions
    const ceoPosition = this.createPosition({
      title: "Chief Executive Officer",
      description: "CEO position",
      departmentId: executiveDept.id,
      payscaleMin: 150000,
      payscaleMax: 300000
    });
    
    const ctoPosition = this.createPosition({
      title: "Chief Technology Officer",
      description: "CTO position",
      departmentId: executiveDept.id,
      payscaleMin: 140000,
      payscaleMax: 250000
    });
    
    const cooPosition = this.createPosition({
      title: "Chief Operations Officer",
      description: "COO position",
      departmentId: executiveDept.id,
      payscaleMin: 140000,
      payscaleMax: 250000
    });
    
    const cfoPosition = this.createPosition({
      title: "Chief Financial Officer",
      description: "CFO position",
      departmentId: executiveDept.id,
      payscaleMin: 140000,
      payscaleMax: 250000
    });
    
    const hrManagerPosition = this.createPosition({
      title: "HR Manager",
      description: "HR Manager position",
      departmentId: hrDept.id,
      payscaleMin: 90000,
      payscaleMax: 120000
    });
    
    const fullstackPosition = this.createPosition({
      title: "Full Stack Developer",
      description: "Full Stack Developer position",
      departmentId: engineeringDept.id,
      payscaleMin: 80000,
      payscaleMax: 130000
    });
    
    const uxPosition = this.createPosition({
      title: "UX Designer",
      description: "UX Designer position",
      departmentId: designDept.id,
      payscaleMin: 75000,
      payscaleMax: 110000
    });
    
    const marketingPosition = this.createPosition({
      title: "Marketing Specialist",
      description: "Marketing Specialist position",
      departmentId: marketingDept.id,
      payscaleMin: 65000,
      payscaleMax: 95000
    });
    
    const financePosition = this.createPosition({
      title: "Financial Analyst",
      description: "Financial Analyst position",
      departmentId: financeDept.id,
      payscaleMin: 70000,
      payscaleMax: 100000
    });
    
    // Add employees
    const ceoEmployee = this.createEmployee({
      firstName: "Sarah",
      lastName: "Chen",
      email: "sarah.chen@example.com",
      phone: "555-123-4567",
      positionId: ceoPosition.id,
      managerId: null,
      hireDate: new Date("2020-01-15"),
      status: "active"
    });
    
    const ctoEmployee = this.createEmployee({
      firstName: "Michael",
      lastName: "Rodriguez",
      email: "michael.rodriguez@example.com",
      phone: "555-234-5678",
      positionId: ctoPosition.id,
      managerId: ceoEmployee.id,
      hireDate: new Date("2020-02-01"),
      status: "active"
    });
    
    const cooEmployee = this.createEmployee({
      firstName: "Jennifer",
      lastName: "Smith",
      email: "jennifer.smith@example.com",
      phone: "555-345-6789",
      positionId: cooPosition.id,
      managerId: ceoEmployee.id,
      hireDate: new Date("2020-02-15"),
      status: "active"
    });
    
    const cfoEmployee = this.createEmployee({
      firstName: "David",
      lastName: "Johnson",
      email: "david.johnson@example.com",
      phone: "555-456-7890",
      positionId: cfoPosition.id,
      managerId: ceoEmployee.id,
      hireDate: new Date("2020-03-01"),
      status: "active"
    });
    
    const hrManagerEmployee = this.createEmployee({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      phone: "555-567-8901",
      positionId: hrManagerPosition.id,
      managerId: cooEmployee.id,
      hireDate: new Date("2020-03-15"),
      status: "active"
    });
    
    const developerEmployee = this.createEmployee({
      firstName: "Alex",
      lastName: "Kim",
      email: "alex.kim@example.com",
      phone: "555-678-9012",
      positionId: fullstackPosition.id,
      managerId: ctoEmployee.id,
      hireDate: new Date("2023-10-15"),
      status: "active"
    });
    
    const designerEmployee = this.createEmployee({
      firstName: "Maria",
      lastName: "Lopez",
      email: "maria.lopez@example.com",
      phone: "555-789-0123",
      positionId: uxPosition.id,
      managerId: ctoEmployee.id,
      hireDate: new Date("2023-10-12"),
      status: "onboarding"
    });
    
    const marketingEmployee = this.createEmployee({
      firstName: "James",
      lastName: "Taylor",
      email: "james.taylor@example.com",
      phone: "555-890-1234",
      positionId: marketingPosition.id,
      managerId: cooEmployee.id,
      hireDate: new Date("2023-10-05"),
      status: "active"
    });
    
    const financeEmployee = this.createEmployee({
      firstName: "Rebecca",
      lastName: "Park",
      email: "rebecca.park@example.com",
      phone: "555-901-2345",
      positionId: financePosition.id,
      managerId: cfoEmployee.id,
      hireDate: new Date("2023-09-28"),
      status: "active"
    });
    
    // Add contracts
    this.createContract({
      employeeId: ceoEmployee.id,
      contractType: "permanent",
      startDate: new Date("2020-01-15"),
      salary: 250000,
      status: "active"
    });
    
    this.createContract({
      employeeId: ctoEmployee.id,
      contractType: "permanent",
      startDate: new Date("2020-02-01"),
      salary: 200000,
      status: "active"
    });
    
    this.createContract({
      employeeId: cooEmployee.id,
      contractType: "permanent",
      startDate: new Date("2020-02-15"),
      salary: 200000,
      status: "active"
    });
    
    this.createContract({
      employeeId: cfoEmployee.id,
      contractType: "permanent",
      startDate: new Date("2020-03-01"),
      salary: 200000,
      status: "active"
    });
    
    this.createContract({
      employeeId: hrManagerEmployee.id,
      contractType: "permanent",
      startDate: new Date("2020-03-15"),
      salary: 110000,
      status: "active"
    });
    
    this.createContract({
      employeeId: developerEmployee.id,
      contractType: "permanent",
      startDate: new Date("2023-10-15"),
      salary: 95000,
      status: "active"
    });
    
    this.createContract({
      employeeId: designerEmployee.id,
      contractType: "temporary",
      startDate: new Date("2023-10-12"),
      endDate: new Date("2024-10-12"),
      salary: 85000,
      status: "active"
    });
    
    this.createContract({
      employeeId: marketingEmployee.id,
      contractType: "permanent",
      startDate: new Date("2023-10-05"),
      salary: 75000,
      status: "active"
    });
    
    this.createContract({
      employeeId: financeEmployee.id,
      contractType: "permanent",
      startDate: new Date("2023-09-28"),
      renewalDate: new Date("2023-11-15"),
      salary: 80000,
      status: "active"
    });
    
    // Add workflows
    const onboardingWorkflow = this.createWorkflow({
      name: "Employee Onboarding",
      description: "Process for onboarding new employees",
      steps: [
        { id: 1, name: "Document Collection", approver: hrManagerEmployee.id },
        { id: 2, name: "Equipment Setup", approver: ctoEmployee.id },
        { id: 3, name: "Training Assignment", approver: null }
      ],
      createdBy: hrManagerEmployee.id
    });
    
    const promotionWorkflow = this.createWorkflow({
      name: "Promotion Request",
      description: "Process for requesting employee promotions",
      steps: [
        { id: 1, name: "Manager Approval", approver: null },
        { id: 2, name: "HR Review", approver: hrManagerEmployee.id },
        { id: 3, name: "Executive Approval", approver: ceoEmployee.id }
      ],
      createdBy: hrManagerEmployee.id
    });
    
    // Add workflow instances
    this.createWorkflowInstance({
      workflowId: onboardingWorkflow.id,
      employeeId: designerEmployee.id,
      currentStep: 1,
      status: "pending",
      data: {
        startDate: "2023-10-12",
        manager: ctoEmployee.id,
        documents: ["ID", "Resume", "Education"]
      }
    });
    
    this.createWorkflowInstance({
      workflowId: promotionWorkflow.id,
      employeeId: designerEmployee.id,
      currentStep: 0,
      status: "pending",
      data: {
        currentPosition: uxPosition.id,
        requestedPosition: "Senior UX Designer",
        reason: "Outstanding performance on recent projects"
      }
    });
  }
  
  // User Management
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Department Management
  async getDepartment(id: number): Promise<Department | undefined> {
    return this.departments.get(id);
  }
  
  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }
  
  async createDepartment(department: InsertDepartment): Promise<Department> {
    const id = this.departmentId++;
    const newDepartment: Department = { ...department, id };
    this.departments.set(id, newDepartment);
    return newDepartment;
  }
  
  async updateDepartment(id: number, department: Partial<InsertDepartment>): Promise<Department | undefined> {
    const existingDepartment = this.departments.get(id);
    if (!existingDepartment) return undefined;
    
    const updatedDepartment: Department = { ...existingDepartment, ...department };
    this.departments.set(id, updatedDepartment);
    return updatedDepartment;
  }
  
  async deleteDepartment(id: number): Promise<boolean> {
    return this.departments.delete(id);
  }
  
  // Position Management
  async getPosition(id: number): Promise<Position | undefined> {
    return this.positions.get(id);
  }
  
  async getPositions(): Promise<Position[]> {
    return Array.from(this.positions.values());
  }
  
  async getPositionsByDepartment(departmentId: number): Promise<Position[]> {
    return Array.from(this.positions.values()).filter(
      (position) => position.departmentId === departmentId
    );
  }
  
  async createPosition(position: InsertPosition): Promise<Position> {
    const id = this.positionId++;
    const newPosition: Position = { ...position, id };
    this.positions.set(id, newPosition);
    return newPosition;
  }
  
  async updatePosition(id: number, position: Partial<InsertPosition>): Promise<Position | undefined> {
    const existingPosition = this.positions.get(id);
    if (!existingPosition) return undefined;
    
    const updatedPosition: Position = { ...existingPosition, ...position };
    this.positions.set(id, updatedPosition);
    return updatedPosition;
  }
  
  async deletePosition(id: number): Promise<boolean> {
    return this.positions.delete(id);
  }
  
  // Employee Management
  async getEmployee(id: number): Promise<Employee | undefined> {
    return this.employees.get(id);
  }
  
  async getEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }
  
  async getEmployeesByDepartment(departmentId: number): Promise<Employee[]> {
    const positions = await this.getPositionsByDepartment(departmentId);
    const positionIds = positions.map(p => p.id);
    
    return Array.from(this.employees.values()).filter(
      (employee) => employee.positionId !== null && positionIds.includes(employee.positionId)
    );
  }
  
  async getEmployeesByPosition(positionId: number): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(
      (employee) => employee.positionId === positionId
    );
  }
  
  async getEmployeesByManager(managerId: number): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(
      (employee) => employee.managerId === managerId
    );
  }
  
  async createEmployee(employee: InsertEmployee): Promise<Employee> {
    const id = this.employeeId++;
    const newEmployee: Employee = { ...employee, id };
    this.employees.set(id, newEmployee);
    return newEmployee;
  }
  
  async updateEmployee(id: number, employee: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const existingEmployee = this.employees.get(id);
    if (!existingEmployee) return undefined;
    
    const updatedEmployee: Employee = { ...existingEmployee, ...employee };
    this.employees.set(id, updatedEmployee);
    return updatedEmployee;
  }
  
  async deleteEmployee(id: number): Promise<boolean> {
    return this.employees.delete(id);
  }
  
  // Contract Management
  async getContract(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }
  
  async getContracts(): Promise<Contract[]> {
    return Array.from(this.contracts.values());
  }
  
  async getContractsByEmployee(employeeId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(
      (contract) => contract.employeeId === employeeId
    );
  }
  
  async getContractsForRenewal(days: number): Promise<Contract[]> {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);
    
    return Array.from(this.contracts.values()).filter(contract => {
      if (!contract.renewalDate) return false;
      
      const renewalDate = new Date(contract.renewalDate);
      return renewalDate >= today && renewalDate <= futureDate;
    });
  }
  
  async createContract(contract: InsertContract): Promise<Contract> {
    const id = this.contractId++;
    const newContract: Contract = { ...contract, id };
    this.contracts.set(id, newContract);
    return newContract;
  }
  
  async updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined> {
    const existingContract = this.contracts.get(id);
    if (!existingContract) return undefined;
    
    const updatedContract: Contract = { ...existingContract, ...contract };
    this.contracts.set(id, updatedContract);
    return updatedContract;
  }
  
  async deleteContract(id: number): Promise<boolean> {
    return this.contracts.delete(id);
  }
  
  // Document Management
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async getDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values());
  }
  
  async getDocumentsByEmployee(employeeId: number): Promise<Document[]> {
    return Array.from(this.documents.values()).filter(
      (document) => document.employeeId === employeeId
    );
  }
  
  async createDocument(document: InsertDocument): Promise<Document> {
    const id = this.documentId++;
    const uploadDate = new Date();
    const newDocument: Document = { ...document, id, uploadDate };
    this.documents.set(id, newDocument);
    return newDocument;
  }
  
  async updateDocument(id: number, document: Partial<InsertDocument>): Promise<Document | undefined> {
    const existingDocument = this.documents.get(id);
    if (!existingDocument) return undefined;
    
    const updatedDocument: Document = { ...existingDocument, ...document };
    this.documents.set(id, updatedDocument);
    return updatedDocument;
  }
  
  async deleteDocument(id: number): Promise<boolean> {
    return this.documents.delete(id);
  }
  
  // Compensation Management
  async getCompensation(id: number): Promise<Compensation | undefined> {
    return this.compensations.get(id);
  }
  
  async getCompensations(): Promise<Compensation[]> {
    return Array.from(this.compensations.values());
  }
  
  async getCompensationsByEmployee(employeeId: number): Promise<Compensation[]> {
    return Array.from(this.compensations.values()).filter(
      (compensation) => compensation.employeeId === employeeId
    );
  }
  
  async createCompensation(compensation: InsertCompensation): Promise<Compensation> {
    const id = this.compensationId++;
    const newCompensation: Compensation = { ...compensation, id };
    this.compensations.set(id, newCompensation);
    return newCompensation;
  }
  
  async updateCompensation(id: number, compensation: Partial<InsertCompensation>): Promise<Compensation | undefined> {
    const existingCompensation = this.compensations.get(id);
    if (!existingCompensation) return undefined;
    
    const updatedCompensation: Compensation = { ...existingCompensation, ...compensation };
    this.compensations.set(id, updatedCompensation);
    return updatedCompensation;
  }
  
  async deleteCompensation(id: number): Promise<boolean> {
    return this.compensations.delete(id);
  }
  
  // Benefit Management
  async getBenefit(id: number): Promise<Benefit | undefined> {
    return this.benefits.get(id);
  }
  
  async getBenefits(): Promise<Benefit[]> {
    return Array.from(this.benefits.values());
  }
  
  async getBenefitsByEmployee(employeeId: number): Promise<Benefit[]> {
    return Array.from(this.benefits.values()).filter(
      (benefit) => benefit.employeeId === employeeId
    );
  }
  
  async createBenefit(benefit: InsertBenefit): Promise<Benefit> {
    const id = this.benefitId++;
    const newBenefit: Benefit = { ...benefit, id };
    this.benefits.set(id, newBenefit);
    return newBenefit;
  }
  
  async updateBenefit(id: number, benefit: Partial<InsertBenefit>): Promise<Benefit | undefined> {
    const existingBenefit = this.benefits.get(id);
    if (!existingBenefit) return undefined;
    
    const updatedBenefit: Benefit = { ...existingBenefit, ...benefit };
    this.benefits.set(id, updatedBenefit);
    return updatedBenefit;
  }
  
  async deleteBenefit(id: number): Promise<boolean> {
    return this.benefits.delete(id);
  }
  
  // Workflow Management
  async getWorkflow(id: number): Promise<Workflow | undefined> {
    return this.workflows.get(id);
  }
  
  async getWorkflows(): Promise<Workflow[]> {
    return Array.from(this.workflows.values());
  }
  
  async createWorkflow(workflow: InsertWorkflow): Promise<Workflow> {
    const id = this.workflowId++;
    const newWorkflow: Workflow = { ...workflow, id };
    this.workflows.set(id, newWorkflow);
    return newWorkflow;
  }
  
  async updateWorkflow(id: number, workflow: Partial<InsertWorkflow>): Promise<Workflow | undefined> {
    const existingWorkflow = this.workflows.get(id);
    if (!existingWorkflow) return undefined;
    
    const updatedWorkflow: Workflow = { ...existingWorkflow, ...workflow };
    this.workflows.set(id, updatedWorkflow);
    return updatedWorkflow;
  }
  
  async deleteWorkflow(id: number): Promise<boolean> {
    return this.workflows.delete(id);
  }
  
  // Workflow Instance Management
  async getWorkflowInstance(id: number): Promise<WorkflowInstance | undefined> {
    return this.workflowInstances.get(id);
  }
  
  async getWorkflowInstances(): Promise<WorkflowInstance[]> {
    return Array.from(this.workflowInstances.values());
  }
  
  async getWorkflowInstancesByEmployee(employeeId: number): Promise<WorkflowInstance[]> {
    return Array.from(this.workflowInstances.values()).filter(
      (instance) => instance.employeeId === employeeId
    );
  }
  
  async getWorkflowInstancesByStatus(status: string): Promise<WorkflowInstance[]> {
    return Array.from(this.workflowInstances.values()).filter(
      (instance) => instance.status === status
    );
  }
  
  async createWorkflowInstance(workflowInstance: InsertWorkflowInstance): Promise<WorkflowInstance> {
    const id = this.workflowInstanceId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const newWorkflowInstance: WorkflowInstance = { ...workflowInstance, id, createdAt, updatedAt };
    this.workflowInstances.set(id, newWorkflowInstance);
    return newWorkflowInstance;
  }
  
  async updateWorkflowInstance(id: number, workflowInstance: Partial<InsertWorkflowInstance>): Promise<WorkflowInstance | undefined> {
    const existingWorkflowInstance = this.workflowInstances.get(id);
    if (!existingWorkflowInstance) return undefined;
    
    const updatedAt = new Date();
    const updatedWorkflowInstance: WorkflowInstance = { 
      ...existingWorkflowInstance, 
      ...workflowInstance, 
      updatedAt 
    };
    this.workflowInstances.set(id, updatedWorkflowInstance);
    return updatedWorkflowInstance;
  }
  
  async deleteWorkflowInstance(id: number): Promise<boolean> {
    return this.workflowInstances.delete(id);
  }
}

export const storage = new MemStorage();
