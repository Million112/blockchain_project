// // controllers/transporterController.js
// 'use strict';

// const { connectToNetwork } = require('../fabric/connect');

// // 🚚 Bắt đầu vận chuyển
// async function startTransport(req, res) {
//   try {
//     const { seafoodId, fromLocation, toLocation, transporterName, temperature } = req.body;
//     const { contract, gateway } = await connectToNetwork();

//     const resultBytes = await contract.submitTransaction(
//       'StartTransport',
//       seafoodId,
//       fromLocation,
//       toLocation,
//       transporterName,
//       temperature || 'Unknown'
//     );

//     await gateway.disconnect();
//     res.json({
//       message: '🚚 Bắt đầu vận chuyển thành công',
//       data: JSON.parse(resultBytes.toString())
//     });
//   } catch (err) {
//     console.error('❌ Lỗi khi bắt đầu vận chuyển:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

// // ✅ Hoàn thành vận chuyển
// async function completeTransport(req, res) {
//   try {
//     const { seafoodId, arrivedAt, condition } = req.body;
//     const { contract, gateway } = await connectToNetwork();

//     const resultBytes = await contract.submitTransaction(
//       'CompleteTransport',
//       seafoodId,
//       arrivedAt || new Date().toISOString(),
//       condition || 'Good'
//     );

//     await gateway.disconnect();
//     res.json({
//       message: '✅ Hoàn thành vận chuyển thành công',
//       data: JSON.parse(resultBytes.toString())
//     });
//   } catch (err) {
//     console.error('❌ Lỗi khi hoàn thành vận chuyển:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

// module.exports = {
//   startTransport,
//   completeTransport
// };



// controllers/transportController.js
const { connectToNetwork } = require('../fabric/connect');

// Lấy danh sách lô đang thuộc đơn vị vận chuyển này
exports.getMyShipments = async (req, res) => {
  try {
    const ownerId = req.user.username;
    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.evaluateTransaction('QueryByOwner', ownerId);
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('getMyShipments error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Chi tiết lô
exports.getShipmentDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const identityName = req.user.fabricIdentity;

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.evaluateTransaction('ReadSeafood', id);
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('getShipmentDetail error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Bắt đầu vận chuyển (StartTransport)
exports.startTransport = async (req, res) => {
  try {
    const { id } = req.params; // seafoodId
    const {
      fromLocation,
      toLocation,
      temperature,
    } = req.body;

    if (!fromLocation || !toLocation) {
      return res.status(400).json({ error: 'fromLocation, toLocation là bắt buộc' });
    }

    const identityName = req.user.fabricIdentity;
    const transporterName = req.user.username;

    const timestamp = new Date().toISOString();
const startTime = new Date().toISOString();
    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.submitTransaction(
      'StartTransport',
      id,
      fromLocation,
      toLocation,
      transporterName,
      String(temperature || ''),
      startTime,
      timestamp
    );
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('startTransport error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Hoàn tất vận chuyển (CompleteTransport)
exports.completeTransport = async (req, res) => {
  try {
    const { id } = req.params;
    const { arrivedAt, condition } = req.body;

    if (!arrivedAt) {
      return res.status(400).json({ error: 'arrivedAt là bắt buộc' });
    }

    const identityName = req.user.fabricIdentity;
    const timestamp = new Date().toISOString();

    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.submitTransaction(
      'CompleteTransport',
      id,
      arrivedAt,
      condition || '',
      timestamp
    );
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('completeTransport error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Chuyển lô cho Distributor
exports.transferToDistributor = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOwner } = req.body; // username DISTRIBUTOR

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
    console.error('transferToDistributor error:', err);
    res.status(500).json({ error: err.message });
  }
};
