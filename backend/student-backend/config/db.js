const mongoose = require("mongoose");

/**
 * Connect to MongoDB Atlas
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const connection = await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✓ MongoDB connected successfully:", connection.connection.host);
    console.log("Database:", connection.connection.name);
    console.log(
      "Collections:",
      await connection.connection.db.listCollections().toArray()
    );

    return connection;
  } catch (error) {
    console.error("✗ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;