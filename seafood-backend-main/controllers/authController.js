const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { registerUser } = require("../registerUser");

const SECRET = "fabric-secret";

exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    // Kiểm tra user tồn tại
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ error: "Username đã tồn tại" });

    // Tạo identity trong Fabric CA
    await registerUser(username, role);

    // Hash mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu vào MongoDB
    const user = new User({
      username,
      passwordHash: hashedPassword,
      role,
      fabricIdentity: username,
    });

    await user.save();

    res.json({ message: `✅ Đăng ký ${username} thành công với vai trò ${role}` });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    

    const user = await User.findOne({ username });
    

    if (!user) return res.status(400).json({ error: "Không tồn tại người dùng" });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ error: "Sai mật khẩu" });

    const token = jwt.sign(
      { username: user.username, role: user.role, fabricIdentity: user.fabricIdentity },
      SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, username: user.username, role: user.role });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
};
