import { users, emails, type User, type InsertUser, type Email, type InsertEmail } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Email-related methods
  storeEmail(email: string): Promise<boolean>;
  getEmails(): Promise<Email[]>;
}

export class DatabaseStorage implements IStorage {
  // User methods (needed for the interface but not actively used in this app)
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }
  
  // Email methods
  async storeEmail(email: string): Promise<boolean> {
    try {
      await db
        .insert(emails)
        .values({ email })
        .onConflictDoNothing()
        .returning();
      return true;
    } catch (error) {
      console.error("Error storing email:", error);
      return false;
    }
  }
  
  async getEmails(): Promise<Email[]> {
    try {
      return await db
        .select()
        .from(emails)
        .orderBy(emails.createdAt);
    } catch (error) {
      console.error("Error getting emails:", error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
