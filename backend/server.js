const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'RCM AI Proxy Server is running' });
});

// Universal chat endpoint that routes to different providers
app.post('/api/chat', async (req, res) => {
    try {
        const { message, model, settings = {} } = req.body;
        
        if (!message || !model) {
            return res.status(400).json({ error: 'Message and model are required' });
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
            default:
                return res.status(400).json({ error: 'Invalid model selected' });
        }
        
        res.json({ response });
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        res.status(500).json({ 
            error: error.response?.data?.error?.message || error.message || 'API request failed'
        });
    }
});

// OpenAI API Integration
async function callOpenAI(message, settings) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('OpenAI API key not configured');

    const systemPrompt = getRCMSystemPrompt();

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-4-turbo-preview',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ],
        temperature: settings.temperature || 0.7,
        max_tokens: settings.maxTokens || 2048,
        top_p: settings.topP || 0.9
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    });

    return response.data.choices[0].message.content;
}

// Claude API Integration
async function callClaude(message, settings) {
    const apiKey = process.env.CLAUDE_API_KEY;
    if (!apiKey) throw new Error('Claude API key not configured');

    const systemPrompt = getRCMSystemPrompt();

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: settings.maxTokens || 2048,
        temperature: settings.temperature || 0.7,
        system: systemPrompt,
        messages: [
            { role: 'user', content: message }
        ]
    }, {
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
        }
    });

    return response.data.content[0].text;
}

// Google AI Integration
async function callGoogleAI(message, settings) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error('Google AI API key not configured');

    const systemPrompt = getRCMSystemPrompt();

    const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`,
        {
            contents: [{
                parts: [{
                    text: `${systemPrompt}\n\nUser: ${message}`
                }]
            }],
            generationConfig: {
                temperature: settings.temperature || 0.7,
                maxOutputTokens: settings.maxTokens || 2048,
                topP: settings.topP || 0.9
            }
        },
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data.candidates[0].content.parts[0].text;
}

// Mistral AI Integration
async function callMistral(message, settings) {
    const apiKey = process.env.MISTRAL_API_KEY;
    if (!apiKey) throw new Error('Mistral API key not configured');

    const systemPrompt = getRCMSystemPrompt();

    const response = await axios.post('https://api.mistral.ai/v1/chat/completions', {
        model: 'mistral-large-latest',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ],
        temperature: settings.temperature || 0.7,
        max_tokens: settings.maxTokens || 2048,
        top_p: settings.topP || 0.9
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    });

    return response.data.choices[0].message.content;
}

// OpenRouter Integration
async function callOpenRouter(message, settings) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) throw new Error('OpenRouter API key not configured');

    const systemPrompt = getRCMSystemPrompt();

    const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'openai/gpt-4-turbo',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ],
        temperature: settings.temperature || 0.7,
        max_tokens: settings.maxTokens || 2048,
        top_p: settings.topP || 0.9
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': process.env.APP_URL || 'https://xyzaixyz.com',
            'X-Title': 'RCM Agent Architecture'
        }
    });

    return response.data.choices[0].message.content;
}

// Groq Integration
async function callGroq(message, settings) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error('Groq API key not configured');

    const systemPrompt = getRCMSystemPrompt();

    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
        model: 'llama3-70b-8192',
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
        ],
        temperature: settings.temperature || 0.7,
        max_tokens: settings.maxTokens || 2048,
        top_p: settings.topP || 0.9
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        }
    });

    return response.data.choices[0].message.content;
}

// Shared RCM System Prompt
function getRCMSystemPrompt() {
    return `You are an expert RCM (Revenue Cycle Management) AI assistant for healthcare organizations. You specialize in:

- Eligibility verification and benefits checking
- Medical coding (ICD-10, CPT, HCPCS)
- Claim processing and submission
- Denial management and appeals
- Prior authorization workflows
- Payment posting and reconciliation
- Revenue analytics and reporting
- Healthcare compliance and regulations

Provide accurate, detailed, and actionable responses for healthcare revenue cycle questions. Use specific examples and step-by-step guidance when appropriate.`;
}

// Start server
app.listen(PORT, () => {
    console.log(`🚀 RCM AI Proxy Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});