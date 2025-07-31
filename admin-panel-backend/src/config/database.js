import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(`Db connected ${connection.connection.host}`);
    // console.log(`MongoDB version : ${connection.version}`);
  } catch (err) {
    console.log(err);
    throw new Error("Error connecting to the database", err);
  }
};

export default connectDB;
