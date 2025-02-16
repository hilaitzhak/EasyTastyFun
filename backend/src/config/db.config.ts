import dotenv from "dotenv";
import mongoose from 'mongoose';

dotenv.config();

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string, {
            dbName: 'recipes_app',
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 45000,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};