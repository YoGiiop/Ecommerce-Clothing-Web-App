import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(`${process.env.MONGODB_URI}/e-commerce`)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.log("Error connecting to MongoDB:", error.message);
    });
};

export default connectDB;
