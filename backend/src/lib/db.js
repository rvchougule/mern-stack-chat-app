import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB Connected !! DB HOst: - ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error("MongoDB Connection Failed: -", err);
    process.exit(1); //exit the application immediately
  }
};

export default connectDB;
