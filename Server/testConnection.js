const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('Environment variables:');
    console.log('- MONGODB_URL:', process.env.MONGODB_URL || 'NOT SET');
    console.log('- NODE_ENV:', process.env.NODE_ENV || 'NOT SET');
    
    const mongoURI = process.env.MONGODB_URL || 'mongodb://localhost:27017/neoshiksha';
    console.log('📡 Attempting to connect to:', mongoURI);
    
    // Set connection options
    const options = {
      serverSelectionTimeoutMS: 5000, // 5 seconds
      socketTimeoutMS: 45000, // 45 seconds
      bufferCommands: false // Disable mongoose buffering
    };
    
    await mongoose.connect(mongoURI, options);
    
    
    // Test a simple operation
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('📚 Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('💡 Troubleshooting tips:');
    console.log('1. Make sure MongoDB is running');
    console.log('2. Check if MongoDB is on port 27017');
    console.log('3. Try: mongod --version');
    console.log('4. For MongoDB Atlas, check your connection string');
  }
};

testConnection(); 