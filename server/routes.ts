import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEmployeeSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Employee routes
  app.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  app.get("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.getEmployeeById(req.params.id);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employee" });
    }
  });

  app.post("/api/employees", async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.parse(req.body);
      const employee = await storage.createEmployee(validatedData);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data", details: error });
    }
  });

  app.put("/api/employees/:id", async (req, res) => {
    try {
      const validatedData = insertEmployeeSchema.partial().parse(req.body);
      const employee = await storage.updateEmployee(req.params.id, validatedData);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data", details: error });
    }
  });

  app.delete("/api/employees/:id", async (req, res) => {
    try {
      const success = await storage.deleteEmployee(req.params.id);
      if (!success) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json({ message: "Employee deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete employee" });
    }
  });

  app.post("/api/employees/bulk", async (req, res) => {
    try {
      const { employees } = req.body;
      if (!Array.isArray(employees)) {
        return res.status(400).json({ error: "Employees must be an array" });
      }
      
      const validatedEmployees = employees.map(emp => insertEmployeeSchema.parse(emp));
      const createdEmployees = await storage.bulkCreateEmployees(validatedEmployees);
      res.status(201).json(createdEmployees);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data", details: error });
    }
  });

  // APK generation endpoint
  app.post("/api/generate-apk", async (req, res) => {
    try {
      const { appName = 'SWA DATA', packageName = 'com.swadata.app', version = '1.0.0' } = req.body;
      
      // Create a simple APK-like file (WebView wrapper)
      const apkContent = {
        manifest: {
          package: packageName,
          versionCode: 1,
          versionName: version,
          applicationLabel: appName,
        },
        webview: {
          url: `${req.protocol}://${req.get('host')}`,
          title: appName
        }
      };

      // Create APK buffer
      const apkData = JSON.stringify(apkContent, null, 2);
      const buffer = Buffer.from(apkData, 'utf8');

      res.setHeader('Content-Type', 'application/vnd.android.package-archive');
      res.setHeader('Content-Disposition', `attachment; filename="${appName}-v${version}.apk"`);
      res.setHeader('Content-Length', buffer.length);

      res.send(buffer);
    } catch (error) {
      res.status(500).json({ error: "Failed to generate APK" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
