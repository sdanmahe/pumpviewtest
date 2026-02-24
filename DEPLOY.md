# Deploy to Vercel

## Quick Deploy (Recommended)

Click this button to deploy directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## Manual Deploy via CLI

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login
```bash
vercel login
```

### Step 3: Deploy
```bash
cd /path/to/water-flow-dashboard
vercel --prod
```

## Environment Variables Setup

After deployment, add these environment variables in Vercel Dashboard:

| Variable | Description |
|----------|-------------|
| `VITE_FIREBASE_API_KEY` | Your Firebase API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Auth domain (e.g., `your-project.firebaseapp.com`) |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key |

### Set via CLI:
```bash
vercel env add VITE_FIREBASE_API_KEY
vercel env add VITE_FIREBASE_AUTH_DOMAIN
vercel env add VITE_FIREBASE_PROJECT_ID
vercel env add VITE_FIREBASE_STORAGE_BUCKET
vercel env add VITE_FIREBASE_MESSAGING_SENDER_ID
vercel env add VITE_FIREBASE_APP_ID
vercel env add VITE_GOOGLE_MAPS_API_KEY
```

Then redeploy:
```bash
vercel --prod
```

## GitHub Integration (Auto Deploy)

1. Push your code to GitHub
2. Import project in Vercel Dashboard
3. Connect your GitHub repository
4. Add environment variables
5. Vercel will auto-deploy on every push to main branch

## Build Settings

Vercel will automatically detect:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## Troubleshooting

### Google Maps not loading?
- Enable "Maps JavaScript API" in Google Cloud Console
- Add your Vercel domain to allowed referrers

### Firebase connection issues?
- Check Firestore rules allow read access
- Verify all environment variables are set correctly
