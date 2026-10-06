require('dotenv').config();
const { connectDB, closeDB } = require('../config/db');
const seedDatabase = require('./seedData');

const run = async () => {
  try {
    await connectDB();
    await seedDatabase();
    console.log('[SeedRunner] Seeding completed.');
    process.exit(0);
  } catch (err) {
    console.error('[SeedRunner] Failed:', err);
    process.exit(1);
  }
};

run();
