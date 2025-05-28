import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { platformTemplateService } from "./platformTemplates";
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
  promptingGuide = fs.readFileSync(path.join(__dirname, "..", "attached_assets", "prompting_guide_v2.md"), "utf-8");
} catch (error) {
  console.error("Failed to load prompting guide:", error);
  // Try original guide as fallback
  try {
    promptingGuide = fs.readFileSync(path.join(__dirname, "..", "attached_assets", "prompting_guide.md"), "utf-8");
  } catch (fallbackError) {
    console.error("Failed to load fallback guide:", fallbackError);
    promptingGuide = "# Prompting Guide\nUse clear, concise instructions and appropriate formatting.";
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize platform templates
  await platformTemplateService.loadTemplates();
  console.log('Platform templates loaded successfully!');

  // Platform templates endpoint
  app.get("/api/platforms", async (req, res) => {
    try {
      const platforms = platformTemplateService.getPlatformNames();
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({ platforms, count: platforms.length });
    } catch (error) {
      console.error("Error fetching platforms:", error);
      res.status(500).json({ error: "Failed to fetch platforms" });
    }
  });

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
        platform: z.string().optional(),
      })
    ),
    platform: z.string().optional(),
    model: z.string().optional(),
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { messages, platform, model } = chatSchema.parse(req.body);
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "Missing OpenAI API key" });
      }
      
      // Add developer message with prompting guide
      const devMessage = { role: "developer", content: promptingGuide };
      
      // Get platform-specific context if platform is selected
      let platformContext = "";
      if (platform) {
        const platformTemplate = platformTemplateService.getTemplate(platform);
        if (platformTemplate) {
          platformContext = `
          
# Platform-Specific Instructions for ${platformTemplate.name}

You are creating prompts specifically for ${platformTemplate.name}. Study this platform's complete system prompt to understand its exact capabilities, constraints, and expected format:

## Complete Platform System Prompt
${platformTemplate.systemPrompt}

${platformTemplate.tools ? `## Platform Tools/Capabilities
${JSON.stringify(platformTemplate.tools, null, 2)}` : ''}

## Your Task
Generate prompts that perfectly match this platform's:
- Exact communication style and terminology
- Specific constraints and limitations
- Required output format and structure
- Available tools and capabilities
- Best practices and conventions

The generated prompt should read like it was written by someone deeply familiar with ${platformTemplate.name}'s specific requirements and capabilities.`;
        }
      }
      
      // Add system message with platform-aware behavior
      const baseInstructions = `You are an AI assistant that helps users create effective prompts based on best practices.
        
        CRITICAL: Always respond in English only. Never use any other language including Chinese, Japanese, or any non-English text.
        
        # Interactive Approach
        - Ask clarifying questions about the user's prompt request before generating a final answer
        - Gather information about purpose, audience, tone, style, and specific requirements
        - Only provide the final prompt after collecting sufficient information
        
        # Response Format
        - Begin by asking 2-3 specific questions about the prompt request
        - After user answers, create a well-formatted prompt using the guidelines from the prompting guide
        - Format prompts ONLY in code blocks using markdown triple backticks
        - DO NOT include any explanation or reasoning after the prompt - just ask if the user wants any changes
        
        # Important
        - Be helpful and informative
        - Always ask clarifying questions first rather than immediately generating a prompt
        - If the user's request is unclear or lacks context, always ask for more details
        - If user asks for changes to a prompt, ONLY modify the requested parts while keeping everything else intact
        - Keep your explanations brief and your prompts clean and well-structured
        - NEVER output any Chinese, Japanese, or non-English characters`;

      const systemMessage = { 
        role: "system", 
        content: platform 
          ? `${baseInstructions}
          
# CRITICAL: Platform-Native Prompt Generation
You are now acting AS IF you were ${platformTemplateService.getTemplate(platform)?.name || platform} itself when creating prompts. 

When generating prompts, you must:
- Write the prompt exactly as ${platformTemplateService.getTemplate(platform)?.name || platform} would expect it
- Use the exact terminology, format, and style that ${platformTemplateService.getTemplate(platform)?.name || platform} uses
- Follow ${platformTemplateService.getTemplate(platform)?.name || platform}'s specific constraints and capabilities
- Generate prompts that would work perfectly if pasted directly into ${platformTemplateService.getTemplate(platform)?.name || platform}

You are NOT creating prompts ABOUT ${platformTemplateService.getTemplate(platform)?.name || platform} - you are creating prompts FOR ${platformTemplateService.getTemplate(platform)?.name || platform}.

${platformContext}`
          : baseInstructions
      };
      
      // Fix user/assistant role in the first message if needed
      const fixedMessages = messages.map((msg, index) => {
        // If this is the first message and it's from assistant, change to user
        if (index === 0 && msg.role === 'assistant') {
          return { ...msg, role: 'user' };
        }
        return msg;
      });
      
      // Use selected model or default to gpt-4o
      const selectedModel = model || "gpt-4o";
      
      const payload = {
        model: selectedModel, // Support gpt-4o, gpt-4o-mini for cost comparison
        messages: [devMessage, systemMessage, ...fixedMessages].slice(-30), // Keep context trimmed
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
