// // controllers/retailerController.js
// 'use strict';

// const { connectToNetwork } = require('../fabric/connect');

// // 🏬 Nhận hàng từ đơn vị vận chuyển
// async function receiveSeafood(req, res) {
//   try {
//     const { seafoodId, retailerName, storeLocation, receivedCondition } = req.body;
//     const { contract, gateway } = await connectToNetwork();

//     const resultBytes = await contract.submitTransaction(
//       'ReceiveSeafood',
//       seafoodId,
//       retailerName,
//       storeLocation,
//       receivedCondition || 'Good'
//     );

//     await gateway.disconnect();
//     res.json({
//       message: '🏪 Nhận hàng thành công',
//       data: JSON.parse(resultBytes.toString())
//     });
//   } catch (err) {
//     console.error('❌ Lỗi khi nhận hàng:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

// // 🛒 Bán sản phẩm cho khách hàng
// async function sellSeafood(req, res) {
//   try {
//     const { seafoodId, customerName, soldDate } = req.body;
//     const { contract, gateway } = await connectToNetwork();

//     const resultBytes = await contract.submitTransaction(
//       'SellSeafood',
//       seafoodId,
//       customerName,
//       soldDate || new Date().toISOString()
//     );

//     await gateway.disconnect();
//     res.json({
//       message: '🛒 Bán sản phẩm thành công',
//       data: JSON.parse(resultBytes.toString())
//     });
//   } catch (err) {
//     console.error('❌ Lỗi khi bán sản phẩm:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

// module.exports = {
//   receiveSeafood,
//   sellSeafood
// };




// controllers/retailerController.js
const { connectToNetwork } = require('../fabric/connect');

// Danh sách lô trong kho của Retailer
exports.getMyInventory = async (req, res) => {
  try {
    const ownerId = req.user.username;
    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.evaluateTransaction('QueryByOwner', ownerId);
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('getMyInventory error:', err);
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

// Nhận hàng tại cửa hàng bán lẻ (ReceiveSeafood)
exports.receiveSeafood = async (req, res) => {
  try {
    const { id } = req.params;
    const { storeLocation, receivedCondition } = req.body;

    const timestamp = new Date().toISOString();
    const receivedAt = new Date().toISOString();

    if (!storeLocation) {
      return res.status(400).json({ error: 'storeLocation là bắt buộc' });
    }

    const identityName = req.user.fabricIdentity;
    const retailerName = req.user.username;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.submitTransaction(
      'ReceiveSeafood',
      id,
      retailerName,
      storeLocation,
      receivedCondition || '',
      receivedAt,
      timestamp
    );
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('receiveSeafood error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Bán cho khách hàng cuối (SellSeafood)
exports.sellSeafood = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerName, soldDate } = req.body;

    if (!customerName || !soldDate) {
      return res.status(400).json({ error: 'customerName, soldDate là bắt buộc' });
    }

    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.submitTransaction(
      'SellSeafood',
      id,
      customerName,
      soldDate
    );
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('sellSeafood error:', err);
    res.status(500).json({ error: err.message });
  }
};
