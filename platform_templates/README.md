# Platform Templates

This directory contains platform-specific templates and configuration files for generating optimized prompts for different AI tools and platforms.

## Structure

- `replit/` - Replit Agent specific templates and tools
- `openai/` - OpenAI specific configurations
- `claude/` - Anthropic Claude specific templates
- `devin/` - Devin AI specific templates
- (More platforms to be added)

Each platform directory contains:
- `system_prompt.md` - The core system prompt for that platform
- `tools.json` - Available tools and their specifications (if applicable)
- `best_practices.md` - Platform-specific best practices and guidelines

## Usage

The PromptMe app will automatically detect platform mentions in user requests and load the appropriate templates to generate highly optimized, platform-specific prompts.