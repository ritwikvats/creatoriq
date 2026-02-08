# CreatorIQ Deployment Guide

This guide covers deploying the CreatorIQ application to production.

## Architecture Overview

CreatorIQ consists of two main components:

1. **Frontend (Next.js)** - `/apps/web`
2. **Backend API (Express + TypeScript)** - `/apps/api`
3. **Database** - Supabase (PostgreSQL)

## Prerequisites

- Node.js 18+ and pnpm installed
- Supabase project created
- Google Cloud Project (for YouTube API)
- Facebook App (for Instagram API)
- Domain name (optional, for production)

## Environment Variables

### Frontend (.env)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# API URL (update for production)
NEXT_PUBLIC_API_URL=https://api.yourdo main.com
```

### Backend (.env)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# API
API_PORT=3001
FRONTEND_URL=https://yourdomain.com

# YouTube/Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/youtube/callback

# Instagram/Facebook
FACEBOOK_APP_ID=your-app-id
FACEBOOK_APP_SECRET=your-app-secret
FACEBOOK_REDIRECT_URI=https://api.yourdomain.com/instagram/callback

# Security
JWT_SECRET=generate-a-secure-random-string
ENCRYPTION_KEY=generate-64-char-hex-string

# Groq AI
GROQ_API_KEY=your-groq-api-key
```

### Generate Secure Keys

```bash
# Generate JWT Secret (32 characters)
openssl rand -base64 32

# Generate Encryption Key (64 hex characters)
openssl rand -hex 32
```

## Deployment Options

### Option 1: Vercel + Railway (Recommended)

#### Deploy Frontend to Vercel

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy from root**
   ```bash
   cd /Users/ritwikvats/CreatorIQ
   vercel --prod
   ```

3. **Configure in Vercel Dashboard**
   - Build Command: `cd apps/web && pnpm install && pnpm build`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install`
   - Environment Variables: Add all frontend env vars

#### Deploy Backend to Railway

1. **Create Railway Account**: https://railway.app

2. **Create New Project** → Deploy from GitHub

3. **Configure Build**
   - Build Command: `cd apps/api && pnpm install && pnpm build`
   - Start Command: `cd apps/api && node dist/index.js`
   - Add all backend environment variables

4. **Enable Health Checks**
   - Path: `/health`
   - Port: 3001

#### Update OAuth Redirect URIs

After deployment, update redirect URIs in:
- Google Cloud Console (YouTube)
- Facebook Developer Console (Instagram)

### Option 2: Docker + Cloud Provider

#### Build Docker Images

Create `Dockerfile` for API:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api ./apps/api

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build
WORKDIR /app/apps/api
RUN pnpm build

# Expose port
EXPOSE 3001

# Start
CMD ["node", "dist/index.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3001:3001"
    environment:
      - NODE_ENV=production
      - API_PORT=3001
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3001/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

### Option 3: Traditional VPS (DigitalOcean, AWS, etc.)

#### Setup Server

```bash
# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm

# Install PM2 for process management
npm install -g pm2
```

#### Deploy Application

```bash
# Clone repository
git clone https://github.com/yourusername/creatoriq.git
cd creatoriq

# Install dependencies
pnpm install

# Build
pnpm build

# Start API with PM2
cd apps/api
pm2 start dist/index.js --name creatoriq-api

# Save PM2 config
pm2 save
pm2 startup
```

#### Setup Nginx Reverse Proxy

```nginx
# /etc/nginx/sites-available/creatoriq

# API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Frontend (if hosting on same server)
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable sites:
```bash
sudo ln -s /etc/nginx/sites-available/creatoriq /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Setup SSL with Let's Encrypt

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## Database Setup

### Supabase Schema

The database schema is already set up in Supabase. Ensure these tables exist:

- `users` - User profiles
- `connected_platforms` - OAuth connections
- `analytics_snapshots` - Historical analytics data
- `revenue` - Revenue tracking
- `deals` - Brand deal management

### Run Migrations

If you need to recreate the schema:

```sql
-- Run the SQL scripts in /database folder
```

## Monitoring & Error Tracking

### Health Check Endpoint

The API includes a health check at `/health`:

```bash
curl https://api.yourdomain.com/health
```

Response:
```json
{
  "status": "ok",
  "message": "CreatorIQ API is running"
}
```

### Logging

The application uses structured logging with the custom Logger service:

```typescript
import { apiLogger } from './services/logger.service';

apiLogger.info('Server started');
apiLogger.error('Something went wrong', error);
```

### Recommended Monitoring Tools

1. **Sentry** - Error tracking
   ```bash
   pnpm add @sentry/node @sentry/nextjs
   ```

2. **Uptime Robot** - Uptime monitoring
   - Monitor `/health` endpoint every 5 minutes

3. **LogRocket** or **DataDog** - Performance monitoring

4. **Posthog** - Analytics and session replay

### Environment-Specific Configuration

```typescript
// apps/api/src/services/logger.service.ts
if (process.env.NODE_ENV === 'production') {
    // Initialize Sentry
    Sentry.init({
        dsn: process.env.SENTRY_DSN,
        environment: process.env.NODE_ENV,
    });
}
```

## Performance Optimization

### Caching

Consider adding Redis for caching:

```bash
# Install Redis client
pnpm add redis

# Connect to Redis
import { createClient } from 'redis';
const redis = createClient({ url: process.env.REDIS_URL });
```

### Rate Limiting

Add rate limiting to protect APIs:

```bash
pnpm add express-rate-limit

import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Security Checklist

- [ ] All environment variables set correctly
- [ ] HTTPS enabled (SSL certificates)
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] SQL injection protection (using Supabase client)
- [ ] XSS protection (Content Security Policy)
- [ ] Authentication required on all protected routes
- [ ] Access tokens encrypted in database
- [ ] JWT secrets are strong and unique
- [ ] No sensitive data in logs

## Backup Strategy

### Database Backups

Supabase automatically backs up your database. You can also:

1. **Manual Backups**
   ```bash
   # Export from Supabase Dashboard
   # Settings → Database → Backup
   ```

2. **Automated Backups**
   ```bash
   # Use pg_dump via Supabase connection string
   pg_dump "postgresql://[CONNECTION_STRING]" > backup.sql
   ```

### Environment Variable Backups

Store encrypted copies of `.env` files in a secure location (1Password, AWS Secrets Manager, etc.)

## Post-Deployment Verification

1. **Test Health Check**
   ```bash
   curl https://api.yourdomain.com/health
   ```

2. **Test Authentication**
   - Login with a test account
   - Verify JWT token is issued

3. **Test Platform Connections**
   - Connect YouTube account
   - Connect Instagram account
   - Verify OAuth callbacks work

4. **Test Core Features**
   - View analytics dashboard
   - Check revenue tracking
   - Test tax calculator
   - Create a brand deal

5. **Monitor Logs**
   ```bash
   pm2 logs creatoriq-api
   ```

## Troubleshooting

### Common Issues

**API not responding**
- Check if process is running: `pm2 status`
- Check logs: `pm2 logs creatoriq-api`
- Verify environment variables

**OAuth redirects fail**
- Verify redirect URIs in Google/Facebook console
- Check `GOOGLE_REDIRECT_URI` and `FACEBOOK_REDIRECT_URI` env vars
- Ensure HTTPS is enabled

**Database connection fails**
- Verify Supabase credentials
- Check network/firewall rules
- Test connection from server

**Rate limiting too aggressive**
- Adjust rate limit settings
- Whitelist specific IPs if needed

## Scaling Considerations

As your user base grows:

1. **Horizontal Scaling** - Deploy multiple API instances behind a load balancer
2. **Database Optimization** - Add indexes, optimize queries
3. **Caching Layer** - Add Redis for frequently accessed data
4. **CDN** - Use CDN for static assets (Cloudflare, Vercel Edge)
5. **Queue System** - Add job queue for heavy operations (Bull, BullMQ)

## Support

For issues or questions:
- GitHub Issues: https://github.com/yourusername/creatoriq/issues
- Email: support@yourdomain.com

---

**Note**: This is a living document. Update it as your deployment process evolves.
