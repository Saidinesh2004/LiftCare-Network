const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let isConnected = false;
let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/liftcare_network';
  try {
    console.log(`[DB] Attempting connection to MongoDB at: ${uri}`);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isConnected = true;
    console.log(`[DB] MongoDB Connected Successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`[DB] Local/External MongoDB not accessible (${err.message}).`);
    console.log('[DB] Activating embedded In-Memory Datastore engine...');
    try {
      mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      isConnected = true;
      console.log(`[DB] Embedded In-Memory MongoDB Connected Successfully at: ${memoryUri}`);
    } catch (memErr) {
      console.error('[DB] Failed to start In-Memory MongoDB:', memErr.message);
      isConnected = false;
    }
  }
};

const isMongooseConnected = () => isConnected;

const closeDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
  }
  if (mongod) {
    await mongod.stop();
  }
};

module.exports = { connectDB, isMongooseConnected, closeDB };

