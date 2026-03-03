import mongoose from "mongoose";

/**
 * @param {void}
 * @return {void}
 *
 */

export const Connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI!);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Failed to connect to database");
    process.exit(1);
  }
};
