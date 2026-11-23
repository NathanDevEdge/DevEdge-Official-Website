#!/bin/bash
# Run this on the Lightsail server after initial setup to deploy updates.
# Usage: ./scripts/deploy.sh

set -e

APP_DIR="/var/www/devedge"

echo "→ Pulling latest code..."
cd "$APP_DIR"
git pull origin main

echo "→ Installing dependencies..."
pnpm install --frozen-lockfile

echo "→ Building..."
pnpm build

echo "→ Creating log directory..."
mkdir -p logs

echo "→ Restarting app..."
pm2 restart ecosystem.config.cjs --env production

echo "✓ Deployed successfully."
pm2 status
