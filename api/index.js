import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global app instance to reuse across function invocations
let app = null;

async function createApp() {
  if (app) {
    return app;
  }

  const newApp = express();
  newApp.use(express.json());
  newApp.use(express.urlencoded({ extended: false }));

  // Health check endpoint
  newApp.get("/api/health", (req, res) => {
    res.json({ status: "ok", version: "6.1.0", timestamp: new Date().toISOString() });
  });

  // Inline API routes for Vercel compatibility
  const storage = { 
    employees: new Map(),
    getAllEmployees: async () => Array.from(storage.employees.values()),
    getEmployeeById: async (id) => storage.employees.get(id),
    createEmployee: async (employee) => {
      const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const emp = { ...employee, id };
      storage.employees.set(id, emp);
      return emp;
    },
    updateEmployee: async (id, updates) => {
      const existing = storage.employees.get(id);
      if (!existing) return null;
      const updated = { ...existing, ...updates };
      storage.employees.set(id, updated);
      return updated;
    },
    deleteEmployee: async (id) => storage.employees.delete(id),
    bulkCreateEmployees: async (employees) => {
      const created = [];
      for (const emp of employees) {
        const created_emp = await storage.createEmployee(emp);
        created.push(created_emp);
      }
      return created;
    }
  };

  // Employee API routes
  newApp.get("/api/employees", async (req, res) => {
    try {
      const employees = await storage.getAllEmployees();
      res.json(employees);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch employees" });
    }
  });

  newApp.get("/api/employees/:id", async (req, res) => {
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

  newApp.post("/api/employees", async (req, res) => {
    try {
      const employee = await storage.createEmployee(req.body);
      res.status(201).json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data" });
    }
  });

  newApp.put("/api/employees/:id", async (req, res) => {
    try {
      const employee = await storage.updateEmployee(req.params.id, req.body);
      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }
      res.json(employee);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data" });
    }
  });

  newApp.delete("/api/employees/:id", async (req, res) => {
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

  newApp.post("/api/employees/bulk", async (req, res) => {
    try {
      const { employees } = req.body;
      if (!Array.isArray(employees)) {
        return res.status(400).json({ error: "Employees must be an array" });
      }
      const createdEmployees = await storage.bulkCreateEmployees(employees);
      res.status(201).json(createdEmployees);
    } catch (error) {
      res.status(400).json({ error: "Invalid employee data" });
    }
  });

  // Serve PWA files with correct MIME types
  newApp.get("/sw.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "no-cache");
    const filePath = path.resolve(process.cwd(), "dist", "public", "sw.js");
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("Service worker not found");
    }
  });

  newApp.get("/manifest.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Cache-Control", "public, max-age=3600");
    const filePath = path.resolve(process.cwd(), "dist", "public", "manifest.json");
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send("Manifest not found");
    }
  });

  // Serve PWA icons and logos with better error handling
  newApp.get("*.png", (req, res) => {
    const iconPath = path.resolve(process.cwd(), "dist", "public", path.basename(req.path));
    if (fs.existsSync(iconPath)) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.sendFile(iconPath);
    } else {
      console.warn(`Image not found: ${iconPath}`);
      res.status(404).send("Image not found");
    }
  });

  // Serve static assets including logos
  const publicPath = path.resolve(process.cwd(), "dist", "public");
  
  if (fs.existsSync(publicPath)) {
    newApp.use(express.static(publicPath, {
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.png')) {
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Cache-Control', 'public, max-age=31536000');
        } else if (filePath.endsWith('.js')) {
          res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
          res.setHeader('Content-Type', 'text/css');
        }
      }
    }));
  } else {
    console.warn(`Public directory not found: ${publicPath}`);
  }

  // Catch-all handler: send back React's index.html file
  newApp.get("*", (req, res) => {
    const indexPath = path.resolve(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(indexPath);
    } else {
      console.error(`Index.html not found at: ${indexPath}`);
      res.status(404).send(`
        <html>
          <head><title>SWAPRO - Application Not Found</title></head>
          <body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
            <h1>Application Not Found</h1>
            <p>The application files are not available. Please check the build process.</p>
            <p>Expected location: ${indexPath}</p>
          </body>
        </html>
      `);
    }
  });

  app = newApp;
  return app;
}

// Serverless function handler (ES modules format)
export default async (req, res) => {
  try {
    const expressApp = await createApp();
    expressApp(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ 
      error: "Internal server error", 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
