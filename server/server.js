require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const { Server } = require('socket.io');

const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const socketHandler = require('./socket/socketHandler');

const User = require('./models/User');
const seedDatabase = require('./seed/seedData');

// Route files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const equipmentRoutes = require('./routes/equipmentRoutes');
const technicianRoutes = require('./routes/technicianRoutes');
const maintenanceRoutes = require('./routes/maintenanceRoutes');
const serviceReportRoutes = require('./routes/serviceReportRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }
});
socketHandler.initSocket(io);

// Middleware
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cors({
  origin: '*',
  credentials: true
}));

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/technicians', technicianRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/service-reports', serviceReportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    platform: 'LiftCare Network API',
    timestamp: new Date()
  });
});

// Demo Data Reset Endpoint
app.post('/api/seed', async (req, res, next) => {
  try {
    await seedDatabase();
    res.status(200).json({ success: true, message: 'Database reset & seeded with demo data successfully' });
  } catch (err) {
    next(err);
  }
});

// Central Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  // Auto-seed if database is empty
  const userCount = await User.countDocuments();
  if (userCount === 0) {
    console.log('[LiftCare Server] Empty database detected. Auto-seeding realistic demo data...');
    try {
      await seedDatabase();
    } catch (err) {
      console.error('[LiftCare Server] Auto-seed failed:', err.message);
    }
  }

  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 LiftCare Network Backend running on port ${PORT}`);
    console.log(`📡 Socket.IO Real-time service active`);
    console.log(`🛠️ API Base URL: http://localhost:${PORT}/api`);
    console.log(`===============================================`);
  });
};

startServer();
