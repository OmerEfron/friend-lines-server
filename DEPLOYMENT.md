# 🚀 Friend Lines Deployment Guide

This guide will walk you through deploying your Friend Lines application using Docker, GitHub Actions, and Render.

## 📋 Prerequisites

- [GitHub account](https://github.com)
- [Render account](https://render.com) (free tier)
- [MongoDB Atlas account](https://mongodb.com/atlas) (free tier)
- [Firebase project](https://console.firebase.google.com) (free tier)
- Docker installed locally (for testing)

## 🏗️ Architecture Overview

```
GitHub → GitHub Actions → Docker Registry → Render → Production
   ↓           ↓              ↓           ↓         ↓
  Code    Build & Test    Push Image   Deploy    Live API
```

## 🚀 Step-by-Step Deployment

### **Step 1: Prepare Your Repository**

1. **Push all changes to GitHub:**
   ```bash
   git add .
   git commit -m "feat: add Docker deployment configuration"
   git push origin main
   ```

2. **Verify files are committed:**
   - ✅ `Dockerfile`
   - ✅ `docker-compose.yml`
   - ✅ `.github/workflows/deploy.yml`
   - ✅ `render.yaml`
   - ✅ `scripts/deploy.sh`

### **Step 2: Set Up GitHub Secrets**

1. **Go to your GitHub repository**
2. **Navigate to Settings → Secrets and variables → Actions**
3. **Add the following secrets:**

   | Secret Name | Description | How to Get |
   |-------------|-------------|------------|
   | `RENDER_SERVICE_ID` | Your Render service ID | Will get this in Step 4 |
   | `RENDER_API_KEY` | Your Render API key | [Render Dashboard → Account → API Keys](https://dashboard.render.com/account/api-keys) |

### **Step 3: Set Up MongoDB Atlas**

1. **Create a new cluster** (free tier)
2. **Create a database user** with read/write permissions
3. **Whitelist your IP** (or use `0.0.0.0/0` for all IPs)
4. **Get your connection string** (format: `mongodb+srv://username:password@cluster.mongodb.net/friend-lines?retryWrites=true&w=majority`)

### **Step 4: Set Up Render**

1. **Go to [Render Dashboard](https://dashboard.render.com)**
2. **Click "New +" → "Web Service"**
3. **Connect your GitHub repository**
4. **Configure the service:**
   - **Name**: `friend-lines-api`
   - **Environment**: `Docker`
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Dockerfile Path**: `./Dockerfile`
   - **Docker Context**: `.`

5. **Set Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secure_jwt_secret_key
   FIREBASE_PROJECT_ID=friend-lines-notifications
   FIREBASE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_firebase_key
   ```

6. **Click "Create Web Service"**
7. **Copy the Service ID** from the service URL (you'll need this for GitHub secrets)

### **Step 5: Prepare Firebase for Production**

1. **Convert your Firebase service account to base64:**
   ```bash
   # On macOS/Linux
   base64 -i firebase-service-account.json
   
   # Copy the output and use it as FIREBASE_SERVICE_ACCOUNT_BASE64
   ```

2. **Update the environment variable in Render** with this base64 string

### **Step 6: Test the Deployment**

1. **Make a small change to your code**
2. **Push to main branch:**
   ```bash
   git add .
   git commit -m "test: deployment pipeline"
   git push origin main
   ```

3. **Watch the GitHub Actions workflow** in the Actions tab
4. **Check Render dashboard** for deployment status

## 🧪 Local Testing

### **Test Docker Build Locally:**
```bash
# Build the image
./scripts/deploy.sh build

# Start local environment
./scripts/deploy.sh start

# Check logs
./scripts/deploy.sh logs

# Stop environment
./scripts/deploy.sh stop
```

### **Test with Docker Compose:**
```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## 🔍 Troubleshooting

### **Common Issues:**

1. **Build fails in GitHub Actions:**
   - Check Dockerfile syntax
   - Verify all files are committed
   - Check GitHub Actions logs

2. **Deployment fails in Render:**
   - Verify environment variables
   - Check Docker build logs
   - Ensure MongoDB Atlas is accessible

3. **Firebase not working in production:**
   - Verify base64 encoding of service account
   - Check Firebase project ID
   - Ensure service account has correct permissions

### **Debug Commands:**
```bash
# Check Docker image
docker images friend-lines

# Run container locally
docker run -p 3000:3000 friend-lines:latest

# Check container logs
docker logs <container_id>

# Inspect container
docker inspect <container_id>
```

## 📱 Mobile App Integration

Once deployed, your mobile app can use:
- **Production API**: `https://your-app-name.onrender.com`
- **FCM Notifications**: Working from production
- **MongoDB Atlas**: Persistent data storage
- **Auto-scaling**: Handles traffic spikes

## 🔄 CI/CD Pipeline

The GitHub Actions workflow automatically:
1. **Runs tests** on every push/PR
2. **Builds Docker image** on main branch
3. **Pushes to GitHub Container Registry**
4. **Deploys to Render** automatically

## 📊 Monitoring

- **Render Dashboard**: Service health, logs, metrics
- **GitHub Actions**: Build and deployment status
- **MongoDB Atlas**: Database performance and usage
- **Firebase Console**: FCM delivery statistics

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review GitHub Actions logs
3. Check Render deployment logs
4. Verify environment variables
5. Test locally with Docker

## 🎉 Success!

Once deployed, you'll have:
- ✅ **Production API** running on Render
- ✅ **Automated deployments** via GitHub Actions
- ✅ **Docker-based** infrastructure
- ✅ **MongoDB Atlas** database
- ✅ **FCM notifications** working
- ✅ **Auto-scaling** and monitoring
- ✅ **SSL certificates** included
- ✅ **Global CDN** for fast response times

Your Friend Lines platform is now ready for production use! 🚀
