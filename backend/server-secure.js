const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 20;

// CORS configuration - Restrict to your domain
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'https://xyzaixyz.com',
            'https://www.xyzaixyz.com',
            'http://localhost:8000',
            'http://localhost:3000'
        ];
        
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' })); // Limit body size

// Simple rate limiting middleware
app.use((req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    
    // Clean up old entries
    for (const [key, data] of requestCounts.entries()) {
        if (now - data.firstRequest > RATE_LIMIT_WINDOW) {
            requestCounts.delete(key);
        }
    }
    
    // Check rate limit
    const userData = requestCounts.get(ip) || { count: 0, firstRequest: now };
    
    if (userData.count >= MAX_REQUESTS_PER_WINDOW) {
        return res.status(429).json({ 
            error: 'Too many requests. Please try again later.' 
        });
    }
    
    // Update count
    userData.count++;
    requestCounts.set(ip, userData);
    
    next();
});

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// Optional: Add authentication
const AUTH_TOKEN = process.env.AUTH_TOKEN;
if (AUTH_TOKEN) {
    app.use('/api/*', (req, res, next) => {
        const token = req.headers['x-auth-token'];
        if (token !== AUTH_TOKEN) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        next();
    });
}

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'RCM AI Proxy Server is running',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// Input validation
function validateChatRequest(req, res, next) {
    const { message, model, settings = {} } = req.body;
    
    // Validate message
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string' });
    }
    
    if (message.length > 4000) {
        return res.status(400).json({ error: 'Message too long (max 4000 characters)' });
    }
    
    // Validate model
    const validModels = ['gpt-4', 'claude-3', 'google-gemini', 'mistral-large', 'openrouter-gpt4', 'groq-llama'];
    if (!model || !validModels.includes(model)) {
        return res.status(400).json({ error: 'Invalid model specified' });
    }
    
    // Validate settings
    if (settings.temperature && (settings.temperature < 0 || settings.temperature > 2)) {
        return res.status(400).json({ error: 'Temperature must be between 0 and 2' });
    }
    
    if (settings.maxTokens && (settings.maxTokens < 1 || settings.maxTokens > 4000)) {
        return res.status(400).json({ error: 'Max tokens must be between 1 and 4000' });
    }
    
    next();
}

// Universal chat endpoint with validation
app.post('/api/chat', validateChatRequest, async (req, res) => {
    try {
        const { message, model, settings = {} } = req.body;
        
        // Check if API key exists for the requested model
        const apiKeyMap = {
            'gpt-4': process.env.OPENAI_API_KEY,
            'claude-3': process.env.CLAUDE_API_KEY,
            'google-gemini': process.env.GOOGLE_API_KEY,
            'mistral-large': process.env.MISTRAL_API_KEY,
            'openrouter-gpt4': process.env.OPENROUTER_API_KEY,
            'groq-llama': process.env.GROQ_API_KEY
        };
        
        if (!apiKeyMap[model]) {
            return res.status(503).json({ 
                error: `${model} API key not configured. Please contact administrator.` 
            });
        }

        let response;
        
        switch (model) {
            case 'gpt-4':
                response = await callOpenAI(message, settings);
                break;
            case 'claude-3':
                response = await callClaude(message, settings);
                break;
            case 'google-gemini':
                response = await callGoogleAI(message, settings);
                break;
            case 'mistral-large':
                response = await callMistral(message, settings);
                break;
            case 'openrouter-gpt4':
                response = await callOpenRouter(message, settings);
                break;
            case 'groq-llama':
                response = await callGroq(message, settings);
                break;
        }
        
        res.json({ response });
    } catch (error) {
        console.error(`API Error for ${req.body.model}:`, error.response?.data || error.message);
        
        // Don't expose internal error details
        const errorMessage = error.response?.data?.error?.message || 'API request failed';
        const statusCode = error.response?.status || 500;
        
        res.status(statusCode).json({ 
            error: errorMessage,
            model: req.body.model
        });
    }
});

// API call functions remain the same as in the original server.js
// ... (include all the API functions from the original server.js)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ 
        error: 'Internal server error' 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Endpoint not found' 
    });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`🚀 RCM AI Proxy Server running on port ${PORT}`);
        console.log(`📍 Health check: http://localhost:${PORT}/health`);
        console.log(`🔒 CORS enabled for: ${corsOptions.origin}`);
        console.log(`⏱️  Rate limit: ${MAX_REQUESTS_PER_WINDOW} requests per minute`);
        if (AUTH_TOKEN) {
            console.log(`🔐 Authentication enabled`);
        }
    });
}

// Export for Vercel
module.exports = app;