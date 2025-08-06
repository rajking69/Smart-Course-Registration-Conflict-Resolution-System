# SMART-CRS Deployment Guide

## Prerequisites

- Node.js 16+ installed on the server
- MySQL 8.0+ database server
- Domain name configured
- SSL certificate obtained
- PM2 or similar process manager installed (`npm install -g pm2`)

## Backend Deployment

1. Database Setup:
   ```bash
   mysql -u root -p < config/schema.sql
   ```

2. Install Dependencies:
   ```bash
   npm install --production
   ```

3. Set Environment Variables:
   - Copy .env.production to .env
   - Update all placeholder values with actual production values

4. Start Server with PM2:
   ```bash
   pm2 start app.ts --name "smart-crs-api"
   pm2 save
   ```

## Frontend Deployment

### Option 1: Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy using Vercel's automatic deployment

### Option 2: Nginx Static Hosting
1. Copy the dist/ directory to your web server
2. Configure Nginx:
   ```nginx
   server {
       listen 443 ssl;
       server_name your-domain.com;

       ssl_certificate /path/to/cert.pem;
       ssl_certificate_key /path/to/key.pem;

       root /path/to/dist;
       index index.html;

       location / {
           try_files $uri $uri/ /index.html;
       }

       # Proxy API requests to backend
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Security Checklist

1. SSL/TLS Configuration:
   - Enable HTTPS
   - Configure SSL certificates
   - Set up automatic renewal

2. Database Security:
   - Use strong passwords
   - Limit database user permissions
   - Enable database encryption at rest
   - Configure regular backups

3. Application Security:
   - Set secure HTTP headers
   - Implement rate limiting
   - Enable CORS with specific origins
   - Store sensitive data in environment variables

## Monitoring Setup

1. Install monitoring tools:
   ```bash
   pm2 install pm2-logrotate
   pm2 set pm2-logrotate:max_size 10M
   pm2 set pm2-logrotate:retain 10
   ```

2. Configure application logging:
   - Set up error logging
   - Implement request logging
   - Configure log rotation

3. Set up monitoring alerts:
   - CPU usage
   - Memory usage
   - Error rate
   - Response time

## Backup Strategy

1. Database Backups:
   ```bash
   # Add to crontab
   0 0 * * * mysqldump -u [user] -p[pass] smart_crs_db > /backup/db-$(date +%Y%m%d).sql
   ```

2. File Backups:
   - Configure regular backups of uploaded files
   - Store backups in secure, offsite location
   - Test backup restoration periodically

## Maintenance

1. Regular Updates:
   - Keep Node.js version updated
   - Update npm packages regularly
   - Monitor security advisories

2. Performance Monitoring:
   - Monitor application metrics
   - Optimize database queries
   - Review and optimize caching strategies

## Troubleshooting

Common issues and solutions:

1. Database Connection Issues:
   - Check database credentials
   - Verify network connectivity
   - Check database server status

2. Application Errors:
   - Check application logs
   - Verify environment variables
   - Check disk space

3. Performance Issues:
   - Monitor server resources
   - Check database query performance
   - Review application logs for bottlenecks

## Emergency Contacts

- System Administrator: [Name] [Contact]
- Database Administrator: [Name] [Contact]
- Development Team Lead: [Name] [Contact]

## Rollback Procedure

1. Backend Rollback:
   ```bash
   pm2 stop smart-crs-api
   git checkout [previous-version]
   npm install --production
   pm2 start app.ts --name "smart-crs-api"
   ```

2. Frontend Rollback:
   - Keep previous build artifacts
   - Switch to previous version in CDN/hosting
   - Verify application functionality

Remember to test the deployment process in a staging environment before applying to production.
