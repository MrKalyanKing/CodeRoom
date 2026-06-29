import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

export default async function connectDB() {
  const dbURL = process.env.MONGODB_URI;
  if (!dbURL) throw new Error('MONGODB_URI is not defined in environment variables');

  // Workaround for Node.js DNS SRV lookup issues on some Windows machines/ISPs
  dns.setServers(['8.8.8.8', '1.1.1.1']);

  await mongoose.connect(dbURL);
  console.log('Database connected successfully');
}
