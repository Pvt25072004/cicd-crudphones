import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import InputField from "./inputField";
import { useAuth } from "./contexts/AuthContext";
import { API_URL, FRONTEND_URL } from "./config/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, loading, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Lấy redirect URL từ query params hoặc dùng mặc định
  const getRedirectUrl = () => {
    const redirect = searchParams.get("redirect");
    if (redirect) {
      // Nếu redirect là đường dẫn tương đối, thêm frontend URL
      if (redirect.startsWith("/")) {
        return `${FRONTEND_URL}${redirect}`;
      }
      return redirect;
    }
    // Mặc định redirect về trang chủ
    return `${FRONTEND_URL}/`;
  };

  // Nếu đã đăng nhập, redirect đến URL đã chỉ định
  useEffect(() => {
    if (user && !loading) {
      const redirect = searchParams.get("redirect");
      if (redirect) {
        navigate(redirect);
      } else {
        navigate("/");
      }
    }
  }, [user, loading, navigate, searchParams]);

  // Đăng nhập với Google
  const handleGoogleLogin = () => {
    const redirectUrl = getRedirectUrl();
    window.location.href = `${API_URL}/api/auth/google?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  // Đăng nhập với Facebook
  const handleFacebookLogin = () => {
    const redirectUrl = getRedirectUrl();
    window.location.href = `${API_URL}/api/auth/facebook?redirect=${encodeURIComponent(redirectUrl)}`;
  };

  // Presentational - Button
  const Button = ({ text, onClick, style }) => (
    <button onClick={onClick} style={style}>
      {text}
    </button>
  );

  // Container - Form
  const handleSubmit = () => {
    // validate + call API
    console.log("Email:", email, "Password:", password);
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Nếu đã đăng nhập, hiển thị thông báo đang redirect
  if (user) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Đang chuyển hướng...</h2>
        <p>Bạn đã đăng nhập thành công!</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "0 auto" }}>
      <h2>Đăng nhập / Tạo tài khoản</h2>

      {/* Social Login Buttons */}
      <div style={{ marginBottom: "30px" }}>
        <h3>Đăng nhập nhanh với:</h3>
        <Button
          text="🔵 Đăng nhập với Google"
          onClick={handleGoogleLogin}
          style={{
            width: "100%",
            padding: "12px",
            marginBottom: "10px",
            backgroundColor: "#4285f4",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        />
        <Button
          text="📘 Đăng nhập với Facebook"
          onClick={handleFacebookLogin}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        />
      </div>

      <hr style={{ margin: "30px 0" }} />

      {/* Traditional Login Form */}
      <h3>Hoặc đăng nhập bằng email:</h3>
      <InputField
        label="Your Email Address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Create a password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button
        text="Create"
        onClick={handleSubmit}
        style={{
          width: "100%",
          padding: "12px",
          marginTop: "10px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      />
    </div>
  );
}

export default Login;
