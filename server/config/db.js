const mongoose = require('mongoose');

let isConnected = false;

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
    console.log('[DB] Activating embedded In-Memory Datastore engine (0ms boot, zero network dependencies).');
    isConnected = false;
  }
};

const isMongooseConnected = () => isConnected;

const closeDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
  }
};

module.exports = { connectDB, isMongooseConnected, closeDB };
