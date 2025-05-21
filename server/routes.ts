import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load prompting guide
let promptingGuide = "";
try {
  promptingGuide = fs.readFileSync(path.join(__dirname, "..", "attached_assets", "prompting_guide.md"), "utf-8");
} catch (error) {
  console.error("Failed to load prompting guide:", error);
  promptingGuide = "# Prompting Guide\nUse clear, concise instructions and appropriate formatting.";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate email submission
  const emailSchema = z.object({
    email: z.string().email("Invalid email address"),
  });

  app.post("/api/email", async (req, res) => {
    try {
      const { email } = emailSchema.parse(req.body);
      const success = await storage.storeEmail(email);
      
      if (success) {
        return res.status(200).json({ ok: true });
      } else {
        return res.status(500).json({ ok: false, error: "Failed to store email" });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ ok: false, error: error.errors[0].message });
      }
      return res.status(500).json({ ok: false, error: "Server error" });
    }
  });

  // Chat completion endpoint
  const chatSchema = z.object({
    messages: z.array(
      z.object({
        role: z.enum(["user", "assistant", "system", "developer"]),
        content: z.string(),
      })
    ),
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages } = chatSchema.parse(req.body);
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "Missing OpenAI API key" });
      }
      
      // Add developer message with prompting guide
      const devMessage = { role: "developer", content: promptingGuide };
      
      // Fix user/assistant role in the first message if needed
      const fixedMessages = messages.map((msg, index) => {
        // If this is the first message and it's from assistant, change to user
        if (index === 0 && msg.role === 'assistant') {
          return { ...msg, role: 'user' };
        }
        return msg;
      });
      
      const payload = {
        model: "o3-2025-04-16", 
        messages: [devMessage, ...fixedMessages].slice(-30), // Keep context trimmed
      };
      
      // Call OpenAI API
      const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      
      const data = await openaiResponse.json();
      return res.status(200).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      console.error("OpenAI API error:", error);
      return res.status(500).json({ error: "Failed to process chat request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
