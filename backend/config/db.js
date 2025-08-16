import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://storeimpress:Impress12313@cluster0.wz4q1dl.mongodb.net/impresss').then(()=>console.log("DB Connected"));
}