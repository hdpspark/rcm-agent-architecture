# 🎯 Even Easier: Deploy via GitHub Integration

This method doesn't require any command line - just clicks!

## Step 1: Push Backend to GitHub
The backend is already in your repo, so we're good! ✅

## Step 2: Import to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Choose your `rcm-agent-architecture` repository
4. In "Configure Project":
   - **Root Directory**: Click "Edit" and type `backend`
   - **Framework Preset**: Other
   - **Build Command**: Leave empty
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

## Step 3: Add Environment Variables
Before deploying, expand "Environment Variables" section and add:

```
OPENAI_API_KEY=your-key-here
CLAUDE_API_KEY=your-key-here
GOOGLE_API_KEY=your-key-here
MISTRAL_API_KEY=your-key-here
OPENROUTER_API_KEY=your-key-here
GROQ_API_KEY=your-key-here
```

## Step 4: Deploy
Click "Deploy" and wait ~2 minutes

## Step 5: Get Your URL
After deployment, you'll see your URL like:
`https://rcm-agent-architecture-backend.vercel.app`

## Step 6: Update Frontend
Update the BACKEND_URL in ai-sandbox.html with your new URL

## That's it! 🎉