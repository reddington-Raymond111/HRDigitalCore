import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertDepartmentSchema, 
  insertPositionSchema, 
  insertEmployeeSchema, 
  insertContractSchema, 
  insertDocumentSchema, 
  insertCompensationSchema, 
  insertBenefitSchema, 
  insertWorkflowSchema, 
  insertWorkflowInstanceSchema, 
  insertUserSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // In a real app, we would use JWT or session-based auth
      return res.status(200).json({
        id: user.id,
        username: user.username,
        role: user.role,
        employeeId: user.employeeId
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error during login" });
    }
  });
  
  // Department routes
  app.get("/api/departments", async (req: Request, res: Response) => {
    try {
      const departments = await storage.getDepartments();
      res.status(200).json(departments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching departments" });
    }
  });
  
  app.get("/api/departments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const department = await storage.getDepartment(id);
      
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      res.status(200).json(department);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching department" });
    }
  });
  
  app.post("/api/departments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDepartmentSchema.parse(req.body);
      const department = await storage.createDepartment(validatedData);
      res.status(201).json(department);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid department data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating department" });
    }
  });
  
  app.put("/api/departments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDepartmentSchema.partial().parse(req.body);
      const department = await storage.updateDepartment(id, validatedData);
      
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      res.status(200).json(department);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid department data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating department" });
    }
  });
  
  app.delete("/api/departments/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDepartment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting department" });
    }
  });
  
  // Position routes
  app.get("/api/positions", async (req: Request, res: Response) => {
    try {
      const departmentId = req.query.departmentId 
        ? parseInt(req.query.departmentId as string) 
        : undefined;
      
      const positions = departmentId 
        ? await storage.getPositionsByDepartment(departmentId) 
        : await storage.getPositions();
      
      res.status(200).json(positions);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching positions" });
    }
  });
  
  app.get("/api/positions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const position = await storage.getPosition(id);
      
      if (!position) {
        return res.status(404).json({ message: "Position not found" });
      }
      
      res.status(200).json(position);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching position" });
    }
  });
  
  app.post("/api/positions", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPositionSchema.parse(req.body);
      const position = await storage.createPosition(validatedData);
      res.status(201).json(position);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid position data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating position" });
    }
  });
  
  app.put("/api/positions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPositionSchema.partial().parse(req.body);
      const position = await storage.updatePosition(id, validatedData);
      
      if (!position) {
        return res.status(404).json({ message: "Position not found" });
      }
      
      res.status(200).json(position);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid position data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating position" });
    }
  });
  
  app.delete("/api/positions/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deletePosition(id);
      
      if (!success) {
        return res.status(404).json({ message: "Position not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting position" });
    }
  });
  
  // Employee routes
  app.get("/api/employees", async (req: Request, res: Response) => {
    try {
      const departmentId = req.query.departmentId 
        ? parseInt(req.query.departmentId as string) 
        : undefined;
      
      const positionId = req.query.positionId 
        ? parseInt(req.query.positionId as string) 
        : undefined;
      
      const managerId = req.query.managerId 
        ? parseInt(req.query.managerId as string) 
        : undefined;
      
      let employees;
      
      if (departmentId) {
        employees = await storage.getEmployeesByDepartment(departmentId);
      } else if (positionId) {
        employees = await storage.getEmployeesByPosition(positionId);
      } else if (managerId) {
        employees = await storage.getEmployeesByManager(managerId);
      } else {
        employees = await storage.getEmployees();
      }
      
      res.status(200).json(employees);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching employees" });
    }
  });
  
  app.get("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const employee = await storage.getEmployee(id);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.status(200).json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching employee" });
    }
  });
  
  app.post("/api/employees", async (req: Request, res: Response) => {
    try {
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid employee data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating employee" });
    }
  });
  
  app.put("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(id, validatedData);
      
      if (!employee) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.status(200).json(employee);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid employee data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating employee" });
    }
  });
  
  app.delete("/api/employees/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteEmployee(id);
      
      if (!success) {
        return res.status(404).json({ message: "Employee not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting employee" });
    }
  });
  
  // Contract routes
  app.get("/api/contracts", async (req: Request, res: Response) => {
    try {
      const employeeId = req.query.employeeId 
        ? parseInt(req.query.employeeId as string) 
        : undefined;
      
      const renewalDays = req.query.renewalDays 
        ? parseInt(req.query.renewalDays as string) 
        : undefined;
      
      let contracts;
      
      if (employeeId) {
        contracts = await storage.getContractsByEmployee(employeeId);
      } else if (renewalDays) {
        contracts = await storage.getContractsForRenewal(renewalDays);
      } else {
        contracts = await storage.getContracts();
      }
      
      res.status(200).json(contracts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching contracts" });
    }
  });
  
  app.get("/api/contracts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const contract = await storage.getContract(id);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.status(200).json(contract);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching contract" });
    }
  });
  
  app.post("/api/contracts", async (req: Request, res: Response) => {
    try {
      const validatedData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(validatedData);
      res.status(201).json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating contract" });
    }
  });
  
  app.put("/api/contracts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContractSchema.partial().parse(req.body);
      const contract = await storage.updateContract(id, validatedData);
      
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.status(200).json(contract);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid contract data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating contract" });
    }
  });
  
  app.delete("/api/contracts/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteContract(id);
      
      if (!success) {
        return res.status(404).json({ message: "Contract not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting contract" });
    }
  });
  
  // Document routes
  app.get("/api/documents", async (req: Request, res: Response) => {
    try {
      const employeeId = req.query.employeeId 
        ? parseInt(req.query.employeeId as string) 
        : undefined;
      
      const documents = employeeId 
        ? await storage.getDocumentsByEmployee(employeeId) 
        : await storage.getDocuments();
      
      res.status(200).json(documents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching documents" });
    }
  });
  
  app.get("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const document = await storage.getDocument(id);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(200).json(document);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching document" });
    }
  });
  
  app.post("/api/documents", async (req: Request, res: Response) => {
    try {
      const validatedData = insertDocumentSchema.parse(req.body);
      const document = await storage.createDocument(validatedData);
      res.status(201).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating document" });
    }
  });
  
  app.put("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertDocumentSchema.partial().parse(req.body);
      const document = await storage.updateDocument(id, validatedData);
      
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(200).json(document);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid document data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating document" });
    }
  });
  
  app.delete("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDocument(id);
      
      if (!success) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting document" });
    }
  });
  
  // Compensation routes
  app.get("/api/compensations", async (req: Request, res: Response) => {
    try {
      const employeeId = req.query.employeeId 
        ? parseInt(req.query.employeeId as string) 
        : undefined;
      
      const compensations = employeeId 
        ? await storage.getCompensationsByEmployee(employeeId) 
        : await storage.getCompensations();
      
      res.status(200).json(compensations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching compensations" });
    }
  });
  
  app.get("/api/compensations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const compensation = await storage.getCompensation(id);
      
      if (!compensation) {
        return res.status(404).json({ message: "Compensation not found" });
      }
      
      res.status(200).json(compensation);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching compensation" });
    }
  });
  
  app.post("/api/compensations", async (req: Request, res: Response) => {
    try {
      const validatedData = insertCompensationSchema.parse(req.body);
      const compensation = await storage.createCompensation(validatedData);
      res.status(201).json(compensation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid compensation data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating compensation" });
    }
  });
  
  app.put("/api/compensations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCompensationSchema.partial().parse(req.body);
      const compensation = await storage.updateCompensation(id, validatedData);
      
      if (!compensation) {
        return res.status(404).json({ message: "Compensation not found" });
      }
      
      res.status(200).json(compensation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid compensation data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating compensation" });
    }
  });
  
  app.delete("/api/compensations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteCompensation(id);
      
      if (!success) {
        return res.status(404).json({ message: "Compensation not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting compensation" });
    }
  });
  
  // Benefit routes
  app.get("/api/benefits", async (req: Request, res: Response) => {
    try {
      const employeeId = req.query.employeeId 
        ? parseInt(req.query.employeeId as string) 
        : undefined;
      
      const benefits = employeeId 
        ? await storage.getBenefitsByEmployee(employeeId) 
        : await storage.getBenefits();
      
      res.status(200).json(benefits);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching benefits" });
    }
  });
  
  app.get("/api/benefits/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const benefit = await storage.getBenefit(id);
      
      if (!benefit) {
        return res.status(404).json({ message: "Benefit not found" });
      }
      
      res.status(200).json(benefit);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching benefit" });
    }
  });
  
  app.post("/api/benefits", async (req: Request, res: Response) => {
    try {
      const validatedData = insertBenefitSchema.parse(req.body);
      const benefit = await storage.createBenefit(validatedData);
      res.status(201).json(benefit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid benefit data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating benefit" });
    }
  });
  
  app.put("/api/benefits/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBenefitSchema.partial().parse(req.body);
      const benefit = await storage.updateBenefit(id, validatedData);
      
      if (!benefit) {
        return res.status(404).json({ message: "Benefit not found" });
      }
      
      res.status(200).json(benefit);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid benefit data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating benefit" });
    }
  });
  
  app.delete("/api/benefits/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteBenefit(id);
      
      if (!success) {
        return res.status(404).json({ message: "Benefit not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting benefit" });
    }
  });
  
  // Workflow routes
  app.get("/api/workflows", async (req: Request, res: Response) => {
    try {
      const workflows = await storage.getWorkflows();
      res.status(200).json(workflows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching workflows" });
    }
  });
  
  app.get("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const workflow = await storage.getWorkflow(id);
      
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      
      res.status(200).json(workflow);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching workflow" });
    }
  });
  
  app.post("/api/workflows", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWorkflowSchema.parse(req.body);
      const workflow = await storage.createWorkflow(validatedData);
      res.status(201).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workflow data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating workflow" });
    }
  });
  
  app.put("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWorkflowSchema.partial().parse(req.body);
      const workflow = await storage.updateWorkflow(id, validatedData);
      
      if (!workflow) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      
      res.status(200).json(workflow);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workflow data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating workflow" });
    }
  });
  
  app.delete("/api/workflows/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWorkflow(id);
      
      if (!success) {
        return res.status(404).json({ message: "Workflow not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting workflow" });
    }
  });
  
  // Workflow Instance routes
  app.get("/api/workflow-instances", async (req: Request, res: Response) => {
    try {
      const employeeId = req.query.employeeId 
        ? parseInt(req.query.employeeId as string) 
        : undefined;
      
      const status = req.query.status as string;
      
      let instances;
      
      if (employeeId) {
        instances = await storage.getWorkflowInstancesByEmployee(employeeId);
      } else if (status) {
        instances = await storage.getWorkflowInstancesByStatus(status);
      } else {
        instances = await storage.getWorkflowInstances();
      }
      
      res.status(200).json(instances);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching workflow instances" });
    }
  });
  
  app.get("/api/workflow-instances/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const instance = await storage.getWorkflowInstance(id);
      
      if (!instance) {
        return res.status(404).json({ message: "Workflow instance not found" });
      }
      
      res.status(200).json(instance);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching workflow instance" });
    }
  });
  
  app.post("/api/workflow-instances", async (req: Request, res: Response) => {
    try {
      const validatedData = insertWorkflowInstanceSchema.parse(req.body);
      const instance = await storage.createWorkflowInstance(validatedData);
      res.status(201).json(instance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workflow instance data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error creating workflow instance" });
    }
  });
  
  app.put("/api/workflow-instances/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertWorkflowInstanceSchema.partial().parse(req.body);
      const instance = await storage.updateWorkflowInstance(id, validatedData);
      
      if (!instance) {
        return res.status(404).json({ message: "Workflow instance not found" });
      }
      
      res.status(200).json(instance);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid workflow instance data", errors: error.errors });
      }
      console.error(error);
      res.status(500).json({ message: "Server error updating workflow instance" });
    }
  });
  
  app.delete("/api/workflow-instances/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWorkflowInstance(id);
      
      if (!success) {
        return res.status(404).json({ message: "Workflow instance not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error deleting workflow instance" });
    }
  });
  
  // Dashboard summary routes
  app.get("/api/dashboard/summary", async (req: Request, res: Response) => {
    try {
      const employees = await storage.getEmployees();
      const pendingWorkflows = await storage.getWorkflowInstancesByStatus("pending");
      const contractsForRenewal = await storage.getContractsForRenewal(30);
      
      // Calculate new hires in the last 30 days
      const today = new Date();
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(today.getDate() - 30);
      
      const newHires = employees.filter(employee => {
        const hireDate = new Date(employee.hireDate as Date);
        return hireDate >= thirtyDaysAgo && hireDate <= today;
      });
      
      res.status(200).json({
        totalEmployees: employees.length,
        newHires: newHires.length,
        pendingApprovals: pendingWorkflows.length,
        contractRenewals: contractsForRenewal.length
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching dashboard summary" });
    }
  });
  
  // Dashboard employees routes
  app.get("/api/dashboard/employees", async (req: Request, res: Response) => {
    try {
      const employees = await storage.getEmployees();
      const recentEmployees = employees
        .sort((a, b) => {
          const dateA = new Date(a.hireDate as Date).getTime();
          const dateB = new Date(b.hireDate as Date).getTime();
          return dateB - dateA;
        })
        .slice(0, 4);
      
      // Fetch additional data for each employee
      const result = await Promise.all(
        recentEmployees.map(async (employee) => {
          const position = employee.positionId 
            ? await storage.getPosition(employee.positionId) 
            : null;
          
          return {
            ...employee,
            position: position ? position.title : "Unknown",
            department: position && position.departmentId 
              ? (await storage.getDepartment(position.departmentId))?.name 
              : "Unknown"
          };
        })
      );
      
      res.status(200).json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching dashboard employees" });
    }
  });
  
  // Organization chart routes
  app.get("/api/organization/chart", async (req: Request, res: Response) => {
    try {
      const employees = await storage.getEmployees();
      const positions = await storage.getPositions();
      const departments = await storage.getDepartments();
      
      // Construct a simplified org chart
      const orgChart = employees
        .filter(employee => employee.positionId)
        .map(employee => {
          const position = positions.find(p => p.id === employee.positionId);
          const department = position ? departments.find(d => d.id === position.departmentId) : null;
          
          return {
            id: employee.id,
            name: `${employee.firstName} ${employee.lastName}`,
            position: position ? position.title : "Unknown",
            department: department ? department.name : "Unknown",
            managerId: employee.managerId,
            level: position?.title.toLowerCase().includes("chief") ? 1 : 
                   position?.title.toLowerCase().includes("manager") ? 2 : 3
          };
        });
      
      res.status(200).json(orgChart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error fetching organization chart" });
    }
  });
  
  const httpServer = createServer(app);
  
  return httpServer;
}
