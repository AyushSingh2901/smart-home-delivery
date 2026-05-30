import mongoose from 'mongoose';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (retries = 8, delayMs = 3000) => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_home_services';

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      const shouldRetry = attempt < retries;
      console.error(
        `MongoDB connection failed (${attempt}/${retries}): ${error.message}${shouldRetry ? `; retrying in ${delayMs / 1000}s` : ''}`
      );
      if (!shouldRetry) process.exit(1);
      await wait(delayMs);
    }
  }
};
