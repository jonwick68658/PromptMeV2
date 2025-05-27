import fs from 'fs';
import path from 'path';

export interface PlatformTemplate {
  id: string;
  name: string;
  systemPrompt: string;
  tools?: any;
  description?: string;
}

export class PlatformTemplateService {
  private templates: Map<string, PlatformTemplate> = new Map();
  private loaded = false;

  async loadTemplates(): Promise<void> {
    if (this.loaded) return;

    const templatesDir = path.join(process.cwd(), 'platform_templates');
    
    if (!fs.existsSync(templatesDir)) {
      console.warn('Platform templates directory not found');
      return;
    }

    const platformDirs = fs.readdirSync(templatesDir, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const platformDir of platformDirs) {
      try {
        const platformPath = path.join(templatesDir, platformDir);
        const systemPromptPath = path.join(platformPath, 'system_prompt.md');
        const toolsPath = path.join(platformPath, 'tools.json');

        if (!fs.existsSync(systemPromptPath)) {
          console.warn(`System prompt not found for platform: ${platformDir}`);
          continue;
        }

        const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');
        let tools = null;

        if (fs.existsSync(toolsPath)) {
          const toolsContent = fs.readFileSync(toolsPath, 'utf-8');
          tools = JSON.parse(toolsContent);
        }

        // Convert directory name to display name
        const name = this.formatPlatformName(platformDir);

        const template: PlatformTemplate = {
          id: platformDir,
          name,
          systemPrompt,
          tools,
          description: this.generateDescription(name, systemPrompt)
        };

        this.templates.set(platformDir, template);
        console.log(`Loaded platform template: ${name}`);
      } catch (error) {
        console.error(`Error loading platform ${platformDir}:`, error);
      }
    }

    this.loaded = true;
    console.log(`Loaded ${this.templates.size} platform templates`);
  }

  private formatPlatformName(dirName: string): string {
    return dirName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private generateDescription(name: string, systemPrompt: string): string {
    const descriptions: Record<string, string> = {
      'Replit': 'Full-stack development environment with comprehensive toolset',
      'Cursor': 'AI coding assistant with semantic search capabilities',
      'Devin': 'Software engineer with planning modes and git integration',
      'Lovable': 'Web application editor for React/TypeScript development',
      'Manus': 'Multi-capable AI agent with modular architecture',
      'Cline': 'Skilled software engineer with XML-formatted tools',
      'Codex Cli': 'Terminal-based coding assistant with patch system',
      'Roo Code': 'Maintainability-focused engineer with precise editing',
      'Same New': 'Cloud IDE assistant with web scraping and deployment',
      'Vs Code': 'GitHub Copilot with semantic search and extension APIs',
      'Windsurf': 'Cascade AI with memory system and browser preview',
      'Claude 3 7 Sonnet': 'Reasoning model with philosophical engagement',
      'Perplexity Ai': 'Search assistant with citation requirements',
      'Google Gemini 2 5 Pro': 'Search-integrated AI with LaTeX formatting'
    };

    return descriptions[name] || `AI assistant platform: ${name}`;
  }

  getTemplate(platformId: string): PlatformTemplate | undefined {
    return this.templates.get(platformId);
  }

  getAllTemplates(): PlatformTemplate[] {
    return Array.from(this.templates.values()).sort((a, b) => a.name.localeCompare(b.name));
  }

  getPlatformNames(): { id: string; name: string; description: string }[] {
    return this.getAllTemplates().map(template => ({
      id: template.id,
      name: template.name,
      description: template.description || ''
    }));
  }
}

export const platformTemplateService = new PlatformTemplateService();