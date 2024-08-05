import mongoose from "mongoose";

export default defineNitroPlugin(async () => {
    await mongoose.connect(useRuntimeConfig().MONGODB_URI);
    console.log("MongoDB Connected");
});
