// scripts/dropEmailIndex.js
const mongoose = require('mongoose');
const User = require('../models/userModel'); // chỉnh lại path nếu model ở chỗ khác

const MONGODB_URI = 'mongodb://127.0.0.1:27017/seafood_db'; // sửa nếu bạn dùng URI khác

(async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Đã kết nối MongoDB');

    // Xem thử các index hiện có (cho biết)
    const indexes = await User.collection.getIndexes();
    console.log('Indexes hiện tại:', indexes);

    // Xoá index email_1
    await User.collection.dropIndex('email_1');
    console.log('🗑 Đã xoá index email_1');

  } catch (err) {
    console.error('❌ Lỗi:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
})();
