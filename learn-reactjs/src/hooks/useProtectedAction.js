import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

/**
 * Hook để bảo vệ các action CRUD - yêu cầu đăng nhập trước khi thực hiện
 * @param {Function} action - Function cần được bảo vệ
 * @returns {Function} - Wrapped function với authentication check
 */
export const useProtectedAction = (action) => {
  const { requireAuth } = useAuth();
  const navigate = useNavigate();

  return async (...args) => {
    // Kiểm tra authentication
    if (!requireAuth()) {
      // requireAuth đã redirect đến login, không cần làm gì thêm
      return;
    }

    // Nếu đã đăng nhập, thực hiện action
    try {
      return await action(...args);
    } catch (error) {
      console.error("Error in protected action:", error);
      throw error;
    }
  };
};

