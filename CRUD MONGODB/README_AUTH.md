# Hướng dẫn tích hợp Google/Facebook Login với Passport.js

## 📦 Cài đặt dependencies

Chạy lệnh sau để cài đặt các package cần thiết:

```bash
npm install passport passport-google-oauth20 passport-facebook express-session
```

## 🔧 Cấu hình biến môi trường

Tạo file `.env` trong thư mục `CRUD MONGODB` với nội dung sau:

```env
# Database
DB_URL=mongodb://127.0.0.1/crud_products

# Session Secret (thay đổi thành giá trị ngẫu nhiên mạnh)
SESSION_SECRET=your-super-secret-key-change-this-in-production

# Frontend URL (để redirect sau khi đăng nhập)
FRONTEND_URL=http://localhost:3000

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret

# Environment
NODE_ENV=development
```

## 🔑 Lấy Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Vào **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Chọn **Web application**
6. Thêm **Authorized redirect URIs**: `http://localhost:8080/api/auth/google/callback`
7. Copy **Client ID** và **Client Secret** vào file `.env`

## 📘 Lấy Facebook App Credentials

### Bước 1: Tạo hoặc chọn App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Click **"Ứng dụng của tôi"** (My Apps) ở góc trên bên phải
3. Chọn **"Tạo ứng dụng"** (Create App) nếu chưa có app, hoặc chọn app hiện có từ danh sách

### Bước 2: Lấy App ID và App Secret

1. Vào **"Cài đặt ứng dụng"** (App Settings) > **"Cơ bản"** (Basic) trong menu bên trái
2. Tại đây bạn sẽ thấy:
   - **App ID** - Copy giá trị này
   - **App Secret** - Click **"Hiển thị"** (Show) để xem, sau đó copy
3. Lưu 2 giá trị này vào file `.env`:
   ```
   FACEBOOK_APP_ID=your-app-id-here
   FACEBOOK_APP_SECRET=your-app-secret-here
   ```

### Bước 3: Thêm Facebook Login Product (nếu chưa có)

1. Trong menu bên trái, tìm phần **"Sản phẩm"** (Products)
2. Nếu chưa thấy **"Facebook Login"**, click **"+"** để thêm sản phẩm
3. Chọn **"Facebook Login"** và click **"Thiết lập"** (Set Up)

### Bước 4: Cấu hình OAuth Redirect URI

1. Vào **"Cài đặt ứng dụng"** (App Settings) > **"Nâng cao"** (Advanced) trong menu bên trái
2. Tìm phần **"Xác thực ứng dụng"** (App Authentication)
3. Đảm bảo toggle **"Ứng dụng gốc hay ứng dụng dành cho máy tính?"** (Native or desktop app?) đang ở chế độ **TẮT** (OFF) - vì đây là web app
4. Trong trường **"Ủy quyền URL gọi lại"** (Authorized Redirect URIs), thêm:
   ```
   http://localhost:8080/api/auth/facebook/callback
   ```
5. Click **"Lưu thay đổi"** (Save Changes)

### Bước 5: Cấu hình Facebook Login Settings (tùy chọn)

1. Vào **"Sản phẩm"** (Products) > **"Facebook Login"** > **"Cài đặt"** (Settings)
2. Thêm **Valid OAuth Redirect URIs** (nếu có):
   ```
   http://localhost:8080/api/auth/facebook/callback
   ```
3. Lưu các thay đổi

### ⚠️ Lưu ý quan trọng:

- **Development mode**: App mới tạo sẽ ở chế độ Development, chỉ bạn và các tester được thêm vào mới có thể đăng nhập
- **Production**: Khi deploy lên production, cần submit app để Facebook review và chuyển sang Live mode
- **Callback URL**: Đảm bảo callback URL chính xác, bao gồm cả `http://` hoặc `https://`

## 🔧 Khắc phục lỗi thường gặp

### ❌ Lỗi: "Invalid Scopes: email"

**Nguyên nhân:**
Facebook API mới không chấp nhận scope `email` theo cách cũ, đặc biệt với app ở chế độ Development.

**Cách khắc phục:**

#### Giải pháp 1: Chỉ sử dụng public_profile (Đã được áp dụng trong code)

Code hiện tại đã được cập nhật để chỉ yêu cầu `public_profile`. Email sẽ được lấy tự động nếu user cho phép.

**Nếu vẫn gặp lỗi, thử các bước sau:**

1. **Kiểm tra App Settings:**

   - Vào **Settings** > **Basic**
   - Đảm bảo app không bị giới hạn

2. **Kiểm tra Facebook Login Settings:**

   - Vào **Products** > **Facebook Login** > **Settings**
   - Xóa tất cả scope/permission cũ nếu có
   - Đảm bảo chỉ có `public_profile` được yêu cầu

3. **Xóa cache và thử lại:**
   - Xóa cookies và cache của trình duyệt
   - Thử đăng nhập lại

#### Giải pháp 2: Yêu cầu email permission riêng (Nếu cần email bắt buộc)

Nếu bạn cần email bắt buộc, có thể thêm lại scope `email` nhưng cần cấu hình thêm:

1. **Trong Facebook App:**

   - Vào **App Review** > **Permissions and Features**
   - Yêu cầu permission `email` (có thể cần submit để review)

2. **Cập nhật code trong `routers/auth.js`:**
   ```javascript
   router.get(
     "/facebook",
     passport.authenticate("facebook", {
       scope: ["public_profile", "email"], // Thêm email nếu đã được approve
     })
   );
   ```

**Lưu ý:** Với app ở chế độ Development, bạn có thể test với chính tài khoản Facebook của mình mà không cần review. Nhưng để lấy email từ user khác, cần submit app để Facebook review.

### ❌ Lỗi: "Redirect URI mismatch"

**Nguyên nhân:**
Callback URL không khớp với URL đã đăng ký trong Facebook App.

**Cách khắc phục:**

1. Kiểm tra callback URL trong code: `/api/auth/facebook/callback`
2. Đảm bảo đã thêm đúng URL vào Facebook App Settings:
   - **Settings** > **Advanced** > **Authorized Redirect URIs**
   - Hoặc **Products** > **Facebook Login** > **Settings** > **Valid OAuth Redirect URIs**
3. URL phải khớp chính xác, bao gồm:
   - Protocol (`http://` hoặc `https://`)
   - Domain (`localhost:8080` hoặc domain của bạn)
   - Path (`/api/auth/facebook/callback`)

### ❌ Lỗi: "App Not Setup: This app is still in development mode"

**Nguyên nhân:**
App đang ở chế độ Development, chỉ developer và tester có thể đăng nhập.

**Cách khắc phục:**

1. **Thêm tester (cho development):**

   - Vào **Roles** > **Roles**
   - Thêm email của người cần test vào **Test Users** hoặc **Testers**

2. **Chuyển sang Live mode (cho production):**
   - Vào **App Review** > **Permissions and Features**
   - Submit app để Facebook review
   - Sau khi được approve, app sẽ chuyển sang Live mode

### ❌ Lỗi: "Can't Load URL: The domain of this URL isn't included in the app's domains"

**Nguyên nhân:**
Domain chưa được thêm vào App Domains trong Facebook App Settings.

**Cách khắc phục:**

1. Vào **Settings** > **Basic**
2. Tìm phần **App Domains**
3. Thêm domain của bạn (ví dụ: `localhost` cho development, hoặc domain thật cho production)
4. Lưu thay đổi

### ❌ Lỗi: "E11000 duplicate key error collection: crud_products.users index: username_1"

**Nguyên nhân:**
Collection `users` có unique index trên trường `username` từ schema cũ, nhưng User model hiện tại không có trường này. Khi tạo user mới, MongoDB cố gắng insert với `username: null` và conflict với document đã có.

**Cách khắc phục:**

Chạy script tự động để xóa index cũ:

```bash
npm run fix-index
```

Hoặc chạy thủ công:

```bash
node scripts/fix-user-index.js
```

Script này sẽ:

- ✅ Xóa index cũ trên `username`
- ✅ Xóa các document có trường `username` cũ (nếu có)
- ✅ Tạo lại index đúng cho `email` (unique)
- ✅ Tạo sparse index cho `googleId` và `facebookId`

**Nếu vẫn gặp lỗi, có thể xóa index thủ công bằng MongoDB shell:**

```javascript
// Kết nối MongoDB
use crud_products

// Xóa index
db.users.dropIndex("username_1")

// Xóa các document có username (nếu cần)
db.users.deleteMany({ username: { $exists: true } })
```

### ✅ Kiểm tra cấu hình đúng

Sau khi cấu hình, kiểm tra lại:

- ✅ App ID và App Secret đã được copy vào file `.env`
- ✅ Callback URL đã được thêm vào Facebook App
- ✅ App Domains đã được cấu hình (nếu cần)
- ✅ Server đang chạy và có thể truy cập được
- ✅ File `.env` đã được load đúng (kiểm tra bằng `console.log(process.env.FACEBOOK_APP_ID)`)
- ✅ Đã chạy `npm run fix-index` để xóa index cũ (nếu gặp lỗi duplicate key)

## 🚀 API Endpoints

### Đăng nhập Google

```
GET /api/auth/google
```

### Đăng nhập Facebook

```
GET /api/auth/facebook
```

### Lấy thông tin user hiện tại

```
GET /api/auth/me
```

Response khi đã đăng nhập:

```json
{
  "success": true,
  "user": {
    "id": "user_id",
    "name": "Tên người dùng",
    "email": "email@example.com",
    "avatar": "url_avatar",
    "provider": "google"
  }
}
```

### Đăng xuất

```
GET /api/auth/logout
```

## 💻 Sử dụng trong Frontend

### Ví dụ với React:

```javascript
// Đăng nhập Google
const loginWithGoogle = () => {
  window.location.href = "http://localhost:8080/api/auth/google";
};

// Đăng nhập Facebook
const loginWithFacebook = () => {
  window.location.href = "http://localhost:8080/api/auth/facebook";
};

// Kiểm tra user đã đăng nhập
const checkAuth = async () => {
  const response = await fetch("http://localhost:8080/api/auth/me", {
    credentials: "include", // Quan trọng: gửi cookies
  });
  const data = await response.json();
  if (data.success) {
    console.log("User:", data.user);
  }
};

// Đăng xuất
const logout = async () => {
  await fetch("http://localhost:8080/api/auth/logout", {
    credentials: "include",
  });
  window.location.reload();
};
```

## 📝 Lưu ý

1. **CORS**: Đảm bảo frontend URL trong `.env` khớp với URL frontend của bạn
2. **Session**: Session được lưu trong cookie, đảm bảo frontend gửi `credentials: 'include'` khi gọi API
3. **Production**: Trong production, đổi `SESSION_SECRET` thành giá trị ngẫu nhiên mạnh
4. **HTTPS**: Trong production, sử dụng HTTPS và cập nhật callback URLs tương ứng

## 🔄 Flow hoạt động

1. User click "Đăng nhập với Google/Facebook"
2. Redirect đến `/api/auth/google` hoặc `/api/auth/facebook`
3. Passport redirect đến Google/Facebook để xác thực
4. Sau khi xác thực thành công, Google/Facebook redirect về callback URL
5. Passport lưu user vào session và redirect về frontend
6. Frontend có thể gọi `/api/auth/me` để lấy thông tin user
