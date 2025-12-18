const { connectToNetwork } = require('../fabric/connect');

async function addCatchInfo(req, res) {
  try {
    const { seafoodId, catchId, fishermanId, seaArea, quantity, catchDate, note } = req.body;
    const { contract, gateway } = await connectToNetwork();
    const resultBytes = await contract.submitTransaction('AddCatchInfo', seafoodId, catchId, fishermanId, seaArea, String(quantity), catchDate, note || '');
    await gateway.disconnect();
    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addCatchInfo };
