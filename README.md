# PromptMe - AI Prompt Generation Platform

An intelligent prompt engineering toolkit that helps users create precise and effective AI prompts through advanced template management, optimization tools, and interactive learning experiences.

## Features

### 🌐 Web Application
- **Interactive Chat Interface** - Clean, dark-themed UI for prompt generation
- **15 AI Platform Templates** - Specialized prompts for different AI tools:
  - Bolt.new - Web development with artifact formatting
  - Cursor - AI-powered code editing and pair programming
  - Replit - Full-stack development environment
  - Claude 3.7 Sonnet - Advanced reasoning and analysis
  - Google Gemini 2.5 Pro - Search-integrated AI responses
  - Perplexity AI - Research with proper citations
  - Devin - Software engineering with planning modes
  - Cline - Skilled software engineer with XML tools
  - Lovable - React/TypeScript web application editor
  - And 6 more specialized platforms

### 📱 Telegram Bot Integration
- **Mobile-First Access** - Generate prompts directly from Telegram
- **Platform Selection** - All 15 templates available via bot commands
- **Real-time Generation** - Fast prompt creation on mobile devices
- **Commands Available**:
  - `/start` - Welcome and instructions
  - `/platforms` - List all available AI platforms
  - `/select <platform>` - Choose target platform
  - `/clear` - Clear conversation history

### 💰 Cost-Optimized AI
- **gpt-4.1-mini-2025-04-14** - Proven quality at significantly lower cost
- **Smart Context Management** - Efficient token usage
- **Platform-Native Generation** - Authentic prompts that work perfectly with each AI tool

### 🎯 Advanced Prompt Engineering
- **Interactive Approach** - Asks clarifying questions before generating
- **Platform-Specific Context** - Tailored to each AI tool's requirements
- **Best Practices Integration** - Based on latest prompting guidelines
- **Copy-Friendly Output** - Easy one-click copying of generated prompts

## Tech Stack

### Frontend
- **React** with TypeScript
- **Tailwind CSS** for responsive design
- **Shadcn UI** components
- **Wouter** for client-side routing
- **TanStack Query** for API management

### Backend
- **Express.js** with TypeScript
- **OpenAI API** integration
- **Node Telegram Bot API** for mobile access
- **Drizzle ORM** with PostgreSQL
- **Platform Template System** for specialized prompts

### Development
- **Vite** for fast development and building
- **Hot Module Replacement** for instant updates
- **TypeScript** throughout for type safety

## Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- OpenAI API key
- Telegram Bot Token (optional, for mobile access)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd promptme
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Required
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=your_postgresql_connection_string
   
   # Optional (for Telegram bot)
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Web: http://localhost:5000
   - Telegram: Find your bot and send `/start`

## Usage

### Web Application
1. Visit the application in your browser
2. Select an AI platform from the dropdown (optional)
3. Describe what you want to build or accomplish
4. The AI will ask clarifying questions
5. Receive a perfectly crafted, platform-specific prompt
6. Copy and use in your chosen AI tool

### Telegram Bot
1. Start a chat with your bot
2. Send `/platforms` to see all available options
3. Use `/select replit` (or any platform) to choose your target
4. Simply describe your request
5. Get optimized prompts instantly on mobile

## Platform Templates

Each platform template includes:
- **Specialized System Prompts** - Tailored to platform capabilities
- **Format Requirements** - Proper structure for each AI tool
- **Best Practices** - Optimized for platform-specific features
- **Authentic Output** - Prompts that work perfectly when pasted

### Featured Platforms

**Bolt.new** - Web development with proper artifact formatting
**Cursor** - AI pair programming with semantic search
**Replit** - Full development environment with proper tool usage
**Claude** - Advanced reasoning with philosophical depth
**Perplexity** - Research-focused with citation requirements

## Development

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/           # Utility functions
├── server/                 # Express backend
│   ├── platformTemplates.ts  # Template management
│   ├── telegramBot.ts     # Telegram integration
│   └── routes.ts          # API endpoints
├── platform_templates/    # AI platform templates
└── shared/                # Shared types and schemas
```

### Adding New Platforms

1. Create new directory in `platform_templates/`
2. Add `system_prompt.md` with platform-specific instructions
3. Templates are automatically loaded at startup
4. Available immediately in web and Telegram interfaces

### API Endpoints

- `POST /api/chat` - Generate prompts with platform context
- `GET /api/platforms` - List available platform templates
- `POST /api/emails` - Email collection for access

## Deployment

### Replit Deployment
1. Ensure all environment variables are set
2. Database is provisioned and accessible
3. Run `npm run build` for production assets
4. Deploy using Replit's deployment system

### Production Considerations
- PostgreSQL database for persistence
- Proper environment variable management
- HTTPS for secure communication
- Rate limiting for API protection

## Environment Variables

### Required
- `OPENAI_API_KEY` - For AI prompt generation
- `DATABASE_URL` - PostgreSQL connection string

### Optional
- `TELEGRAM_BOT_TOKEN` - Enable mobile Telegram access
- `SESSION_SECRET` - For secure session management

## Cost Optimization

This application uses **gpt-4.1-mini-2025-04-14** which provides:
- Excellent prompt generation quality
- Significantly lower API costs compared to GPT-4o
- Fast response times
- Efficient token usage

## Contributing

1. Fork the repository
2. Create a feature branch
3. Add your platform template or enhancement
4. Test thoroughly with both web and Telegram interfaces
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues or questions:
- Check existing platform templates for examples
- Review the prompting guide in `attached_assets/`
- Test with both web and Telegram interfaces
- Verify environment variables are correctly set

---

**PromptMe** - Making AI prompt engineering accessible, efficient, and platform-native.