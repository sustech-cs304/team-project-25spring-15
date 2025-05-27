# Deployment Guide

This document provides instructions for deploying the Intelligent Course-Aware IDE in production environments.

## Prerequisites

- Linux server (Ubuntu 20.04 LTS recommended)
- Docker and Docker Compose
- MySQL 8.0+
- Nginx
- SSL certificate
- Domain name (optional but recommended)

## System Requirements

### Minimum Requirements

- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB
- Network: 100Mbps

### Recommended Requirements

- CPU: 4 cores
- RAM: 8GB
- Storage: 50GB
- Network: 1Gbps

## Deployment Steps

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y docker.io docker-compose nginx

# Start and enable services
sudo systemctl start docker
sudo systemctl enable docker
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2. Database Setup

```bash
# Create database directory
sudo mkdir -p /data/mysql
sudo chown -R 999:999 /data/mysql

# Create docker-compose.yml for MySQL
cat << EOF > docker-compose.mysql.yml
version: '3.8'
services:
  mysql:
    image: mysql:8.0
    container_name: ide_mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: your_root_password
      MYSQL_DATABASE: mysqlTest
      MYSQL_USER: ide_user
      MYSQL_PASSWORD: your_password
    volumes:
      - /data/mysql:/var/lib/mysql
    ports:
      - "3306:3306"
EOF

# Start MySQL
docker-compose -f docker-compose.mysql.yml up -d
```

### 3. Backend Deployment

```bash
# Create application directory
sudo mkdir -p /opt/ide/backend
cd /opt/ide/backend

# Copy backend files
cp -r Backend/intelligent-course-aware-ide/* /opt/ide/backend/

# Create docker-compose.yml for backend
cat << EOF > docker-compose.yml
version: '3.8'
services:
  backend:
    build: .
    container_name: ide_backend
    restart: always
    environment:
      - GF_GCFG_FILE=/app/manifest/config/config.yaml
    volumes:
      - ./manifest/config:/app/manifest/config
      - ./uploads:/app/uploads
    ports:
      - "8000:8000"
    depends_on:
      - mysql
EOF

# Build and start backend
docker-compose up -d
```

### 4. Frontend Deployment

```bash
# Create frontend directory
sudo mkdir -p /opt/ide/frontend
cd /opt/ide/frontend

# Copy frontend files
cp -r Frontend/nextjs-dashboard/* /opt/ide/frontend/

# Create docker-compose.yml for frontend
cat << EOF > docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    container_name: ide_frontend
    restart: always
    ports:
      - "3000:3000"
EOF

# Build and start frontend
docker-compose up -d
```

### 5. Nginx Configuration

```nginx
# /etc/nginx/conf.d/ide.conf
server {
    listen 80;
    server_name your_domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your_domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 6. SSL Certificate Setup

```bash
# Install certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your_domain.com
```

### 7. Monitoring Setup

```bash
# Install Prometheus and Grafana
docker-compose -f docker-compose.monitoring.yml up -d
```

## Backup and Recovery

### Database Backup

```bash
# Create backup script
cat << EOF > backup.sh
#!/bin/bash
BACKUP_DIR="/backup/mysql"
DATE=\$(date +%Y%m%d_%H%M%S)
docker exec ide_mysql mysqldump -u root -p your_root_password mysqlTest > \$BACKUP_DIR/backup_\$DATE.sql
EOF

# Set up daily backup cron job
echo "0 0 * * * /backup.sh" | crontab -
```

### File Backup

```bash
# Backup uploads directory
tar -czf /backup/uploads_$(date +%Y%m%d_%H%M%S).tar.gz /opt/ide/backend/uploads
```

## Maintenance

### Log Rotation

```bash
# /etc/logrotate.d/ide
/opt/ide/backend/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 0640 www-data www-data
}
```

### Health Checks

```bash
# Create health check script
cat << EOF > health_check.sh
#!/bin/bash
curl -f http://localhost:8000/health || echo "Backend is down"
curl -f http://localhost:3000/health || echo "Frontend is down"
EOF
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**

```bash
# Check MySQL logs
docker logs ide_mysql

# Check MySQL connection
docker exec -it ide_mysql mysql -u ide_user -p
```

2. **Backend Service Issues**

```bash
# Check backend logs
docker logs ide_backend

# Restart backend service
docker-compose restart backend
```

3. **Frontend Service Issues**

```bash
# Check frontend logs
docker logs ide_frontend

# Rebuild frontend
docker-compose up -d --build frontend
```

### Performance Tuning

1. **MySQL Optimization**

```bash
# Add to my.cnf
innodb_buffer_pool_size = 4G
innodb_log_file_size = 512M
innodb_flush_log_at_trx_commit = 2
```

2. **Nginx Optimization**

```nginx
# Add to nginx.conf
worker_processes auto;
worker_connections 2048;
keepalive_timeout 65;
gzip on;
```

## Security Considerations

1. **Firewall Configuration**

```bash
# Allow only necessary ports
sudo ufw allow 80,443,22
sudo ufw enable
```

2. **Regular Updates**

```bash
# Create update script
cat << EOF > update.sh
#!/bin/bash
docker-compose pull
docker-compose up -d
EOF
```

3. **SSL Configuration**

```nginx
# Add to nginx SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_prefer_server_ciphers on;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
```
