// const { connectToNetwork } = require('../fabric/connect');

// // ✅ Processor: Nhận hàng từ ngư dân (chuyển quyền)
// async function receiveFromFisherman(req, res) {
//   try {
//     const { seafoodId, newOwner } = req.body;
//     const { contract, gateway } = await connectToNetwork();

//     const resultBytes = await contract.submitTransaction('TransferSeafood', seafoodId, newOwner);
//     await gateway.disconnect();

//     res.json(JSON.parse(resultBytes.toString()));
//   } catch (err) {
//     console.error('❌ Error receiving seafood:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

// // ✅ Processor: Cập nhật trạng thái chế biến
// async function updateProcessingStatus(req, res) {
//   try {
//     const { seafoodId, newStatus, extraData } = req.body;
//     const { contract, gateway } = await connectToNetwork();

//     const resultBytes = await contract.submitTransaction(
//       'UpdateSeafood',
//       seafoodId,
//       newStatus,
//       extraData ? JSON.stringify(extraData) : ''
//     );

//     await gateway.disconnect();
//     res.json(JSON.parse(resultBytes.toString()));
//   } catch (err) {
//     console.error('❌ Error updating seafood status:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

// // ✅ Processor: Xem danh sách hàng sở hữu
// async function getOwnedSeafoods(req, res) {
//   try {
//     const { ownerId } = req.params; // Truyền trong URL: /api/seafood/owned/:ownerId
//     const { contract, gateway } = await connectToNetwork();

//     const resultBytes = await contract.evaluateTransaction('QueryByOwner', ownerId);
//     await gateway.disconnect();

//     res.json(JSON.parse(resultBytes.toString()));
//   } catch (err) {
//     console.error('❌ Error getting owned seafoods:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

// // ✅ Processor: Xem lịch sử chế biến
// async function getSeafoodHistory(req, res) {
//   try {
//     const { seafoodId } = req.params;
//     const { contract, gateway } = await connectToNetwork();

//     const resultBytes = await contract.evaluateTransaction('GetSeafoodHistory', seafoodId);
//     await gateway.disconnect();

//     res.json(JSON.parse(resultBytes.toString()));
//   } catch (err) {
//     console.error('❌ Error getting history:', err);
//     res.status(500).json({ error: err.message });
//   }
// }

// module.exports = {
//   receiveFromFisherman,
//   updateProcessingStatus,
//   getOwnedSeafoods,
//   getSeafoodHistory
// };



// controllers/processorController.js
const { connectToNetwork } = require('../fabric/connect');

// Lấy danh sách lô mà Processor đang sở hữu
exports.getMyLots = async (req, res) => {
  try {
    const ownerId = req.user.username;          // hoặc fabricIdentity
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

// Xem chi tiết 1 lô
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

// Thêm thông tin chế biến (AddProcessInfo)
exports.addProcessInfo = async (req, res) => {
  try {
    const { id } = req.params; // seafoodId
    const {
      processId,
      factoryName,
      processDate,
      method,
      qualityCheck,
      note,
    } = req.body;

    if (!processId || !factoryName || !processDate) {
      return res
        .status(400)
        .json({ error: 'processId, factoryName, processDate là bắt buộc' });
    }

    const identityName = req.user.fabricIdentity;
    const processorId = req.user.username;

    const timestamp = new Date().toISOString();
    const { contract, gateway } = await connectToNetwork(identityName);
    const resultBytes = await contract.submitTransaction(
      'AddProcessInfo',
      id,
      processId,
      processorId,
      factoryName,
      processDate,
      method || '',
      qualityCheck || '',
      note || '',
      timestamp
    );
    await gateway.disconnect();

    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error('addProcessInfo error:', err);
    res.status(500).json({ error: err.message });
  }
};

// Chuyển lô cho đơn vị vận chuyển (TransferSeafood)
exports.transferToTransport = async (req, res) => {
  try {
    const { id } = req.params;
    const { newOwner } = req.body; // username/identity của TRANSPORT

    if (!newOwner) {
      return res.status(400).json({ error: 'newOwner là bắt buộc' });
    }

    const timestamp = new Date().toISOString();

    const identityName = req.user.fabricIdentity;

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
    console.error('transferToTransport error:', err);
    res.status(500).json({ error: err.message });
  }
};
