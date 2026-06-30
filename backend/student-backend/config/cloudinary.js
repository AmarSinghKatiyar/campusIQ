// Cloudinary Configuration
const cloudinary = require('cloudinary').v2;

/**
 * Configure Cloudinary with environment variables
 */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Verify Cloudinary configuration
 */
const verifyCloudinaryConfig = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();

  if (!cloud_name || !api_key || !api_secret) {
    console.error('✗ Cloudinary configuration incomplete. Check environment variables.');
    return false;
  }

  console.log('✓ Cloudinary configured successfully');
  return true;
};

module.exports = { cloudinary, verifyCloudinaryConfig };
