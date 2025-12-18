// controllers/publicController.js
const { connectToNetwork } = require("../fabric/connect");

// Lấy thông tin đầy đủ 1 lô (cho truy vết)
exports.traceSeafood = async (req, res) => {
  try {
    const { id } = req.params; // seafoodId

    // identity “public” có thể là 1 user đọc-only, ví dụ: "appUser" hoặc "admin"
    const identityName = "appUser";

    const { contract, gateway } = await connectToNetwork(identityName);

    // 1) Lấy data hiện tại
    const infoBytes = await contract.evaluateTransaction("ReadSeafood", id);
    const info = JSON.parse(infoBytes.toString());

    // 2) Lấy history on-chain (tuỳ chọn)
    let rawHistory = [];
    try {
      const historyBytes = await contract.evaluateTransaction(
        "GetSeafoodHistory",
        id
      );
      rawHistory = JSON.parse(historyBytes.toString());
    } catch (e) {
      console.warn("GetSeafoodHistory error (optional):", e.message);
    }

    await gateway.disconnect();

    res.json({
      seafood: info,
      fabricHistory: rawHistory, // history gốc của Fabric (nếu muốn hiển thị thêm)
    });
  } catch (err) {
    console.error("traceSeafood error:", err);
    res.status(500).json({ error: err.message });
  }
};
