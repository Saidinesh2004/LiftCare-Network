# LiftCare Network 🚀

Comprehensive Elevator & Escalator Maintenance Management Platform.

## 🛠 Tech Stack

- **Frontend**: React (Vite), React Router, Lucide Icons, Socket.io-client, CSS3
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Socket.io, JWT Authentication, Multer
- **Real-Time**: Socket.io for live job dispatch, technician status, and notifications

## 📁 Project Structure

```text
LiftCare Network/
├── client/          # React + Vite frontend application
│   ├── src/         # Components, pages, context, and styles
│   └── package.json
├── server/          # Node.js + Express backend API
│   ├── config/      # DB connection
│   ├── controllers/ # Route handlers
│   ├── middleware/  # Auth & role verification
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express API routes
│   ├── socket/      # Socket.io real-time event handlers
│   └── server.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB instance (Local or Atlas)

### Backend Setup
1. Navigate to `server`:
   ```bash
   cd server
   npm install
   ```
2. Configure `.env` (refer to `.env.example`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/liftcare_network
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```
3. Run the backend server:
   ```bash
   npm run dev
   # or
   npm start
   ```

### Frontend Setup
1. Navigate to `client`:
   ```bash
   cd ../client
   npm install
   ```
2. Run the frontend development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

## 📜 License
ISC
