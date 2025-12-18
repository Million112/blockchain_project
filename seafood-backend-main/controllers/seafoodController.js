const { connectToNetwork } = require('../fabric/connect');

async function getAllSeafoods(req, res) {
  try {
    const { contract, gateway } = await connectToNetwork();
    const resultBytes = await contract.evaluateTransaction('getAllSeafoods');
    await gateway.disconnect();
    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function createSeafood(req, res) {
  try {
    const { seafoodId, species, origin, status } = req.body;
    const { contract, gateway } = await connectToNetwork();
    const resultBytes = await contract.submitTransaction('CreateSeafood', seafoodId, species, origin, status || 'Created');
    await gateway.disconnect();
    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

async function readSeafood(req, res) {
  try {
    const { id } = req.params;
    const { contract, gateway } = await connectToNetwork();
    const resultBytes = await contract.evaluateTransaction('ReadSeafood', id);
    await gateway.disconnect();
    res.json(JSON.parse(resultBytes.toString()));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { getAllSeafoods, createSeafood, readSeafood };
