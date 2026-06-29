
import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()
// Function to connect to MongoDB using Promise
function connectDB() {
  return new Promise((resolve, reject) => {
    const dbURL = process.env.MONGODB_URI; 

    if (!dbURL) {
      return reject(new Error("DB_URL is not defined in environment variables"));
    }

    mongoose.connect(dbURL)
      .then(() => {
        console.log(" Database connected successfully");
        resolve();
      })
      .catch((err) => {
        console.error(" Database connection failed:", err.message);
        reject(err);
      });
  });
}

export default connectDB
