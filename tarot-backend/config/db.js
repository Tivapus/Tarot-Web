const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);

    console.log('🌐 MONGO_URL:', process.env.MONGO_URL);
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
