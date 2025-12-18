
'use strict';
const path = require('path');
const fs = require('fs');
const { Gateway, Wallets } = require('fabric-network');

const ccpPath = path.resolve(__dirname, '../fabric/connection-org1.json');
const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

async function connectToNetwork() {
  const walletPath = path.join(__dirname, 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'appUser',         // identity mà registerUser.js đã tạo
    discovery: { enabled: true, asLocalhost: true }
  });

  const network = await gateway.getNetwork('mychannel');
  const contract = network.getContract('seafood-js'); // tên chaincode bạn deployed
  return { contract, gateway };
}

module.exports = { connectToNetwork };


// 'use strict';
// const { Wallets, Gateway } = require('fabric-network');
// const path = require('path');
// const fs = require('fs');
// require('dotenv').config();

// async function connectToNetwork() {
//   const ccpPath = path.resolve(__dirname, process.env.CCP_PATH || '../../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
//   const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

//   const walletPath = path.resolve(process.env.WALLET_PATH || path.join(__dirname, 'wallet'));
//   const wallet = await Wallets.newFileSystemWallet(walletPath);

//   const userId = process.env.USER_ID || 'appUser';
//   const gateway = new Gateway();
//   await gateway.connect(ccp, {
//     wallet,
//     identity: userId,
//     discovery: { enabled: true, asLocalhost: true }
//   });

//   const network = await gateway.getNetwork(process.env.CHANNEL_NAME || 'mychannel');
//   const contract = network.getContract(process.env.CHAINCODE_NAME || 'seafood');

//   return { contract, gateway, wallet };
// }

// module.exports = { connectToNetwork };
