const express = require("express");
const router = express.Router();
const passport = require("passport");

// Google Authentication Routes
router.get(
  "/google",
  (req, res, next) => {
    // Lưu redirect URL vào session nếu có
    if (req.query.redirect) {
      req.session.redirectTo = req.query.redirect;
    }
    next();
  },
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login", // Redirect nếu đăng nhập thất bại
    session: true,
  }),
  (req, res) => {
    // Lấy redirect URL từ session hoặc dùng mặc định
    const redirectUrl =
      req.session.redirectTo ||
      process.env.FRONTEND_URL ||
      "http://localhost:3000";
    // Xóa redirect URL khỏi session
    delete req.session.redirectTo;
    // Đăng nhập thành công, redirect đến URL đã chỉ định
    res.redirect(redirectUrl);
  }
);

// Facebook Authentication Routes
router.get(
  "/facebook",
  (req, res, next) => {
    // Lưu redirect URL vào session nếu có
    if (req.query.redirect) {
      req.session.redirectTo = req.query.redirect;
    }
    next();
  },
  passport.authenticate("facebook", {
    scope: ["public_profile"], // Chỉ yêu cầu public_profile, email sẽ được lấy tự động nếu có
  })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login", // Redirect nếu đăng nhập thất bại
    session: true,
  }),
  (req, res) => {
    // Lấy redirect URL từ session hoặc dùng mặc định
    const redirectUrl =
      req.session.redirectTo ||
      process.env.FRONTEND_URL ||
      "http://localhost:3000";
    // Xóa redirect URL khỏi session
    delete req.session.redirectTo;
    // Đăng nhập thành công, redirect đến URL đã chỉ định
    res.redirect(redirectUrl);
  }
);

// Lấy thông tin user hiện tại
router.get("/me", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        avatar: req.user.avatar,
        provider: req.user.provider,
      },
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Chưa đăng nhập",
    });
  }
});

// Đăng xuất
router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Lỗi khi đăng xuất",
      });
    }
    res.json({
      success: true,
      message: "Đăng xuất thành công",
    });
  });
});

module.exports = router;
