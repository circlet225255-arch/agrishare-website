const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const connect = async () => {
    try {
      const mongoUri = process.env.MONGODB_URI;
      
      if (!mongoUri) {
        throw new Error('MONGODB_URI is not defined in .env file');
      }

      const connection = await mongoose.connect(mongoUri, {
        dbName: process.env.MONGODB_DB_NAME || 'agrishare',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        retryWrites: true,
        w: 'majority',
        maxPoolSize: 10,
        minPoolSize: 2,
      });

      console.log(`✅ MongoDB Connected Successfully`);
      console.log(`   Database: ${connection.connection.name}`);
      console.log(`   Host: ${connection.connection.host}`);

      return connection;
    } catch (error) {
      retries++;

      if (retries <= maxRetries) {
        const waitTime = Math.min(1000 * Math.pow(2, retries - 1), 30000);
        console.warn(`⚠️  MongoDB Connection Attempt ${retries}/${maxRetries} failed`);
        console.warn(`   Error: ${error.message}`);
        console.warn(`   Retrying in ${waitTime / 1000}s...`);
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return connect();
      } else {
        console.error(`❌ MongoDB Connection Error (Max Retries Exceeded):`);
        console.error(`   ${error.message}`);
        console.error(`\n⚠️  TROUBLESHOOTING:`);
        console.error(`   1. Check MongoDB URI in .env file`);
        console.error(`   2. Verify internet connection`);
        console.error(`   3. Check firewall/VPN settings`);
        console.error(`   4. Ensure MongoDB Atlas cluster is active`);
        console.error(`   5. Check IP whitelist in MongoDB Atlas\n`);
        
        // Don't exit - allow server to start in offline mode
        console.log(`\n⚙️  Starting server in OFFLINE MODE (no database)`);
        console.log(`   Features requiring database will be unavailable\n`);
        return null;
      }
    }
  };

  return connect();
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('⚠️  Mongoose connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  Mongoose disconnected from MongoDB');
});

process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ Mongoose connection closed');
  } catch (err) {
    console.error('Error closing connection:', err);
  }
  process.exit(0);
});

module.exports = connectDB;
