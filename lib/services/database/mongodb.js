import mongoose from "mongoose";

const connection = {};

const connetMongoDB = async () => {
    if (connection.isConnected) {
        return;
    }

    const mongoUri = process.env.NEXT_PUBLIC_MONGODB_URL;
    if (!mongoUri) {
        throw new Error('Please define the NEXT_PUBLIC_MONGODB_URL environment variable inside .env.local');
    }

    try {
        const db = await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        connection.isConnected = db.connections[0].readyState;
        console.log('Connected to MongoDB');
      } catch (error) {
        console.error('Error connecting to MongoDB', error);
        throw error;
      }
}

export default connetMongoDB;