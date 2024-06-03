import mongoose from "mongoose";

const connetMongoDB = async () => {
    try {
        await mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URL, {
            serverSelectionTimeoutMS: 5000, // เพิ่ม timeout
            socketTimeoutMS: 45000, // เพิ่ม socket timeout
        });
        console.log("MongoDB connected");
    } catch (error) {
        console.log("MongoDB connection error: ", error);
    }
}

export default connetMongoDB;