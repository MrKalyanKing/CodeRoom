
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export default async function connectDB() {
  const dbURL = process.env.MONGODB_URI;
  if (!dbURL) throw new Error('MONGODB_URI is not defined in environment variables');

  await mongoose.connect(dbURL);
  console.log('Database connected successfully');
}
