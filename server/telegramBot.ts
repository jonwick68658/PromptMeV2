import TelegramBot from 'node-telegram-bot-api';
import { platformTemplateService } from './platformTemplates';
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class TelegramBotService {
  private bot: TelegramBot;
  private userSessions: Map<number, { platform?: string; conversation: any[] }> = new Map();

  constructor() {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN is required');
    }
    
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    this.setupHandlers();
  }

  private setupHandlers() {
    // Start command
    this.bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      this.userSessions.set(chatId, { conversation: [] });
      
      const welcomeMessage = `🚀 Welcome to PromptMe Bot!

I'll help you generate perfect prompts for any AI platform.

Commands:
/platforms - See all available platforms
/select <platform> - Choose a platform (e.g., /select replit)
/clear - Clear conversation history

Just tell me what you need and I'll create an optimized prompt for you!`;

      this.bot.sendMessage(chatId, welcomeMessage);
    });

    // Platforms command
    this.bot.onText(/\/platforms/, (msg) => {
      const chatId = msg.chat.id;
      const platforms = platformTemplateService.getPlatformNames();
      
      let message = "📋 Available Platforms:\n\n";
      platforms.forEach(platform => {
        message += `• ${platform.name} (${platform.id})\n`;
      });
      message += "\nUse /select <platform-id> to choose one!";
      
      this.bot.sendMessage(chatId, message);
    });

    // Select platform command
    this.bot.onText(/\/select (.+)/, (msg, match) => {
      const chatId = msg.chat.id;
      const platformId = match![1].trim();
      
      const platform = platformTemplateService.getTemplate(platformId);
      if (platform) {
        const session = this.userSessions.get(chatId) || { conversation: [] };
        session.platform = platformId;
        this.userSessions.set(chatId, session);
        
        this.bot.sendMessage(chatId, `✅ Platform set to: ${platform.name}\n\nNow tell me what kind of prompt you need!`);
      } else {
        this.bot.sendMessage(chatId, `❌ Platform "${platformId}" not found. Use /platforms to see available options.`);
      }
    });

    // Clear command
    this.bot.onText(/\/clear/, (msg) => {
      const chatId = msg.chat.id;
      this.userSessions.set(chatId, { conversation: [] });
      this.bot.sendMessage(chatId, "🧹 Conversation cleared!");
    });

    // Regular messages
    this.bot.on('message', async (msg) => {
      if (msg.text?.startsWith('/')) return; // Skip commands
      
      const chatId = msg.chat.id;
      const userMessage = msg.text || '';
      
      try {
        await this.handleUserMessage(chatId, userMessage);
      } catch (error) {
        console.error('Error handling message:', error);
        this.bot.sendMessage(chatId, "❌ Sorry, I encountered an error. Please try again.");
      }
    });
  }

  private async handleUserMessage(chatId: number, message: string) {
    const session = this.userSessions.get(chatId) || { conversation: [] };
    
    // Add user message to conversation
    session.conversation.push({ role: 'user', content: message });
    
    // Show typing indicator
    this.bot.sendChatAction(chatId, 'typing');
    
    // Generate response using existing prompt generation logic
    const response = await this.generateResponse(session);
    
    // Add assistant response to conversation
    session.conversation.push({ role: 'assistant', content: response });
    this.userSessions.set(chatId, session);
    
    // Send response to user
    await this.sendFormattedResponse(chatId, response, session.platform);
  }

  private async generateResponse(session: { platform?: string; conversation: any[] }) {
    // Load prompting guide
    const promptingGuidePath = path.join(process.cwd(), 'attached_assets', 'prompting_guidev2.md');
    let promptingGuide = '';
    try {
      promptingGuide = fs.readFileSync(promptingGuidePath, 'utf-8');
    } catch (error) {
      console.error('Could not load prompting guide:', error);
    }

    // Get platform template if selected
    let platformInstructions = '';
    if (session.platform) {
      const template = platformTemplateService.getTemplate(session.platform);
      if (template) {
        platformInstructions = `\n\n# Platform-Specific Context: ${template.name}\n${template.systemPrompt}`;
      }
    }

    const baseInstructions = "You are an AI assistant that helps users create effective prompts based on best practices.\n\nCRITICAL: Always respond in English only. Never use any other language including Chinese, Japanese, or any non-English text.\n\n# Interactive Approach\n- Ask clarifying questions about the user's prompt request before generating a final answer\n- Gather information about purpose, audience, tone, style, and specific requirements\n- Only provide the final prompt after collecting sufficient information\n\n# Response Format for Telegram\n- Keep responses concise for mobile viewing\n- Use code blocks for final prompts\n- Ask brief clarifying questions if needed\n- When providing final prompt, format it clearly and ask if user wants changes\n\n# Important\n- Be helpful and informative but concise for Telegram\n- Always ask clarifying questions first rather than immediately generating a prompt\n- If user asks for changes to a prompt, ONLY modify the requested parts\n- NEVER output any Chinese, Japanese, or non-English characters";

    const systemMessage = {
      role: "system",
      content: session.platform 
        ? `${baseInstructions}${platformInstructions}\n\nPrompting Guide Reference:\n${promptingGuide}`
        : `${baseInstructions}\n\nNote: No specific platform selected. User can use /select <platform> to choose one.\n\nPrompting Guide Reference:\n${promptingGuide}`
    };

    const messages = [systemMessage, ...session.conversation];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: messages as any,
      max_tokens: 1500,
      temperature: 0.7
    });

    return completion.choices[0].message.content || "I apologize, but I couldn't generate a response.";
  }

  private async sendFormattedResponse(chatId: number, response: string, platform?: string) {
    // Add platform indicator if set
    let header = '';
    if (platform) {
      const template = platformTemplateService.getTemplate(platform);
      header = `🎯 Platform: ${template?.name || platform}\n\n`;
    }

    // Split long messages for Telegram's limit (4096 characters)
    const fullMessage = header + response;
    const maxLength = 4000; // Leave some buffer
    
    if (fullMessage.length <= maxLength) {
      await this.bot.sendMessage(chatId, fullMessage, { parse_mode: 'Markdown' });
    } else {
      // Split into chunks
      const chunks = this.splitMessage(fullMessage, maxLength);
      for (const chunk of chunks) {
        await this.bot.sendMessage(chatId, chunk, { parse_mode: 'Markdown' });
      }
    }
  }

  private splitMessage(message: string, maxLength: number): string[] {
    const chunks: string[] = [];
    let currentChunk = '';
    
    const lines = message.split('\n');
    
    for (const line of lines) {
      if ((currentChunk + line + '\n').length > maxLength) {
        if (currentChunk) {
          chunks.push(currentChunk.trim());
          currentChunk = '';
        }
        
        if (line.length > maxLength) {
          // Split very long lines
          const words = line.split(' ');
          for (const word of words) {
            if ((currentChunk + word + ' ').length > maxLength) {
              if (currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
              }
            }
            currentChunk += word + ' ';
          }
        } else {
          currentChunk = line + '\n';
        }
      } else {
        currentChunk += line + '\n';
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  }

  public async start() {
    console.log('🤖 Telegram bot started successfully!');
    await platformTemplateService.loadTemplates();
    console.log('📋 Platform templates loaded for Telegram bot');
  }

  public stop() {
    this.bot.stopPolling();
    console.log('🤖 Telegram bot stopped');
  }
}