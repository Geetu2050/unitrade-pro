# UniTrade Pro - Vercel Deployment Guide

## 🚀 Deployment Strategy

Your project has both frontend and backend components. Here's how to deploy them:

### 📋 **Step 1: Deploy Backend First**

#### Option A: Railway (Recommended)
1. Go to [Railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project from GitHub
4. Connect your repository
5. Select the `server` folder as root directory
6. Add environment variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unitrade_pro
   JWT_SECRET=your_super_secret_jwt_key_here
   ```
7. Deploy and get your backend URL (e.g., `https://unitrade-pro-backend.railway.app`)

#### Option B: Render
1. Go to [Render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `server`
5. Add environment variables
6. Deploy

### 📋 **Step 2: Deploy Frontend to Vercel**

#### Method 1: Vercel CLI (Recommended)
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. In your project root directory, run:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? (Your account)
   - Link to existing project? `N`
   - Project name: `unitrade-pro`
   - Directory: `./` (current directory)
   - Override settings? `N`

5. Add environment variable:
   ```bash
   vercel env add VITE_API_URL
   ```
   Enter your backend URL: `https://your-backend-url.railway.app`

6. Redeploy:
   ```bash
   vercel --prod
   ```

#### Method 2: Vercel Dashboard
1. Go to [Vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: `Vite`
   - Root Directory: `./` (leave empty)
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Add Environment Variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend-url.railway.app`
7. Deploy

### 📋 **Step 3: Update Configuration**

After deployment, update your `vercel.json` with the actual backend URL:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "https://YOUR_ACTUAL_BACKEND_URL.railway.app/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_URL": "https://YOUR_ACTUAL_BACKEND_URL.railway.app"
  }
}
```

### 📋 **Step 4: Database Setup**

#### Option A: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create free cluster
3. Create database user
4. Get connection string
5. Update backend environment variable:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unitrade_pro
   ```

#### Option B: Railway MongoDB
1. In Railway dashboard
2. Add MongoDB service
3. Use provided connection string

### 📋 **Step 5: Test Deployment**

1. Visit your Vercel URL
2. Test registration/login
3. Test trading functionality
4. Check if portfolio updates work

## 🔧 **Troubleshooting**

### Common Issues:

1. **CORS Errors**: Make sure backend has CORS enabled
2. **API Not Found**: Check if backend URL is correct
3. **Database Connection**: Verify MongoDB URI is correct
4. **Build Errors**: Check if all dependencies are in package.json

### Environment Variables Checklist:

**Backend (.env):**
- `PORT=5000`
- `MONGODB_URI=mongodb+srv://...`
- `JWT_SECRET=your_secret_key`

**Frontend (Vercel):**
- `VITE_API_URL=https://your-backend-url.railway.app`

## 📊 **Deployment URLs**

After deployment, you'll have:
- **Frontend**: `https://unitrade-pro.vercel.app`
- **Backend**: `https://unitrade-pro-backend.railway.app`

## 🎯 **Next Steps**

1. Deploy backend to Railway/Render
2. Get backend URL
3. Deploy frontend to Vercel with backend URL
4. Test all functionality
5. Share your live application!

---

**Your UniTrade Pro will be live and accessible to anyone on the internet!** 🚀✨
