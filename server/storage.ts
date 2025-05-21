import { users, type User, type InsertUser, type Email, type InsertEmail } from "@shared/schema";
import Database from "better-sqlite3";
import fs from "fs";

// Create SQLite database if it doesn't exist
if (!fs.existsSync("./emails.db")) {
  const db = new Database("emails.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS emails(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  db.close();
}

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Email-related methods
  storeEmail(email: string): Promise<boolean>;
  getEmails(): Promise<Email[]>;
}

export class SqliteStorage implements IStorage {
  private db: Database.Database;
  
  constructor() {
    this.db = new Database("emails.db");
  }
  
  // User methods (needed for the interface but not actively used in this app)
  async getUser(id: number): Promise<User | undefined> {
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = 1; // Placeholder
    return { ...insertUser, id };
  }
  
  // Email methods
  async storeEmail(email: string): Promise<boolean> {
    try {
      this.db.prepare("INSERT OR IGNORE INTO emails(email) VALUES (?)").run(email);
      return true;
    } catch (error) {
      console.error("Error storing email:", error);
      return false;
    }
  }
  
  async getEmails(): Promise<Email[]> {
    try {
      const stmt = this.db.prepare("SELECT * FROM emails ORDER BY created_at DESC");
      return stmt.all() as Email[];
    } catch (error) {
      console.error("Error getting emails:", error);
      return [];
    }
  }
}

export const storage = new SqliteStorage();
