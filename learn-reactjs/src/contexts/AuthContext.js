import React, { createContext, useState, useEffect, useContext } from "react";
import { getApiEndpoint } from "../config/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kiểm tra authentication
  const checkAuth = async () => {
    try {
      const response = await fetch(getApiEndpoint("/api/auth/me"), {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error checking auth:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất
  const logout = async () => {
    try {
      await fetch(getApiEndpoint("/api/auth/logout"), {
        credentials: "include",
      });
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Kiểm tra xem user đã đăng nhập chưa
  const isAuthenticated = () => {
    return user !== null;
  };

  // Redirect đến trang login nếu chưa đăng nhập
  const requireAuth = (redirectPath = null) => {
    if (!isAuthenticated()) {
      const currentPath = redirectPath || window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
      return false;
    }
    return true;
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    requireAuth,
    checkAuth,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

