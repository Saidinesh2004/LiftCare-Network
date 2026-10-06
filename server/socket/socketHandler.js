let ioInstance = null;

const initSocket = (io) => {
  ioInstance = io;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Join room based on user id or role
    socket.on('join', ({ userId, role }) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket] User ${userId} joined room user_${userId}`);
      }
      if (role) {
        socket.join(`role_${role}`);
        console.log(`[Socket] Socket ${socket.id} joined role_${role}`);
      }
    });

    // Join specific request room for tracking live job status
    socket.on('join_request', (requestId) => {
      if (requestId) {
        socket.join(`request_${requestId}`);
        console.log(`[Socket] Socket ${socket.id} joined request_${requestId}`);
      }
    });

    socket.on('leave_request', (requestId) => {
      if (requestId) {
        socket.leave(`request_${requestId}`);
      }
    });

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};

const getIO = () => {
  return ioInstance;
};

// Helper emit functions
const emitToUser = (userId, event, data) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId}`).emit(event, data);
  }
};

const emitToRole = (role, event, data) => {
  if (ioInstance && role) {
    ioInstance.to(`role_${role}`).emit(event, data);
  }
};

const emitToRequest = (requestId, event, data) => {
  if (ioInstance && requestId) {
    ioInstance.to(`request_${requestId}`).emit(event, data);
  }
};

const emitBroadcast = (event, data) => {
  if (ioInstance) {
    ioInstance.emit(event, data);
  }
};

module.exports = {
  initSocket,
  getIO,
  emitToUser,
  emitToRole,
  emitToRequest,
  emitBroadcast
};
