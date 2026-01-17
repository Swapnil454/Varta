# Production Deployment Checklist

## 🔐 Security
- [ ] Generate strong NEXTAUTH_SECRET (min 32 characters)
- [ ] Use production database with proper auth
- [ ] Enable HTTPS and set NEXTAUTH_URL correctly  
- [ ] Rotate all API keys and secrets
- [ ] Review CORS settings
- [ ] Enable rate limiting

## 📧 Email Configuration
- [ ] Verify sender domain in SendGrid
- [ ] Set up proper SPF/DKIM records
- [ ] Configure email templates for production

## 🗄️ Database
- [ ] Use production MongoDB Atlas cluster
- [ ] Enable database authentication
- [ ] Set up database backups
- [ ] Configure connection pooling

## 🚀 Performance
- [ ] Enable production builds: `npm run build`
- [ ] Set up CDN for static assets
- [ ] Implement Redis caching (optional)
- [ ] Configure image optimization

## 📊 Monitoring
- [ ] Set up error tracking (Sentry)
- [ ] Configure application monitoring
- [ ] Set up uptime monitoring
- [ ] Implement health checks

## 🔒 Production Environment
```bash
# Generate secure secret
NEXTAUTH_SECRET=$(openssl rand -base64 32)

# Production database
DATABASE_URL="mongodb+srv://prod-user:secure-pass@prod-cluster.mongodb.net/messenger-prod"

# Production domain
NEXTAUTH_URL="https://yourdomain.com"
```

## 🚨 Critical Issues to Address
1. **Remove all sensitive data from .env**
2. **Stop logging OTP codes**
3. **Implement proper error boundaries**
4. **Add input validation on all routes**
5. **Set up SSL certificates**