// Load environment variables FIRST
// if facing DNS resolution problems
const dns = require("node:dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);  
require('dotenv').config();

const app = require('./src/app');
const connectDB = require('./config/db');
const { verifyCloudinaryConfig } = require('./config/cloudinary');

/**
 * Handle Uncaught Exceptions
 */
process.on('uncaughtException', (err) => {
  console.error('\n❌ UNCAUGHT EXCEPTION');
  console.error(err);
  process.exit(1);
});

/**
 * Validate Required Environment Variables
 */
const requiredEnv = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`❌ Missing environment variable: ${key}`);
    process.exit(1);
  }
}

// Port configuration
const PORT = process.env.PORT || 5000;

let server;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect MongoDB
    await connectDB();

    // Verify Cloudinary
    verifyCloudinaryConfig();

    // Start Express Server
    server = app.listen(PORT, () => {
      console.log('\n========================================');
      console.log('🚀 CampusIQ Backend Started Successfully');
      console.log('========================================');
      console.log(`📌 Environment : ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 API URL     : http://localhost:${PORT}`);
      console.log(
        `🖥️ Frontend    : ${
          process.env.CLIENT_URL || 'http://localhost:5173'
        }`
      );
      console.log(`🟢 Process ID  : ${process.pid}`);
      console.log(`🟢 Node.js     : ${process.version}`);
      console.log('========================================\n');
    });
  } catch (error) {
    console.error('\n❌ Failed to Start Server');
    console.error(error);
    process.exit(1);
  }
};

/**
 * Handle Unhandled Promise Rejections
 */
process.on('unhandledRejection', (err) => {
  console.error('\n❌ UNHANDLED PROMISE REJECTION');
  console.error(err);

  if (server) {
    server.close(() => {
      console.log('🛑 Server Closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

/**
 * Graceful Shutdown (Ctrl + C)
 */
process.on('SIGINT', () => {
  console.log('\n🛑 SIGINT received. Closing server...');

  if (server) {
    server.close(() => {
      console.log('✅ Server Closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

/**
 * Graceful Shutdown (Deployment)
 */
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Closing server...');

  if (server) {
    server.close(() => {
      console.log('✅ Server Closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Start the application
startServer();
