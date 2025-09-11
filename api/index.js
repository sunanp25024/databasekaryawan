import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve PWA files with correct MIME types
app.get("/sw.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-cache");
  const filePath = path.resolve(process.cwd(), "dist", "public", "sw.js");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).end();
  }
});

app.get("/manifest.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  const filePath = path.resolve(process.cwd(), "dist", "public", "manifest.json");
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).end();
  }
});

// Serve PWA icons and logos
app.get("*.png", (req, res) => {
  const iconPath = path.resolve(process.cwd(), "dist", "public", path.basename(req.path));
  if (fs.existsSync(iconPath)) {
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.sendFile(iconPath);
  } else {
    res.status(404).end();
  }
});

// Serve static assets 
const publicPath = path.resolve(process.cwd(), "dist", "public");
app.use(express.static(publicPath, {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.png')) {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    }
  }
}));

// Catch-all handler: send back React's index.html file
app.get("*", (req, res) => {
  const indexPath = path.resolve(publicPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send("Application not found");
  }
});

export default app;