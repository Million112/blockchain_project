





// 'use strict';

// const { Contract } = require('fabric-contract-api');

// class SeafoodContract extends Contract {

//   // ===== Helper: luôn trả về object =====
//   async _getSeafood(ctx, seafoodId) {
//     const data = await ctx.stub.getState(seafoodId);
//     if (!data || data.length === 0) {
//       throw new Error(`Seafood ${seafoodId} not found`);
//     }
//     return JSON.parse(data.toString());
//   }

//   // ===================== INIT LEDGER =====================
//   async initLedger(ctx) {
//     console.log('Initializing seafood ledger');
//     const items = [
//       {
//         seafoodId: 'S001',
//         species: 'Tôm sú',
//         origin: 'Cà Mau',
//         status: 'Đang đánh bắt',
//         history: [],
//         ownerId: null,
//         timestamp: new Date().toISOString()
//       },
//       {
//         seafoodId: 'S002',
//         species: 'Cá ngừ',
//         origin: 'Phú Yên',
//         status: 'Đang vận chuyển',
//         history: [],
//         ownerId: null,
//         timestamp: new Date().toISOString()
//       }
//     ];
//     for (const i of items) {
//       await ctx.stub.putState(i.seafoodId, Buffer.from(JSON.stringify(i)));
//       console.log(`✔️ Seeded seafood: ${i.seafoodId}`);
//     }
//   }

//   // ===================== CREATE =====================
//   async CreateSeafood(ctx, seafoodId, species, origin, status) {
//     const exists = await ctx.stub.getState(seafoodId);
//     if (exists && exists.length > 0) {
//       throw new Error(`Seafood ${seafoodId} already exists`);
//     }

//     const seafood = {
//       seafoodId,
//       species,
//       origin,
//       status: status || 'Khởi tạo',
//       history: [],
//       ownerId: null,
//       timestamp: new Date().toISOString()
//     };

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }

//   // ===================== READ =====================
//   async ReadSeafood(ctx, seafoodId) {
//     const seafood = await this._getSeafood(ctx, seafoodId);
//     // Trả về JSON string cho Node backend parse
//     return JSON.stringify(seafood);
//   }

//   // ===================== LIST ALL =====================
//   async getAllSeafoods(ctx) {
//     const iterator = await ctx.stub.getStateByRange('', '');
//     const all = [];
//     while (true) {
//       const res = await iterator.next();
//       if (res.value && res.value.value.toString()) {
//         all.push(JSON.parse(res.value.value.toString('utf8')));
//       }
//       if (res.done) break;
//     }
//     await iterator.close();
//     return JSON.stringify(all);
//   }

//   // ===================== ADD CATCH INFO =====================
//   async AddCatchInfo(ctx, seafoodId, catchId, fishermanId, seaArea, quantity, catchDate, note) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     const catchInfo = {
//       catchId,
//       fishermanId,
//       seaArea,
//       quantity: Number(quantity),
//       catchDate,
//       note,
//       timestamp: new Date().toISOString()
//     };

//     seafood.history.push({ type: 'Catch', data: catchInfo });
//     seafood.status = 'Đã đánh bắt';
//     seafood.timestamp = new Date().toISOString();

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }

//   // ===================== ADD PROCESS INFO =====================
//   async AddProcessInfo(ctx, seafoodId, processId, processorId, factoryName, processDate, method, qualityCheck, note) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     const processInfo = {
//       processId,
//       processorId,
//       factoryName,
//       processDate,
//       method,
//       qualityCheck,
//       note,
//       timestamp: new Date().toISOString()
//     };

//     seafood.history.push({ type: 'Process', data: processInfo });
//     seafood.status = 'Đã chế biến';
//     seafood.timestamp = new Date().toISOString();

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }

//   // ===================== ADD TRANSPORT INFO =====================
//   async AddTransportInfo(
//     ctx,
//     seafoodId,
//     transportId,
//     transporterId,
//     vehicleNumber,
//     fromLocation,
//     toLocation,
//     startDate,
//     endDate,
//     temperature,
//     note
//   ) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     const transportInfo = {
//       transportId,
//       transporterId,
//       vehicleNumber,
//       fromLocation,
//       toLocation,
//       startDate,
//       endDate,
//       temperature: Number(temperature),
//       note,
//       timestamp: new Date().toISOString()
//     };

//     seafood.history.push({ type: 'Transport', data: transportInfo });
//     seafood.status = 'Đang vận chuyển';
//     seafood.timestamp = new Date().toISOString();

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }

//   // ===================== ADD DISTRIBUTION INFO =====================
//   async AddDistributionInfo(
//     ctx,
//     seafoodId,
//     distributionId,
//     retailerId,
//     location,
//     receivedDate,
//     soldDate,
//     note
//   ) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     const distributionInfo = {
//       distributionId,
//       retailerId,
//       location,
//       receivedDate,
//       soldDate,
//       note,
//       timestamp: new Date().toISOString()
//     };

//     seafood.history.push({ type: 'Distribution', data: distributionInfo });
//     seafood.status = 'Đã phân phối';
//     seafood.timestamp = new Date().toISOString();

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }

//   // ===================== RAW HISTORY =====================
//   async GetSeafoodHistory(ctx, seafoodId) {
//     const iterator = await ctx.stub.getHistoryForKey(seafoodId);
//     const all = [];

//     while (true) {
//       const res = await iterator.next();
//       if (res.value && res.value.value.toString()) {
//         all.push({
//           txId: res.value.txId,
//           timestamp: res.value.timestamp,
//           value: JSON.parse(res.value.value.toString('utf8'))
//         });
//       }
//       if (res.done) break;
//     }

//     await iterator.close();
//     return JSON.stringify(all);
//   }

//   // ===================== UPDATE SEAFOOD =====================
//   async UpdateSeafood(ctx, seafoodId, newStatus, extraDataJSON) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     if (newStatus) {
//       seafood.status = newStatus;
//     }
//     seafood.timestamp = new Date().toISOString();

//     if (extraDataJSON) {
//       try {
//         const extra = JSON.parse(extraDataJSON);
//         seafood.history.push({
//           type: 'Update',
//           data: extra,
//           timestamp: new Date().toISOString()
//         });

//         // Nếu extra có ownerId thì set luôn
//         if (extra.ownerId) {
//           seafood.ownerId = extra.ownerId;
//         }
//       } catch (e) {
//         throw new Error('Invalid JSON in extraDataJSON');
//       }
//     }

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     console.log(`🔄 Updated seafood ${seafoodId} → status: ${seafood.status}`);
//     return JSON.stringify(seafood);
//   }

//   // ===================== TRANSFER SEAFOOD =====================
//   async TransferSeafood(ctx, seafoodId, newOwner) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     const oldOwner = seafood.ownerId || 'unknown';

//     seafood.ownerId = newOwner;
//     seafood.status = 'Transferred';
//     seafood.timestamp = new Date().toISOString();
//     seafood.history.push({
//       type: 'Transfer',
//       data: { from: oldOwner, to: newOwner },
//       timestamp: new Date().toISOString()
//     });

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     console.log(`📦 Transferred seafood ${seafoodId} from ${oldOwner} to ${newOwner}`);
//     return JSON.stringify(seafood);
//   }

//   // ===================== QUERY BY OWNER =====================
//   async QueryByOwner(ctx, ownerId) {
//     const iterator = await ctx.stub.getStateByRange('', '');
//     const result = [];

//     while (true) {
//       const res = await iterator.next();
//       if (res.value && res.value.value.toString()) {
//         const record = JSON.parse(res.value.value.toString('utf8'));
//         if (record.ownerId === ownerId) {
//           result.push(record);
//         }
//       }
//       if (res.done) break;
//     }

//     await iterator.close();
//     console.log(`📄 Found ${result.length} seafood records owned by ${ownerId}`);
//     return JSON.stringify(result);
//   }

//   // ===================== HIGH-LEVEL TRANSPORT FLOW =====================
//   async StartTransport(ctx, seafoodId, fromLocation, toLocation, transporterName, temperature) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     seafood.status = 'Đang vận chuyển';
//     seafood.transportInfo = {
//       fromLocation,
//       toLocation,
//       transporterName,
//       temperature: Number(temperature),
//       startTime: new Date().toISOString()
//     };

//     seafood.history.push({
//       type: 'StartTransport',
//       data: seafood.transportInfo,
//       timestamp: new Date().toISOString()
//     });

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }

//   async CompleteTransport(ctx, seafoodId, arrivedAt, condition) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     seafood.status = 'Đã vận chuyển xong';
//     seafood.transportInfo = {
//       ...(seafood.transportInfo || {}),
//       arrivedAt,
//       condition
//     };

//     seafood.history.push({
//       type: 'CompleteTransport',
//       data: seafood.transportInfo,
//       timestamp: new Date().toISOString()
//     });

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }

//   async ReceiveSeafood(ctx, seafoodId, retailerName, storeLocation, receivedCondition) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     seafood.status = 'Đã đến nhà bán lẻ';
//     seafood.retailInfo = {
//       retailerName,
//       storeLocation,
//       receivedCondition,
//       receivedAt: new Date().toISOString()
//     };

//     seafood.history.push({
//       type: 'Receive',
//       data: seafood.retailInfo,
//       timestamp: new Date().toISOString()
//     });

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }

//   async SellSeafood(ctx, seafoodId, customerName, soldDate) {
//     const seafood = await this._getSeafood(ctx, seafoodId);

//     seafood.status = 'Đã bán';
//     seafood.soldInfo = {
//       customerName,
//       soldDate
//     };

//     seafood.history.push({
//       type: 'Sell',
//       data: seafood.soldInfo,
//       timestamp: new Date().toISOString()
//     });

//     await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
//     return JSON.stringify(seafood);
//   }
// }

// module.exports.contracts = [SeafoodContract];




'use strict';

const { Contract } = require('fabric-contract-api');

class SeafoodContract extends Contract {

  // Helper: đọc asset
  async _getSeafood(ctx, seafoodId) {
    const data = await ctx.stub.getState(seafoodId);
    if (!data || data.length === 0) {
      throw new Error(`Seafood ${seafoodId} not found`);
    }
    return JSON.parse(data.toString());
  }

  // =====================================================
  // INIT LEDGER (only for testing / demo)
  // =====================================================
  async initLedger(ctx) {
    const timestamp = new Date().toISOString(); // Tạo timestamp tự động
    console.log('Init ledger sample data...');
    const items = [
      {
        seafoodId: 'S001',
        species: 'Tôm sú',
        origin: 'Cà Mau',
        status: 'Đang đánh bắt',
        history: [],
        ownerId: null,
        timestamp,
      },
      {
        seafoodId: 'S002',
        species: 'Cá ngừ',
        origin: 'Phú Yên',
        status: 'Đang vận chuyển',
        history: [],
        ownerId: null,
        timestamp,
      }
    ];

    for (const i of items) {
      await ctx.stub.putState(i.seafoodId, Buffer.from(JSON.stringify(i)));
      console.log(`Seeded seafood ${i.seafoodId}`);
    }
  }

  // =====================================================
  // CREATE
  // =====================================================
  async CreateSeafood(ctx, seafoodId, species, origin, status, timestamp) {
    const exists = await ctx.stub.getState(seafoodId);
    if (exists && exists.length > 0) {
      throw new Error(`Seafood ${seafoodId} already exists`);
    }

    const seafood = {
      seafoodId,
      species,
      origin,
      status: status || 'Khởi tạo',
      history: [],
      ownerId: null,
      timestamp,
    };

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }

  // =====================================================
  // READ
  // =====================================================
  async ReadSeafood(ctx, seafoodId) {
    const seafood = await this._getSeafood(ctx, seafoodId);
    return JSON.stringify(seafood);
  }
  async GetSeafoodHistory(ctx, seafoodId) {
  const iterator = await ctx.stub.getHistoryForKey(seafoodId);
  const all = [];
  while (true) {
    const res = await iterator.next();
    if (res.value && res.value.value.toString()) {
      all.push({
        txId: res.value.txId,
        timestamp: res.value.timestamp,
        value: JSON.parse(res.value.value.toString('utf8'))
      });
    }
    if (res.done) break;
  }
  await iterator.close();
  return JSON.stringify(all);
}
  //   // ===================== QUERY BY OWNER =====================
  async QueryByOwner(ctx, ownerId) {
    const iterator = await ctx.stub.getStateByRange('', '');
    const result = [];

    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        const record = JSON.parse(res.value.value.toString('utf8'));
        if (record.ownerId === ownerId) {
          result.push(record);
        }
      }
      if (res.done) break;
    }

    await iterator.close();
    console.log(`📄 Found ${result.length} seafood records owned by ${ownerId}`);
    return JSON.stringify(result);
  }

  // =====================================================
  // LIST ALL
  // =====================================================
  async getAllSeafoods(ctx) {
    const iterator = await ctx.stub.getStateByRange('', '');
    const all = [];
    while (true) {
      const res = await iterator.next();
      if (res.value && res.value.value.toString()) {
        all.push(JSON.parse(res.value.value.toString('utf8')));
      }
      if (res.done) break;
    }
    await iterator.close();
    return JSON.stringify(all);
  }

  // =====================================================
  // CATCH INFO
  // =====================================================
  async AddCatchInfo(ctx, seafoodId, catchId, fishermanId, seaArea, quantity, catchDate, note, timestamp) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    const catchInfo = {
      catchId,
      fishermanId,
      seaArea,
      quantity: Number(quantity),
      catchDate,
      note
    };

    seafood.history.push({ type: 'Catch', data: catchInfo, timestamp });
    seafood.status = 'Đã đánh bắt';
    seafood.timestamp = timestamp;

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }

  // =====================================================
  // PROCESS
  // =====================================================
  async AddProcessInfo(
    ctx, seafoodId, processId, processorId,
    factoryName, processDate, method, qualityCheck, note, timestamp
  ) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    const processInfo = {
      processId,
      processorId,
      factoryName,
      processDate,
      method,
      qualityCheck,
      note
    };

    seafood.history.push({ type: 'Process', data: processInfo, timestamp });
    seafood.status = 'Đã chế biến';
    seafood.timestamp = timestamp;

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }

  // =====================================================
  // TRANSPORT
  // =====================================================
  async AddTransportInfo(
    ctx, seafoodId, transportId, transporterId,
    vehicleNumber, fromLocation, toLocation,
    startDate, endDate, temperature, note, timestamp
  ) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    const transportInfo = {
      transportId,
      transporterId,
      vehicleNumber,
      fromLocation,
      toLocation,
      startDate,
      endDate,
      temperature: Number(temperature),
      note
    };

    seafood.history.push({ type: 'Transport', data: transportInfo, timestamp });
    seafood.status = 'Đang vận chuyển';
    seafood.timestamp = timestamp;

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }


  async StartTransport(ctx, seafoodId, fromLocation, toLocation, transporterName, temperature, startTime, timestamp) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    seafood.status = 'Đang vận chuyển';
    seafood.transportInfo = {
      fromLocation,
      toLocation,
      transporterName,
      temperature: Number(temperature),
      startTime
    };

    seafood.history.push({
      type: 'StartTransport',
      data: seafood.transportInfo,
      timestamp
    });

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }



  async CompleteTransport(ctx, seafoodId, arrivedAt, condition, timestamp) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    seafood.status = 'Đã vận chuyển xong';
    seafood.transportInfo = {
      ...(seafood.transportInfo || {}),
      arrivedAt,
      condition
    };

    seafood.history.push({
      type: 'CompleteTransport',
      data: seafood.transportInfo,
      timestamp
    });

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }

  // =====================================================
  // DISTRIBUTION
  // =====================================================
  async AddDistributionInfo(
    ctx, seafoodId, distributionId, retailerId,
    location, receivedDate, soldDate, note, timestamp
  ) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    const distributionInfo = {
      distributionId,
      retailerId,
      location,
      receivedDate,
      soldDate,
      note
    };

    seafood.history.push({ type: 'Distribution', data: distributionInfo, timestamp });
    seafood.status = 'Đã phân phối';
    seafood.timestamp = timestamp;

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }

  // =====================================================
  // UPDATE
  // =====================================================
  async UpdateSeafood(ctx, seafoodId, newStatus, extraDataJSON, timestamp) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    if (newStatus) seafood.status = newStatus;
    seafood.timestamp = timestamp;

    if (extraDataJSON) {
      const extra = JSON.parse(extraDataJSON);
      seafood.history.push({ type: 'Update', data: extra, timestamp });
      if (extra.ownerId) seafood.ownerId = extra.ownerId;
    }

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }

  // =====================================================
  // TRANSFER
  // =====================================================
  async TransferSeafood(ctx, seafoodId, newOwner, timestamp) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    const oldOwner = seafood.ownerId || 'unknown';

    seafood.ownerId = newOwner;
    seafood.status = 'Transferred';
    seafood.timestamp = timestamp;

    seafood.history.push({ type: 'Transfer', data: { from: oldOwner, to: newOwner }, timestamp });

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }

  async ReceiveSeafood(ctx, seafoodId, retailerName, storeLocation, receivedCondition,receivedAt,timestamp) {
    const seafood = await this._getSeafood(ctx, seafoodId);

    seafood.status = 'Đã đến nhà bán lẻ';
    seafood.retailInfo = {
      retailerName,
      storeLocation,
      receivedCondition,
      receivedAt
    };

    seafood.history.push({
      type: 'Receive',
      data: seafood.retailInfo,
      timestamp
    });

    await ctx.stub.putState(seafoodId, Buffer.from(JSON.stringify(seafood)));
    return JSON.stringify(seafood);
  }
}




module.exports.contracts = [SeafoodContract];
