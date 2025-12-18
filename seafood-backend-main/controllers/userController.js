const User = require("../models/userModel");
const bcrypt = require("bcrypt");

// ✅ Lấy danh sách tất cả user
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy danh sách user" });
  }
};

// ✅ Lấy 1 user theo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy user" });
  }
};

// ✅ Thêm user mới
exports.createUser = async (req, res) => {
  try {
    const { username, password, role, organization } = req.body;

    const existing = await User.findOne({ username });
    if (existing)
      return res.status(400).json({ message: "Tên đăng nhập đã tồn tại" });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({ username, passwordHash, role, organization });
    await newUser.save();

    res.status(201).json({ message: "Tạo user thành công", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi thêm user" });
  }
};

// ✅ Cập nhật user
exports.updateUser = async (req, res) => {
  try {
    const { username, password, role, organization } = req.body;
    const updateData = { username, role, organization };

    if (password) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ message: "Cập nhật user thành công", user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi cập nhật user" });
  }
};

// ✅ Xóa user
exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser)
      return res.status(404).json({ message: "Không tìm thấy user" });
    res.json({ message: "Xóa user thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xóa user" });
  }
};
