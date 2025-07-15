import { users, employees, type User, type InsertUser, type Employee, type InsertEmployee } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Employee methods
  getAllEmployees(): Promise<Employee[]>;
  getEmployeeById(id: string): Promise<Employee | undefined>;
  getEmployeeByNik(nik: string): Promise<Employee | undefined>;
  createEmployee(employee: Omit<InsertEmployee, 'id'>): Promise<Employee>;
  updateEmployee(id: string, employee: Partial<InsertEmployee>): Promise<Employee | undefined>;
  deleteEmployee(id: string): Promise<boolean>;
  bulkCreateEmployees(employees: Omit<InsertEmployee, 'id'>[]): Promise<Employee[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private employees: Map<string, Employee>;
  currentUserId: number;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.currentUserId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Employee methods
  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    return this.employees.get(id);
  }

  async getEmployeeByNik(nik: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(emp => emp.nik === nik);
  }

  async createEmployee(employeeData: Omit<InsertEmployee, 'id'>): Promise<Employee> {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const employee: Employee = { 
      ...employeeData, 
      id,
      statusI: employeeData.statusI ?? null,
      statusII: employeeData.statusII ?? null,
      suratPeringatan: employeeData.suratPeringatan || []
    };
    this.employees.set(id, employee);
    return employee;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const existing = this.employees.get(id);
    if (!existing) return undefined;
    
    const updated: Employee = { ...existing, ...updates };
    this.employees.set(id, updated);
    return updated;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    return this.employees.delete(id);
  }

  async bulkCreateEmployees(employeesData: Omit<InsertEmployee, 'id'>[]): Promise<Employee[]> {
    const createdEmployees: Employee[] = [];
    
    for (const empData of employeesData) {
      const employee = await this.createEmployee(empData);
      createdEmployees.push(employee);
    }
    
    return createdEmployees;
  }
}

export const storage = new MemStorage();
