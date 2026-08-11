const mongoose = require('mongoose');
const dns = require('dns');

// Explicitly set Node.js DNS resolver to Google/Cloudflare DNS to resolve Atlas SRV records on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.log('DNS setServers notice:', e.message);
}

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    if (uri && uri.trim() !== '') {
      console.log('Connecting to provided MongoDB URI...');
      await mongoose.connect(uri);
      console.log('MongoDB Connected successfully!');
      return;
    }

    console.log('No MONGO_URI specified. Starting in-memory MongoDB engine for zero-setup local dev...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const memoryUri = mongoServer.getUri();

    await mongoose.connect(memoryUri);
    console.log(`In-Memory MongoDB Connected at: ${memoryUri}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Graceful fallback to memory server if local MongoDB is unreachable
    try {
      console.log('Attempting fallback to MongoMemoryServer...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const memoryUri = mongoServer.getUri();
      await mongoose.connect(memoryUri);
      console.log('Fallback In-Memory MongoDB Connected!');
    } catch (fallbackErr) {
      console.error('Failed to initialize fallback database:', fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
