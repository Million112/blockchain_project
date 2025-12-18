// // registerUser.js
// 'use strict';
// const FabricCAServices = require('fabric-ca-client');
// const { Wallets } = require('fabric-network');
// const path = require('path');
// const fs = require('fs');

// async function main() {
//   try {
//     const ccpPath = path.resolve(__dirname, '../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
//     const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

//     const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
//     const caTLSCACerts = caInfo.tlsCACerts.pem;
//     const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

//     const walletPath = path.join(__dirname, 'fabric', 'wallet');
//     const wallet = await Wallets.newFileSystemWallet(walletPath);
//     console.log(`Wallet path: ${walletPath}`);

//     // Kiểm tra appUser đã có chưa
//     const userIdentity = await wallet.get('appUser');
//     if (userIdentity) {
//       console.log('An identity for the user "appUser" already exists in the wallet');
//       return;
//     }

//     // Kiểm tra admin đã enroll chưa
//     const adminIdentity = await wallet.get('admin');
//     if (!adminIdentity) {
//       console.log('Admin identity not found in the wallet. Run enrollAdmin.js first');
//       return;
//     }

//     // Build admin user object for CA register
//     const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
//     const adminUser = await provider.getUserContext(adminIdentity, 'admin');

//     // Register and enroll the appUser
//     const secret = await ca.register({
//       affiliation: 'org1.department1',
//       enrollmentID: 'appUser',
//       role: 'client'
//     }, adminUser);

//     const enrollment = await ca.enroll({
//       enrollmentID: 'appUser',
//       enrollmentSecret: secret
//     });

//     const x509Identity = {
//       credentials: {
//         certificate: enrollment.certificate,
//         privateKey: enrollment.key.toBytes(),
//       },
//       mspId: 'Org1MSP',
//       type: 'X.509',
//     };

//     await wallet.put('appUser', x509Identity);
//     console.log('Successfully registered and enrolled user "appUser" and imported it into the wallet');
//   } catch (error) {
//     console.error(`Failed to register user "appUser": ${error}`);
//     process.exit(1);
//   }
// }

// main();
    

// 'use strict';
// const FabricCAServices = require('fabric-ca-client');
// const { Wallets, Gateway } = require('fabric-network');
// const fs = require('fs');
// const path = require('path');
// require('dotenv').config();

// async function main() {
//   try {
//     const ccpPath = path.resolve(__dirname, process.env.CCP_PATH || '../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json');
//     const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
//     const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
//     const caTLSCACerts = caInfo.tlsCACerts.pem;
//     const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

//     const walletPath = path.resolve(process.env.WALLET_PATH || path.join(__dirname, 'wallet'));
//     const wallet = await Wallets.newFileSystemWallet(walletPath);

//     // Check if user is already enrolled
//     const userId = process.env.USER_ID || 'appUser';
//     const userIdentity = await wallet.get(userId);
//     if (userIdentity) {
//       console.log(`An identity for the user "${userId}" already exists in the wallet`);
//       return;
//     }

//     // Check admin exists in wallet
//     const adminIdentity = await wallet.get('admin');
//     if (!adminIdentity) {
//       console.log('Admin identity not found in the wallet. Run enrollAdmin.js first');
//       return;
//     }

//     // build a user to register
//     const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
//     const adminUser = await provider.getUserContext(adminIdentity, 'admin');

//     // Register the user, enroll the user, and import the new identity into the wallet.
//     const secret = await ca.register({
//       affiliation: 'org1.department1',
//       enrollmentID: userId,
//       role: 'client'
//     }, adminUser);
//     const enrollment = await ca.enroll({ enrollmentID: userId, enrollmentSecret: secret });
//     const x509Identity = {
//       credentials: {
//         certificate: enrollment.certificate,
//         privateKey: enrollment.key.toBytes()
//       },
//       mspId: process.env.MSP_ID || 'Org1MSP',
//       type: 'X.509'
//     };
//     await wallet.put(userId, x509Identity);
//     console.log(`Successfully registered and enrolled user "${userId}" and imported it into the wallet`);
//   } catch (error) {
//     console.error(`Failed to register user: ${error}`);
//     process.exit(1);
//   }
// }

// main();


'use strict';
const FabricCAServices = require('fabric-ca-client');
const { Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

async function registerUser(username = 'appUser') {
  try {
    const ccpPath = path.resolve(__dirname, './fabric/connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    const walletPath = path.join(__dirname, 'fabric', 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    const userIdentity = await wallet.get(username);
    if (userIdentity) {
      console.log(`An identity for the user "${username}" already exists in the wallet`);
      return { success: true, message: `User ${username} already exists` };
    }

    const adminIdentity = await wallet.get('admin');
    if (!adminIdentity) {
      console.log('Admin identity not found in the wallet. Run enrollAdmin.js first');
      throw new Error('Admin identity not found. Run enrollAdmin.js first.');
    }

    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, 'admin');

    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: username,
      role: 'client'
    }, adminUser);

    const enrollment = await ca.enroll({
      enrollmentID: username,
      enrollmentSecret: secret
    });

    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };

    await wallet.put(username, x509Identity);
    console.log(`✅ Successfully registered and enrolled user "${username}"`);
    return { success: true, message: `User ${username} registered successfully` };
  } catch (error) {
    console.error(`❌ Failed to register user "${username}": ${error}`);
    throw error;
  }
}

// Cuối file registerUser.js
registerUser();

// 👇 Export hàm ra ngoài để controller dùng được
module.exports = { registerUser };
