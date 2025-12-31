# Hướng dẫn cấu hình Environment Variables cho Local và AWS EC2

## 📋 Tổng quan

Project này cần cấu hình environment variables cho cả **local development** và **production (AWS EC2)** để đảm bảo API calls hoạt động đúng.

## 🏠 Local Development

### Backend (CRUD MONGODB)

1. Tạo file `.env` trong thư mục `CRUD MONGODB/`:

```env
# Database
DB_URL=mongodb://127.0.0.1/crud_products

# Session Secret
SESSION_SECRET=your-super-secret-key-change-this

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Allowed Origins (optional, comma-separated)
ALLOWED_ORIGINS=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Environment
NODE_ENV=development

# Port
PORT=8080
```

2. Chạy backend:
```bash
cd "CRUD MONGODB"
npm install
npm start
```

### Frontend (learn-reactjs)

1. Tạo file `.env` trong thư mục `learn-reactjs/`:

```env
# API URL - Local development: dùng localhost
REACT_APP_API_URL=http://localhost:8080

# Frontend URL
REACT_APP_FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

2. Chạy frontend:
```bash
cd learn-reactjs
npm install
npm start
```

## ☁️ Production (AWS EC2)

### Cấu hình trên EC2

1. SSH vào EC2 instance:
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

2. Tạo thư mục app (nếu chưa có):
```bash
mkdir -p /home/ubuntu/app
cd /home/ubuntu/app
```

3. Tạo file `.env` cho Backend:
```bash
nano "CRUD MONGODB/.env"
```

Nội dung:
```env
# Database (Docker internal network)
DB_URL=mongodb://mongo-db:27017/crud_products

# Session Secret (thay đổi thành giá trị mạnh)
SESSION_SECRET=your-production-secret-key-very-strong

# Frontend URL (thay bằng IP hoặc domain của EC2)
FRONTEND_URL=http://your-ec2-ip
# Hoặc nếu có domain:
# FRONTEND_URL=https://your-domain.com

# Allowed Origins (nếu có nhiều origins)
ALLOWED_ORIGINS=http://your-ec2-ip,https://your-domain.com

# Google OAuth (Production credentials)
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret

# Facebook OAuth (Production credentials)
FACEBOOK_APP_ID=your-production-facebook-app-id
FACEBOOK_APP_SECRET=your-production-facebook-app-secret

# Environment
NODE_ENV=production

# Port
PORT=8080
```

4. Tạo file `.env` cho Frontend:
```bash
nano learn-reactjs/.env
```

**Lưu ý quan trọng**: Vì frontend dùng Nginx proxy, có 2 cách cấu hình:

#### Cách 1: Dùng Nginx Proxy (Khuyến nghị)
```env
# Để trống - Nginx sẽ proxy /api sang backend
REACT_APP_API_URL=

# Frontend URL
REACT_APP_FRONTEND_URL=http://your-ec2-ip
# Hoặc nếu có domain:
# REACT_APP_FRONTEND_URL=https://your-domain.com

NODE_ENV=production
```

#### Cách 2: Direct API Call
```env
# Gọi trực tiếp backend (cần mở port 8080)
REACT_APP_API_URL=http://your-ec2-ip:8080

# Frontend URL
REACT_APP_FRONTEND_URL=http://your-ec2-ip

NODE_ENV=production
```

### Cấu hình Nginx (đã có sẵn trong nginx.conf)

File `learn-reactjs/nginx.conf` đã được cấu hình để proxy `/api` sang backend container. Không cần thay đổi gì.

### Cấu hình Security Group trên AWS

Đảm bảo Security Group của EC2 instance cho phép:
- **Port 80** (HTTP) - cho frontend
- **Port 8080** (nếu dùng direct API call) - cho backend
- **Port 22** (SSH) - để deploy

### Deploy với Docker Compose

1. Đảm bảo file `docker-compose.yml` đã có trong `/home/ubuntu/app`
2. Chạy:
```bash
cd /home/ubuntu/app
docker-compose pull
docker-compose up -d
```

## 🔄 CI/CD Workflow

GitHub Actions workflow sẽ tự động:
1. Build và push Docker images
2. Copy `docker-compose.yml` lên EC2
3. Pull images mới và restart containers

**Lưu ý**: File `.env` cần được tạo thủ công trên EC2 lần đầu tiên. CI/CD sẽ không tự động tạo file này.

## 📝 Checklist

### Local Development
- [ ] Tạo `.env` cho backend với `DB_URL`, `FRONTEND_URL`
- [ ] Tạo `.env` cho frontend với `REACT_APP_API_URL=http://localhost:8080`
- [ ] Cấu hình OAuth credentials (Google, Facebook)
- [ ] Test API calls hoạt động

### Production (EC2)
- [ ] Tạo `.env` cho backend trên EC2
- [ ] Tạo `.env` cho frontend trên EC2
- [ ] Cấu hình `FRONTEND_URL` với IP/domain của EC2
- [ ] Cấu hình OAuth với production credentials
- [ ] Cấu hình Security Group trên AWS
- [ ] Test API calls từ browser

## 🐛 Troubleshooting

### Lỗi CORS
- Kiểm tra `FRONTEND_URL` và `ALLOWED_ORIGINS` trong backend `.env`
- Đảm bảo frontend URL chính xác (không có trailing slash)

### API không gọi được
- Kiểm tra `REACT_APP_API_URL` trong frontend `.env`
- Nếu dùng Nginx proxy, để `REACT_APP_API_URL` trống
- Kiểm tra Nginx logs: `docker logs phone-frontend`

### Session không lưu được
- Kiểm tra `SESSION_SECRET` đã được set
- Kiểm tra cookie settings trong `app.js` (secure flag cho HTTPS)

## 📚 Tham khảo

- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Docker Compose Environment Variables](https://docs.docker.com/compose/environment-variables/)
- [Express CORS Configuration](https://expressjs.com/en/resources/middleware/cors.html)

