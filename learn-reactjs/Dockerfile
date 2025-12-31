# Stage 1: Build React
FROM node:18-alpine as build
WORKDIR /app

# Build arguments cho environment variables
# Nếu không truyền, sẽ dùng giá trị mặc định (empty - dùng Nginx proxy)
ARG REACT_APP_API_URL=
ARG REACT_APP_FRONTEND_URL=
ARG NODE_ENV=production

# Set environment variables cho build
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_FRONTEND_URL=$REACT_APP_FRONTEND_URL
ENV NODE_ENV=$NODE_ENV

COPY package*.json ./
RUN npm install
COPY . .

# Build React app với environment variables
RUN npm run build

# Stage 2: Serve bằng Nginx
FROM nginx:alpine
# Copy file build từ stage 1 vào thư mục nginx
COPY --from=build /app/build /usr/share/nginx/html
# Copy file config nginx (sẽ tạo ở bước dưới)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]