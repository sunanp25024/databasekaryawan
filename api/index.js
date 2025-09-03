const express = require("express");
const path = require("path");
const fs = require("fs");

// Global app instance to reuse across function invocations
let app = null;

async function createApp() {
  if (app) {
    return app;
  }

  const newApp = express();
  newApp.use(express.json());
  newApp.use(express.urlencoded({ extended: false }));

  // Import and register routes (using dynamic import for ES modules)
  try {
    const { registerRoutes } = await import("../server/routes.js");
    await registerRoutes(newApp);
  } catch (error) {
    console.error("Failed to register routes:", error);
    // Continue without API routes if import fails
  }

  // Serve PWA files with correct MIME types
  newApp.get("/sw.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Cache-Control", "no-cache");
    const filePath = path.resolve(process.cwd(), "dist", "public", "sw.js");
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).end();
    }
  });

  newApp.get("/manifest.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    const filePath = path.resolve(process.cwd(), "dist", "public", "manifest.json");
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).end();
    }
  });

  // Serve PWA icons and logos
  newApp.get("*.png", (req, res) => {
    const iconPath = path.resolve(process.cwd(), "dist", "public", path.basename(req.path));
    if (fs.existsSync(iconPath)) {
      res.setHeader("Content-Type", "image/png");
      res.setHeader("Cache-Control", "public, max-age=31536000");
      res.sendFile(iconPath);
    } else {
      res.status(404).end();
    }
  });

  // Serve static assets including logos
  const publicPath = path.resolve(process.cwd(), "dist", "public");
  newApp.use(express.static(publicPath, {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.png')) {
        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Cache-Control', 'public, max-age=31536000');
      }
    }
  }));

  // Catch-all handler: send back React's index.html file
  newApp.get("*", (req, res) => {
    const indexPath = path.resolve(publicPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Application not found");
    }
  });

  app = newApp;
  return app;
}

module.exports = async (req, res) => {
  try {
    const expressApp = await createApp();
    expressApp(req, res);
  } catch (error) {
    console.error("Serverless function error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};