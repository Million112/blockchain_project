// controllers/distributorController.js
const { connectToNetwork } = require('../fabric/connect');

// Danh sách lô của distributor
exports.getMyLots = async (req, res) => {
  try {
    const ownerId = req.user.username;
    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.evaluateTransaction('QueryByOwner', ownerId);
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('getMyLots error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Chi tiết
exports.getLotDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.evaluateTransaction('ReadSeafood', id);
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('getLotDetail error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Nhận lô và ghi thông tin phân phối (AddDistributionInfo)
exports.addDistributionInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      distributionId,
      location,
      receivedDate,
      soldDate,
      note,
    } = req.body;

    if (!distributionId || !location || !receivedDate) {
      return res.status(400).json({
        error: 'distributionId, location, receivedDate là bắt buộc',
      });
    }
    const timestamp = new Date().toISOString();

    const identityName = req.user.fabricIdentity;
    const retailerId = req.user.username; // Distributor hiện tại là "retailerId" trong AddDistributionInfo

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.submitTransaction(
      'AddDistributionInfo',
      id,
      distributionId,
      retailerId,
      location,
      receivedDate,
      soldDate || '',
      note || '',
      timestamp
    );
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('addDistributionInfo error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Chuyển lô cho Retailer
exports.transferToRetailer = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOwner } = req.body; // username RETAILER

    if (!newOwner) {
      return res.status(400).json({ error: 'newOwner là bắt buộc' });
    }

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
    console.error('transferToRetailer error:', err);
    res.status(500).json({ error: err.message });
  }
};
