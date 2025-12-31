const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

// Import routers
const apiRouter = require("./routers/apiUser");
const authRouter = require("./routers/auth");

// Import và khởi tạo Passport
const passport = require("./config/passport");

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/crud_products";

mongoose
  .connect(DB_URL)
  .then(() => {
    console.log("DB connected to " + DB_URL);
  })
  .catch((err) => {
    console.log(err);
  });

// Cấu hình CORS với credentials để hỗ trợ session
// Hỗ trợ nhiều origins (local và production)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
  : [process.env.FRONTEND_URL || "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Cho phép requests không có origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Kiểm tra origin có trong danh sách allowed không
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Trong development, cho phép tất cả
        if (process.env.NODE_ENV === "development") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Cấu hình session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-this",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // Chỉ dùng HTTPS trong production
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 giờ
    },
  })
);

// Khởi tạo Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", apiRouter);
app.use("/api/auth", authRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
