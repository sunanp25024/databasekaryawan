@@ .. @@
  app.use(express.json());
   app.use(express.urlencoded({ extended: false }));

+  // Health check endpoint
+  app.get("/api/health", (req, res) => {
+    res.json({ 
+      status: "ok", 
+      version: "6.2.0", 
+      timestamp: new Date().toISOString(),
+      features: ["PWA", "localStorage", "CSV Import/Export"]
+    });
+  });
+
   // Health check endpoint
   app.get("/api/health", (req, res) => {
@@ .. @@
   // Import and register routes only if database is available
   try {
-    const { registerRoutes } = await import("../server/routes.js");
-    await registerRoutes(app);
-    console.log("API routes registered successfully");
+    // Skip API routes for now to avoid module conflicts
+    console.log("API routes skipped - using localStorage mode");
   } catch (error) {
-    console.warn("API routes not available:", error.message);
+    console.warn("API routes not available:", error?.message || error);
     // Continue without API routes - app will work in localStorage mode
   }