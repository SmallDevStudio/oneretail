import mongoose from "mongoose";

const connetMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("MongoDB connected");
    } catch (error) {
        console.log(error);
    }
}

export default connetMongoDB;