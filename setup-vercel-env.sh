#!/bin/bash

# Script to set up Vercel environment variables

echo "🚀 Setting up Vercel Environment Variables"
echo ""

# Check if MongoDB URI is provided
if [ -z "$1" ]; then
    echo "❌ Please provide your MongoDB Atlas connection string"
    echo ""
    echo "Usage: ./setup-vercel-env.sh 'mongodb+srv://user:pass@cluster.mongodb.net/expense-manager'"
    echo ""
    echo "To get your MongoDB Atlas connection string:"
    echo "1. Go to https://cloud.mongodb.com/"
    echo "2. Click 'Connect' on your cluster"
    echo "3. Choose 'Connect your application'"
    echo "4. Copy the connection string"
    echo "5. Replace <username> and <password> with your database user credentials"
    echo "6. Add /expense-manager at the end"
    exit 1
fi

MONGODB_URI=$1
PROJECT_URL="https://expense-manager-ohnncqx4t-developer-deamons-projects.vercel.app"

# Generate a random JWT secret if not provided
if [ -z "$2" ]; then
    JWT_SECRET=$(openssl rand -hex 32)
    echo "🔑 Generated JWT_SECRET: $JWT_SECRET"
else
    JWT_SECRET=$2
fi

echo "📝 Setting environment variables..."
echo ""

# Add MongoDB URI
echo "Adding MONGODB_URI..."
echo "$MONGODB_URI" | vercel env add MONGODB_URI production

# Add JWT Secret
echo "Adding JWT_SECRET..."
echo "$JWT_SECRET" | vercel env add JWT_SECRET production

# Add Frontend URL
echo "Adding FRONTEND_URL..."
echo "$PROJECT_URL" | vercel env add FRONTEND_URL production

echo ""
echo "✅ Environment variables set!"
echo ""
echo "🔄 Redeploying..."
vercel --prod

echo ""
echo "✅ Deployment complete!"
echo "🌐 Your app: $PROJECT_URL"

