const app = require('./src/app');
const connectDB = require('./config/db');
const { verifyCloudinaryConfig } = require('./config/cloudinary');
const dns = require("node:dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);
require('dotenv').config();

// Port configuration
const PORT = process.env.PORT || 5000;

/**
 * Start Server
 */
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    // Verify Cloudinary configuration
    verifyCloudinaryConfig();

    // Start listening on port
    app.listen(PORT, () => {
      console.log(`\n✓ CampusIQ Backend Server running on PORT ${PORT}`);
      console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`✓ API URL: http://localhost:${PORT}`);
      console.log(`✓ Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}\n`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('✗ Unhandled Rejection:', err.message);
  process.exit(1);
});

// Start the server
startServer();