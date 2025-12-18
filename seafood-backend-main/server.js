// // server.js
// 'use strict';
// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { connectToNetwork } = require('./fabric/connect');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // GET tất cả seafoods
// app.get('/api/seafoods', async (req, res) => {
//   try {
//     const { contract, gateway } = await connectToNetwork();
//     const resultBytes = await contract.evaluateTransaction('getAllSeafoods'); // function name trong chaincode
//     await gateway.disconnect();
//     const result = JSON.parse(resultBytes.toString());
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // POST create seafood
// app.post('/api/seafoods', async (req, res) => {
//   try {
//     const { id, name, weight, origin, status } = req.body;
//     const { contract, gateway } = await connectToNetwork();
//     const resultBytes = await contract.submitTransaction('CreateSeafood', id, name, weight, origin, status);
//     await gateway.disconnect();
//     res.json(JSON.parse(resultBytes.toString()));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET one by id
// app.get('/api/seafoods/:id', async (req, res) => {
//   try {
//     const { contract, gateway } = await connectToNetwork();
//     const resultBytes = await contract.evaluateTransaction('ReadSeafood', req.params.id);
//     await gateway.disconnect();
//     res.json(JSON.parse(resultBytes.toString()));
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));


'use strict';
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const seafoodRoutes = require('./routes/seafoodRoutes');
const catchRoutes = require('./routes/catchRoutes');
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const fishermanRoutes = require("./routes/fishermanRoutes");
const processRoutes = require('./routes/processRoutes');
const transportRoutes = require('./routes/transportRoutes');
const distRoutes = require('./routes/distributionRoutes');
const retailerRoutes = require('./routes/retailerRoutes');
const publicRoutes = require("./routes/publicRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/seafood-backend';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error', err));


app.use("/api/auth", authRoutes);
app.use('/api/seafoods', seafoodRoutes);
app.use('/api/catch', catchRoutes);
app.use("/api/users", userRoutes);
app.use("/api/fisherman", fishermanRoutes);
app.use('/api/processor', processRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/Distributor', distRoutes);
app.use('/api/retailer', retailerRoutes);
app.use("/api/public", publicRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
