// Script để xóa index cũ trên username và đảm bảo schema đúng
const mongoose = require("mongoose");
require("dotenv").config();

const DB_URL = process.env.DB_URL || "mongodb://127.0.0.1/crud_products";

async function fixUserIndex() {
  try {
    // Kết nối database
    await mongoose.connect(DB_URL);
    console.log("✅ Đã kết nối database");

    const db = mongoose.connection.db;
    const usersCollection = db.collection("users");

    // Kiểm tra các index hiện tại
    const indexes = await usersCollection.indexes();
    console.log("\n📋 Các index hiện tại:");
    indexes.forEach((index) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Xóa index trên username nếu có
    try {
      await usersCollection.dropIndex("username_1");
      console.log("\n✅ Đã xóa index 'username_1'");
    } catch (error) {
      if (error.code === 27) {
        console.log("\nℹ️  Index 'username_1' không tồn tại, bỏ qua");
      } else {
        throw error;
      }
    }

    // Xóa các document có username: null (nếu có và không cần thiết)
    // Hoặc có thể update chúng nếu cần
    const result = await usersCollection.deleteMany({ username: { $exists: true } });
    if (result.deletedCount > 0) {
      console.log(`\n✅ Đã xóa ${result.deletedCount} document có trường username cũ`);
    }

    // Tạo lại index đúng cho email (nếu chưa có)
    try {
      await usersCollection.createIndex({ email: 1 }, { unique: true });
      console.log("\n✅ Đã tạo index unique cho email");
    } catch (error) {
      if (error.code === 85) {
        console.log("\nℹ️  Index cho email đã tồn tại");
      } else {
        throw error;
      }
    }

    // Tạo sparse index cho googleId và facebookId
    try {
      await usersCollection.createIndex({ googleId: 1 }, { sparse: true });
      await usersCollection.createIndex({ facebookId: 1 }, { sparse: true });
      console.log("\n✅ Đã tạo sparse index cho googleId và facebookId");
    } catch (error) {
      console.log("\nℹ️  Index cho googleId/facebookId đã tồn tại hoặc có lỗi:", error.message);
    }

    console.log("\n✅ Hoàn tất! Bạn có thể thử đăng nhập lại.");
  } catch (error) {
    console.error("\n❌ Lỗi:", error);
  } finally {
    await mongoose.connection.close();
    console.log("\n🔌 Đã đóng kết nối database");
  }
}

// Chạy script
fixUserIndex();

