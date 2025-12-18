



// controllers/fishermanController.js
const { connectToNetwork } = require('../fabric/connect');

// Tạo lô đánh bắt mới
exports.createCatch = async (req, res) => {
  try {
    const { seafoodId, species, origin } = req.body;
    const identityName = req.user.fabricIdentity;
    const owner = req.user.username;

    const { contract, gateway } = await connectToNetwork(identityName);

    const timestamp = new Date().toISOString();

    // Create seafood
    const resultBytes = await contract.submitTransaction(
      'CreateSeafood',
      seafoodId,
      species,
      origin,
      'Đang đánh bắt',
      timestamp
    );

    let seafood = JSON.parse(resultBytes.toString());

    // Add owner using UpdateSeafood
    const extraData = { ownerId: owner, createdBy: owner };

    const updatedBytes = await contract.submitTransaction(
      'UpdateSeafood',
      seafoodId,
      'Đang đánh bắt',
      JSON.stringify(extraData),
      timestamp
    );

    seafood = JSON.parse(updatedBytes.toString());

    await gateway.disconnect();
    res.json(seafood);
  } catch (err) {
    console.error('createCatch error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Cập nhật thông tin lô (ví dụ cập nhật thêm info đánh bắt)
exports.updateCatchInfo = async (req, res) => {
  try {
    const { id } = req.params; // seafoodId
    const { seaArea, quantity, catchDate, note } = req.body;
    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);

    const resultBytes = await contract.submitTransaction(
      'AddCatchInfo',
      id,
      `CATCH-${Date.now()}`,  // catchId
      req.user.username,      // fishermanId
      seaArea,
      String(quantity),
      catchDate,
      note || ''
    );

    await gateway.disconnect();
    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('updateCatchInfo error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Chuyển lô cho Processor
exports.transferCatch = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOwner } = req.body; // tên Processor (username hoặc orgId)
    const identityName = req.user.fabricIdentity;
const timestamp = new Date().toISOString();
    const { contract, gateway } = await connectToNetwork(identityName);

    const resultBytes = await contract.submitTransaction(
      'TransferSeafood',
      id,
      newOwner,
      timestamp
    );

    await gateway.disconnect();
    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('transferCatch error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Lấy danh sách lô của chính ngư dân này
exports.getMyCatches = async (req, res) => {
  try {
    const ownerId = req.user.username;            // hoặc fabricIdentity
    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.evaluateTransaction(
      'QueryByOwner',
      ownerId
    );
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('getMyCatches error:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.getCatchDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.evaluateTransaction('ReadSeafood', id);
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('getCatchDetail error:', err);
    res.status(500).json({ error: err.message });
  }
};
