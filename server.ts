import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("stats.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS stats (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    visitors INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0
  )
`);

// Ensure initial record exists
const row = db.prepare("SELECT * FROM stats WHERE id = 1").get();
if (!row) {
  db.prepare("INSERT INTO stats (id, visitors, views) VALUES (1, 0, 0)").run();
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/stats", (req, res) => {
    const stats = db.prepare("SELECT visitors, views FROM stats WHERE id = 1").get() as { visitors: number, views: number };
    res.json(stats);
  });

  app.post("/api/stats/increment", (req, res) => {
    const { isNewVisitor } = req.body;
    
    if (isNewVisitor) {
      db.prepare("UPDATE stats SET visitors = visitors + 1, views = views + 1 WHERE id = 1").run();
    } else {
      db.prepare("UPDATE stats SET views = views + 1 WHERE id = 1").run();
    }
    
    const stats = db.prepare("SELECT visitors, views FROM stats WHERE id = 1").get() as { visitors: number, views: number };
    res.json(stats);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
