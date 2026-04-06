import express from "express";
import { createServer as createViteServer } from "vite";
import { DatabaseSync } from "node:sqlite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new DatabaseSync("campus.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    matric_number TEXT UNIQUE,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    status TEXT DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL, -- 'lost' or 'found'
    image_url TEXT,
    status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    user_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  -- Insert default admin if not exists
  INSERT OR IGNORE INTO users (full_name, email, password, role) 
  VALUES ('System Admin', 'admin@fud.edu.ng', 'adminpassword', 'admin');

  -- Insert default student if not exists
  INSERT OR IGNORE INTO users (full_name, matric_number, email, password, role) 
  VALUES ('John Doe', 'FUD/2024/0001', 'student@fud.edu.ng', 'studentpassword', 'student');
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // --- API Routes ---

  // Auth
  app.post("/api/register", (req, res) => {
    const { fullName, matricNumber, email, password, role } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO users (full_name, matric_number, email, password, role) VALUES (?, ?, ?, ?, ?)");
      const info = stmt.run(fullName, matricNumber, email, password, role || 'student');
      res.json({ id: info.lastInsertRowid, fullName, email, role: role || 'student' });
    } catch (e: any) {
      res.status(400).json({ error: e.message });
    }
  });

  app.post("/api/login", (req, res) => {
    const { identifier, password, role } = req.body; // identifier can be email or matric number
    const user = db.prepare("SELECT * FROM users WHERE (email = ? OR matric_number = ?) AND password = ? AND role = ?").get(identifier, identifier, password, role) as any;
    if (user) {
      if (user.status === 'suspended') {
        return res.status(403).json({ error: "Account suspended" });
      }
      res.json({ id: user.id, fullName: user.full_name, email: user.email, role: user.role });
    } else {
      res.status(401).json({ error: "Invalid credentials for the selected role" });
    }
  });

  // Items
  app.get("/api/items", (req, res) => {
    const { status, type } = req.query;
    let query = "SELECT items.*, users.full_name as posted_by FROM items JOIN users ON items.user_id = users.id";
    const params: any[] = [];
    
    if (status || type) {
      query += " WHERE";
      if (status) {
        query += " items.status = ?";
        params.push(status);
      }
      if (type) {
        if (status) query += " AND";
        query += " items.type = ?";
        params.push(type);
      }
    }
    
    query += " ORDER BY created_at DESC";
    const items = db.prepare(query).all(...params);
    res.json(items);
  });

  app.get("/api/items/:id", (req, res) => {
    const item = db.prepare("SELECT items.*, users.full_name as posted_by, users.email as contact_email FROM items JOIN users ON items.user_id = users.id WHERE items.id = ?").get(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ error: "Item not found" });
  });

  app.post("/api/items", (req, res) => {
    const { name, category, description, location, date, type, imageUrl, userId } = req.body;
    const stmt = db.prepare("INSERT INTO items (name, category, description, location, date, type, image_url, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    const info = stmt.run(name, category, description, location, date, type, imageUrl, userId);
    res.json({ id: info.lastInsertRowid });
  });

  // Admin Actions
  app.get("/api/admin/stats", (req, res) => {
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get() as any;
    const totalLost = db.prepare("SELECT COUNT(*) as count FROM items WHERE type = 'lost'").get() as any;
    const totalFound = db.prepare("SELECT COUNT(*) as count FROM items WHERE type = 'found'").get() as any;
    const pending = db.prepare("SELECT COUNT(*) as count FROM items WHERE status = 'pending'").get() as any;
    res.json({
      totalUsers: totalUsers.count,
      totalLostItems: totalLost.count,
      totalFoundItems: totalFound.count,
      pendingReports: pending.count
    });
  });

  app.get("/api/admin/users", (req, res) => {
    const users = db.prepare("SELECT id, full_name, matric_number, email, role, status FROM users WHERE role = 'student'").all();
    res.json(users);
  });

  app.patch("/api/admin/users/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/admin/users/:id", (req, res) => {
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.patch("/api/items/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE items SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/items/:id", (req, res) => {
    db.prepare("DELETE FROM items WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // --- Vite Middleware ---
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
