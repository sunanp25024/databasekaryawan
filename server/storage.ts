import { users, employees, type User, type InsertUser, type Employee, type InsertEmployee } from "@shared/schema";
import { eq } from "drizzle-orm";
import { isDatabaseAvailable } from "./db";

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
      namaPic: employeeData.namaPic ?? null,
      source: employeeData.source ?? null,
      tglJoint: employeeData.tglJoint ?? null,
      tglEoc: employeeData.tglEoc ?? null,
      statusI: employeeData.statusI ?? null,
      statusII: employeeData.statusII ?? null,
      tglResign: employeeData.tglResign ?? null,
      reasonResign: employeeData.reasonResign ?? null,
      pkwt: employeeData.pkwt ?? null,
      noPkwt: employeeData.noPkwt ?? null,
      bpjsKetenagakerjaan: employeeData.bpjsKetenagakerjaan ?? null,
      bpjsKesehatan: employeeData.bpjsKesehatan ?? null,
      bank: employeeData.bank ?? null,
      noRekening: employeeData.noRekening ?? null,
      namaPenerima: employeeData.namaPenerima ?? null,
      alamatEmail: employeeData.alamatEmail ?? null,
      noTelp: employeeData.noTelp ?? null,
      jenisKelamin: employeeData.jenisKelamin ?? null,
      pendidikanTerakhir: employeeData.pendidikanTerakhir ?? null,
      agama: employeeData.agama ?? null,
      kontrakKe: employeeData.kontrakKe ?? 1,
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

export class DatabaseStorage implements IStorage {
  private async getDb() {
    const { db, isDatabaseAvailable } = await import("./db");
    if (!isDatabaseAvailable || !db) {
      throw new Error("Database not available");
    }
    return db;
  }

  async getUser(id: number): Promise<User | undefined> {
    const db = await this.getDb();
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const db = await this.getDb();
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const db = await this.getDb();
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Employee methods
  async getAllEmployees(): Promise<Employee[]> {
    const db = await this.getDb();
    return await db.select().from(employees);
  }

  async getEmployeeById(id: string): Promise<Employee | undefined> {
    const db = await this.getDb();
    const [employee] = await db.select().from(employees).where(eq(employees.id, id));
    return employee || undefined;
  }

  async getEmployeeByNik(nik: string): Promise<Employee | undefined> {
    const db = await this.getDb();
    const [employee] = await db.select().from(employees).where(eq(employees.nik, nik));
    return employee || undefined;
  }

  async createEmployee(employeeData: Omit<InsertEmployee, 'id'>): Promise<Employee> {
    const db = await this.getDb();
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const [employee] = await db
      .insert(employees)
      .values({ ...employeeData, id })
      .returning();
    return employee;
  }

  async updateEmployee(id: string, updates: Partial<InsertEmployee>): Promise<Employee | undefined> {
    const db = await this.getDb();
    const [employee] = await db
      .update(employees)
      .set(updates)
      .where(eq(employees.id, id))
      .returning();
    return employee || undefined;
  }

  async deleteEmployee(id: string): Promise<boolean> {
    const db = await this.getDb();
    const result = await db.delete(employees).where(eq(employees.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async bulkCreateEmployees(employeesData: Omit<InsertEmployee, 'id'>[]): Promise<Employee[]> {
    const db = await this.getDb();
    const employeesWithIds = employeesData.map(empData => ({
      ...empData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    }));
    
    const createdEmployees = await db
      .insert(employees)
      .values(employeesWithIds)
      .returning();
    
    return createdEmployees;
  }
}

// Use memory storage by default, database storage when available
export const storage = isDatabaseAvailable ? new DatabaseStorage() : new MemStorage();
