# RCM AI Backend Proxy Server

This backend server acts as a secure proxy for making API calls to various LLM providers (OpenAI, Claude, Google AI, Mistral, OpenRouter, Groq) from the frontend application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy the example environment file and add your API keys:
```bash
cp .env.example .env
```

Then edit `.env` and add your actual API keys:
```
OPENAI_API_KEY=sk-...
CLAUDE_API_KEY=sk-ant-...
GOOGLE_API_KEY=AIza...
MISTRAL_API_KEY=...
OPENROUTER_API_KEY=sk-or-...
GROQ_API_KEY=gsk_...
```

### 3. Run the Server
For development:
```bash
npm run dev
```

For production:
```bash
npm start
```

The server will start on `http://localhost:3001` by default.

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Chat Endpoint
```
POST /api/chat
Content-Type: application/json

{
  "message": "Your message here",
  "model": "gpt-4",  // or "claude-3", "google-gemini", etc.
  "settings": {
    "temperature": 0.7,
    "maxTokens": 2048,
    "topP": 0.9
  }
}
```

## 🔧 Frontend Configuration

Update the `BACKEND_URL` in `ai-sandbox.html`:

```javascript
const BACKEND_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://your-backend-url.com'; // Your deployed backend URL
```

## 🚀 Deployment Options

### Option 1: Deploy to Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts
4. Add environment variables in Vercel dashboard

### Option 2: Deploy to Heroku
1. Create a new Heroku app
2. Add environment variables in Heroku dashboard
3. Deploy using Heroku CLI or GitHub integration

### Option 3: Deploy to Railway
1. Connect your GitHub repo to Railway
2. Add environment variables
3. Deploy automatically

### Option 4: Deploy to Render
1. Create a new Web Service on Render
2. Connect your GitHub repo
3. Add environment variables
4. Deploy automatically

## 🔒 Security Notes

- Never expose API keys in frontend code
- Always use HTTPS in production
- Consider adding rate limiting for production use
- Add authentication if needed for your use case

## 📝 Supported Models

- **OpenAI**: GPT-4 Turbo
- **Anthropic**: Claude 3.5 Sonnet
- **Google**: Gemini 1.5 Pro
- **Mistral**: Mistral Large
- **OpenRouter**: GPT-4 (via OpenRouter)
- **Groq**: Llama 3 70B