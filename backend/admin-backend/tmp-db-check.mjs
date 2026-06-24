import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config({ path: './.env' });

console.log('Using .env file at backend/admin-backend/.env');
console.log('MONGO_URI=' + process.env.MONGO_URI);

try {
  const conn = await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
  console.log('MongoDB connected host:', conn.connection.host);
  console.log('MongoDB name:', conn.connection.name);
  await mongoose.disconnect();
  console.log('DISCONNECTED');
} catch (err) {
  console.error('CONNECTION ERROR:');
  console.error(err.message || err);
  process.exit(1);
}
