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

  // Import and register routes only if database is available
  try {
    const { registerRoutes } = await import("../server/routes.js");
    await registerRoutes(newApp);
    console.log("API routes registered successfully");
  } catch (error) {
    console.warn("API routes not available:", error.message);
    // Continue without API routes - app will work in localStorage mode
  }

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
