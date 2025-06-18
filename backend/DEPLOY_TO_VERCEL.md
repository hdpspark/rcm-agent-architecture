# 🚀 Deploy Backend to Vercel - Step by Step Guide

Follow these simple steps to deploy your RCM AI backend to Vercel in under 5 minutes!

## Step 1: Create Vercel Account (if needed)
Go to https://vercel.com and sign up with GitHub

## Step 2: Install Vercel CLI and Login
```bash
npm i -g vercel
vercel login
```

## Step 3: Deploy the Backend
From the backend directory, run:
```bash
cd backend
vercel --prod
```

When prompted:
- **Set up and deploy**: Yes
- **Which scope**: Choose your account
- **Link to existing project?**: No
- **Project name**: `rcm-ai-backend` (or press enter for default)
- **Directory**: `./` (press enter)
- **Override settings?**: No

## Step 4: Note Your Backend URL
After deployment, you'll see:
```
🎉 Production: https://rcm-ai-backend.vercel.app [READY]
```

Copy this URL! You'll need it for the next step.

## Step 5: Add Environment Variables
1. Go to https://vercel.com/dashboard
2. Click on your `rcm-ai-backend` project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:

| Key | Value |
|-----|-------|
| OPENAI_API_KEY | your-openai-key |
| CLAUDE_API_KEY | your-claude-key |
| GOOGLE_API_KEY | your-google-key |
| MISTRAL_API_KEY | your-mistral-key |
| OPENROUTER_API_KEY | your-openrouter-key |
| GROQ_API_KEY | your-groq-key |

5. Click "Save" for each one

## Step 6: Redeploy with Environment Variables
After adding all environment variables:
1. Go to "Deployments" tab
2. Click the three dots on the latest deployment
3. Click "Redeploy"
4. Click "Redeploy" again to confirm

## Step 7: Update Frontend
1. Open `ai-sandbox.html`
2. Find this line:
   ```javascript
   : 'https://rcm-backend.vercel.app'; // Replace with your actual Vercel backend URL
   ```
3. Replace with your actual backend URL from Step 4
4. Save the file
5. Commit and push to GitHub:
   ```bash
   git add ai-sandbox.html
   git commit -m "Update backend URL to deployed Vercel instance"
   git push
   ```

## Step 8: Test It!
1. Go to https://xyzaixyz.com/ai-sandbox.html
2. Enter a test message
3. You should now see real API responses!

## 🎉 Done!
Your backend is now deployed and your GitHub Pages site can communicate with it securely.

## Troubleshooting
- **CORS errors?** Make sure the backend URL is correct and includes `https://`
- **API errors?** Double-check your environment variables in Vercel
- **Still using demo mode?** Clear your browser cache and refresh